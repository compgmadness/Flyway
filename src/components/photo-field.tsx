import { Camera, ImagePlus, X } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AVATAR_MAX_CHARS,
  PHOTO_MAX_CHARS,
  compressImage,
  initialsFor,
} from "@/lib/flyway/photo";
import { cn } from "@/lib/utils";

export function HunterMark({
  name,
  src,
  size = "md",
}: {
  name: string;
  src?: string;
  size?: "sm" | "md";
}) {
  const dim = size === "sm" ? "size-9 text-xs" : "size-12 text-sm";
  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={cn("shrink-0 rounded-full object-cover shadow-border", dim)}
      />
    );
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-full bg-elevated font-display text-sage shadow-border",
        dim,
      )}
    >
      {initialsFor(name)}
    </span>
  );
}

export function AvatarField({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (next: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const data = await compressImage(file, { maxEdge: 320, maxChars: AVATAR_MAX_CHARS });
      onChange(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t use that photo.");
    }
  }

  return (
    <div>
      <span className="mb-1.5 block text-xs tracking-widest text-subtle uppercase">
        Profile picture
      </span>
      <div className="flex items-center gap-3">
        <HunterMark name={name || "Hunter"} src={value} />
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            void onFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <Button type="button" variant="secondary" size="sm" onClick={() => inputRef.current?.click()}>
          <Camera />
          {value ? "Change" : "Add photo"}
        </Button>
        {value ? (
          <Button type="button" variant="ghost" size="sm" onClick={() => onChange("")}>
            Remove
          </Button>
        ) : null}
      </div>
      {error ? <p className="mt-2 text-sm text-hunt-poor">{error}</p> : null}
    </div>
  );
}

export function AttachPhoto({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function onFile(file: File | undefined) {
    if (!file) return;
    setError(null);
    try {
      const data = await compressImage(file, { maxEdge: 1280, maxChars: PHOTO_MAX_CHARS });
      onChange(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn’t use that photo.");
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void onFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="relative overflow-hidden rounded-md bg-elevated">
          <img src={value} alt="" className="max-h-64 w-full object-cover" />
          <Button
            type="button"
            variant="secondary"
            size="icon"
            className="absolute top-2 right-2"
            aria-label="Remove photo"
            onClick={() => onChange("")}
          >
            <X />
          </Button>
        </div>
      ) : (
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()}>
          <ImagePlus />
          Add a photo
        </Button>
      )}
      {error ? <p className="mt-2 text-sm text-hunt-poor">{error}</p> : null}
    </div>
  );
}
