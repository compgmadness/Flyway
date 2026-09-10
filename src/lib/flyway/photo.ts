const DATA_PREFIX = /^data:image\/(jpeg|jpg|png|webp);base64,/i;

export const AVATAR_MAX_CHARS = 90_000;
export const PHOTO_MAX_CHARS = 240_000;

export function isImageDataUrl(value: string): boolean {
  return DATA_PREFIX.test(value) && value.length > 32;
}

export function parseImageDataUrl(value: unknown, maxChars: number): string {
  if (value == null || value === "") return "";
  if (typeof value !== "string") throw new Error("That photo didn’t save.");
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (!isImageDataUrl(trimmed)) throw new Error("Use a JPEG, PNG, or WebP.");
  if (trimmed.length > maxChars) throw new Error("That photo is too large. Try a closer crop.");
  return trimmed;
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Couldn’t read that photo."));
    img.src = src;
  });
}

function toJpeg(canvas: HTMLCanvasElement, quality: number): string {
  return canvas.toDataURL("image/jpeg", quality);
}

export async function compressImage(
  file: File,
  opts: { maxEdge: number; maxChars: number },
): Promise<string> {
  if (!file.type.startsWith("image/")) {
    throw new Error("Pick a photo.");
  }
  const objectUrl = URL.createObjectURL(file);
  try {
    const img = await loadImage(objectUrl);
    let edge = opts.maxEdge;
    let quality = 0.72;
    for (let i = 0; i < 6; i += 1) {
      const scale = Math.min(1, edge / Math.max(img.width, img.height, 1));
      const width = Math.max(1, Math.round(img.width * scale));
      const height = Math.max(1, Math.round(img.height * scale));
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Couldn’t process that photo.");
      ctx.drawImage(img, 0, 0, width, height);
      const data = toJpeg(canvas, quality);
      if (data.length <= opts.maxChars) return data;
      edge = Math.round(edge * 0.82);
      quality = Math.max(0.45, quality - 0.08);
    }
    throw new Error("That photo is too large. Try a closer crop.");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "H";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[1][0] ?? ""}`.toUpperCase();
}
