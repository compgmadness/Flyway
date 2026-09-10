#!/usr/bin/env python3
"""Rasterize brand/flyway-logo.png into web, Play, and Android launcher icons."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import numpy as np

ROOT = Path(__file__).resolve().parents[1]
LOGO = ROOT / "brand" / "flyway-logo.png"
NAVY = (36, 40, 51, 255)


def load_logo() -> Image.Image:
    return Image.open(LOGO).convert("RGBA")


def fit(im: Image.Image, size: int, bg=None) -> Image.Image:
    canvas = Image.new("RGBA", (size, size), bg if bg is not None else (0, 0, 0, 0))
    scaled = im.resize((size, size), Image.Resampling.LANCZOS)
    canvas.paste(scaled, (0, 0), scaled)
    return canvas


def adaptive_foreground(logo: Image.Image, size: int) -> Image.Image:
    # Keep the wordmark inside the 66% adaptive safe zone.
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    inner = max(8, int(size * 0.66))
    bird = logo.resize((inner, inner), Image.Resampling.LANCZOS)
    canvas.paste(bird, ((size - inner) // 2, (size - inner) // 2), bird)
    return canvas


def round_icon(logo: Image.Image, size: int) -> Image.Image:
    return fit(logo, size, bg=(0, 0, 0, 0))


def square_icon(logo: Image.Image, size: int) -> Image.Image:
    return fit(logo, size, bg=NAVY)


def notify_silhouette(logo: Image.Image, size: int) -> Image.Image:
    arr = np.asarray(logo)
    r, g, b, a = arr[:, :, 0], arr[:, :, 1], arr[:, :, 2], arr[:, :, 3]
    # White bird only — skip the gold wing and the FLYWAY wordmark.
    white = (r > 210) & (g > 210) & (b > 180) & (a > 40)
    h, w = white.shape
    white[int(h * 0.62) :, :] = False
    ys, xs = np.where(white)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    if len(xs) == 0:
        return out
    x0, x1 = int(xs.min()), int(xs.max()) + 1
    y0, y1 = int(ys.min()), int(ys.max()) + 1
    crop = Image.fromarray((white[y0:y1, x0:x1] * 255).astype("uint8"), "L")
    pad = int(max(crop.size) * 0.14)
    box = max(crop.size) + pad * 2
    sil = Image.new("L", (box, box), 0)
    sil.paste(crop, ((box - crop.size[0]) // 2, (box - crop.size[1]) // 2))
    sil = sil.resize((size, size), Image.Resampling.LANCZOS)
    rgba = Image.new("RGBA", (size, size), (255, 255, 255, 0))
    rgba.putalpha(sil)
    return rgba


def write_png(im: Image.Image, path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    im.save(path, "PNG")


def main() -> None:
    logo = load_logo()

    write_png(fit(logo, 512), ROOT / "public" / "logo.png")
    write_png(fit(logo, 64), ROOT / "public" / "favicon.png")
    write_png(fit(logo, 180), ROOT / "public" / "__grok" / "icon-180.png")
    write_png(fit(logo, 512, bg=NAVY), ROOT / "public" / "play" / "icon-512.png")

    res = ROOT / "android" / "res"
    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192,
    }
    fg_sizes = {
        "mipmap-mdpi": 108,
        "mipmap-hdpi": 162,
        "mipmap-xhdpi": 216,
        "mipmap-xxhdpi": 324,
        "mipmap-xxxhdpi": 432,
    }
    notify_sizes = {
        "drawable-mdpi": 24,
        "drawable-hdpi": 36,
        "drawable-xhdpi": 48,
        "drawable-xxhdpi": 72,
        "drawable-xxxhdpi": 96,
    }
    for folder, size in sizes.items():
        dest = res / folder
        write_png(square_icon(logo, size), dest / "ic_launcher.png")
        write_png(round_icon(logo, size), dest / "ic_launcher_round.png")
        write_png(adaptive_foreground(logo, fg_sizes[folder]), dest / "ic_launcher_foreground.png")
    for folder, size in notify_sizes.items():
        write_png(notify_silhouette(logo, size), res / folder / "ic_notify.png")
    write_png(notify_silhouette(logo, 24), res / "drawable" / "ic_notify.png")

    print("brand icons written")


if __name__ == "__main__":
    main()
