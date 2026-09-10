#!/usr/bin/env bash
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export PATH="$ROOT/node_modules/.bin:$PATH"

BT="${ANDROID_BUILD_TOOLS:-/tmp/android-sdk/android-14}"
PLATFORM="${ANDROID_PLATFORM:-/tmp/android-sdk/android-34}"
export LD_LIBRARY_PATH="${BT}/lib64:${LD_LIBRARY_PATH:-}"

if [[ ! -x "$BT/aapt2" || ! -f "$PLATFORM/android.jar" ]]; then
  echo "Android build-tools missing. Download them first." >&2
  exit 1
fi

echo "==> bundling Flyway for WebView"
node scripts/with-app-env.mjs vite build --config vite.apk.config.ts

mkdir -p android/assets/www/id
cp -R public/id/. android/assets/www/id/

if [[ -f android/assets/www/apk/index.html ]]; then
  mv android/assets/www/apk/index.html android/assets/www/index.html
  rmdir android/assets/www/apk 2>/dev/null || true
fi

python3 - <<'PY'
from pathlib import Path
cands = list(Path("android/assets/www").rglob("index.html"))
if not cands:
    raise SystemExit("APK web bundle missing index.html")
html_file = Path("android/assets/www/index.html")
src = cands[0]
html = src.read_text()
html = html.replace(' type="module"', "").replace(" crossorigin", "")
html = html.replace("../app.js", "./app.js").replace("../style.css", "./style.css")
html = html.replace('src="/app.js"', 'src="./app.js"').replace("src='/app.js'", "src='./app.js'")
html = html.replace('href="/style.css"', 'href="./style.css"')
# classic script in <head> would run before #root; defer it and keep CSS in head
import re
scripts = re.findall(r'<script[^>]*src="[^"]+"[^>]*></script>', html)
html = re.sub(r'<script[^>]*src="[^"]+"[^>]*></script>\s*', "", html)
if 'src="./app.js"' not in "".join(scripts):
    scripts.append('<script src="./app.js" defer></script>')
else:
    scripts = [s.replace("<script ", '<script defer ') if "defer" not in s else s for s in scripts]
if "</body>" in html:
    html = html.replace("</body>", "    " + "\n    ".join(scripts) + "\n  </body>")
else:
    html += "\n".join(scripts)
if src != html_file:
    src.unlink()
html_file.write_text(html)
print(f"rewrote {html_file}")
print(html_file.read_text())
PY

echo "==> launcher icons"
python3 - <<'PY'
from pathlib import Path
from PIL import Image, ImageDraw

root = Path("android/res")
sizes = {
    "mipmap-mdpi": 48,
    "mipmap-hdpi": 72,
    "mipmap-xhdpi": 96,
    "mipmap-xxhdpi": 144,
    "mipmap-xxxhdpi": 192,
}
# Adaptive-icon foreground is 108dp; xxxhdpi = 432px
fg_sizes = {
    "mipmap-mdpi": 108,
    "mipmap-hdpi": 162,
    "mipmap-xhdpi": 216,
    "mipmap-xxhdpi": 324,
    "mipmap-xxxhdpi": 432,
}
SAGE = (154, 173, 160, 255)
DARK = (14, 18, 16, 255)


def flock(draw: ImageDraw.ImageDraw, size: float, fill, pad: float = 0.22) -> None:
    # Keep the bird inside the adaptive safe zone (inner ~66%).
    s = size
    p = pad
    draw.polygon(
        [
            (s * (p + 0.02), s * 0.62),
            (s * 0.42, s * (p + 0.12)),
            (s * 0.50, s * 0.50),
            (s * 0.58, s * (p + 0.12)),
            (s * (1 - p - 0.02), s * 0.62),
            (s * 0.58, s * 0.54),
            (s * 0.50, s * (1 - p)),
            (s * 0.42, s * 0.54),
        ],
        fill=fill,
    )


def square_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), SAGE)
    d = ImageDraw.Draw(img)
    flock(d, size, DARK, pad=0.20)
    return img


def round_icon(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    d.ellipse((1, 1, size - 2, size - 2), fill=SAGE)
    flock(d, size, DARK, pad=0.22)
    return img


def foreground(size: int) -> Image.Image:
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    flock(d, size, DARK, pad=0.28)
    return img


for folder, size in sizes.items():
    dest = root / folder
    dest.mkdir(parents=True, exist_ok=True)
    square_icon(size).save(dest / "ic_launcher.png", "PNG")
    round_icon(size).save(dest / "ic_launcher_round.png", "PNG")
    foreground(fg_sizes[folder]).save(dest / "ic_launcher_foreground.png", "PNG")
print("icons written")
PY

WORKDIR="${TMPDIR:-/tmp}/flyway-apk-build"
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR/compiled" "$WORKDIR/gen" "$WORKDIR/classes"

echo "==> aapt2 compile/link"
"$BT/aapt2" compile --dir android/res -o "$WORKDIR/compiled.flata"

"$BT/aapt2" link \
  -o "$WORKDIR/unaligned.apk" \
  --manifest android/AndroidManifest.xml \
  -I "$PLATFORM/android.jar" \
  --java "$WORKDIR/gen" \
  -A android/assets \
  --auto-add-overlay \
  "$WORKDIR/compiled.flata"

echo "==> javac"
find android/src "$WORKDIR/gen" -name '*.java' > "$WORKDIR/sources.list"
javac --release 8 \
  -classpath "$PLATFORM/android.jar" \
  -d "$WORKDIR/classes" \
  @"$WORKDIR/sources.list"

echo "==> d8"
(
  cd "$WORKDIR/classes"
  jar cf "$WORKDIR/classes.jar" .
)
"$BT/d8" --release --min-api 24 --lib "$PLATFORM/android.jar" --output "$WORKDIR" "$WORKDIR/classes.jar"

echo "==> package dex"
cp "$WORKDIR/unaligned.apk" "$WORKDIR/packaged.apk"
(
  cd "$WORKDIR"
  "$BT/aapt" add -f packaged.apk classes.dex
)

echo "==> zipalign"
"$BT/zipalign" -f -p 4 "$WORKDIR/packaged.apk" "$WORKDIR/aligned.apk"

KS="$ROOT/android/flyway.keystore"
if [[ ! -f "$KS" ]]; then
  keytool -genkeypair -v \
    -keystore "$KS" \
    -alias flyway \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass flyway-sideload \
    -keypass flyway-sideload \
    -dname "CN=Flyway, OU=Flyway, O=Flyway, L=Denver, ST=CO, C=US"
fi

echo "==> sign"
"$BT/apksigner" sign \
  --ks "$KS" \
  --ks-pass pass:flyway-sideload \
  --key-pass pass:flyway-sideload \
  --min-sdk-version 24 \
  --out "$WORKDIR/Flyway.apk" \
  "$WORKDIR/aligned.apk"

"$BT/apksigner" verify --verbose "$WORKDIR/Flyway.apk"

mkdir -p "$ROOT/public" "$ROOT/artifacts"
cp "$WORKDIR/Flyway.apk" "$ROOT/public/flyway.apk"
cp "$WORKDIR/Flyway.apk" "$ROOT/artifacts/Flyway.apk"
ls -lh "$ROOT/public/flyway.apk" "$ROOT/artifacts/Flyway.apk"
echo "APK ready"
