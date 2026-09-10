#!/usr/bin/env bash
# Build a Play-signed Android App Bundle from the already-compiled APK work dir,
# or compile from scratch. Intended to run after scripts/build-apk.sh, or standalone.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export PATH="$ROOT/node_modules/.bin:$PATH"

BT="${ANDROID_BUILD_TOOLS:-/tmp/android-sdk/android-14}"
PLATFORM="${ANDROID_PLATFORM:-/tmp/android-sdk/android-34}"
export LD_LIBRARY_PATH="${BT}/lib64:${LD_LIBRARY_PATH:-}"
BUNDLETOOL="${BUNDLETOOL:-/tmp/bundletool.jar}"

if [[ ! -x "$BT/aapt2" || ! -f "$PLATFORM/android.jar" ]]; then
  echo "Android build-tools missing." >&2
  exit 1
fi
if [[ ! -f "$BUNDLETOOL" ]]; then
  echo "==> downloading bundletool"
  curl -fsSL -o "$BUNDLETOOL" "https://github.com/google/bundletool/releases/download/1.18.1/bundletool-all-1.18.1.jar"
fi

WORKDIR="${TMPDIR:-/tmp}/flyway-aab-build"
rm -rf "$WORKDIR"
mkdir -p "$WORKDIR/compiled" "$WORKDIR/gen" "$WORKDIR/classes" "$WORKDIR/base/manifest" "$WORKDIR/base/dex"

echo "==> bundling Flyway for WebView (Play)"
node scripts/with-app-env.mjs vite build --config vite.apk.config.ts
mkdir -p android/assets/www/id
cp -R public/id/. android/assets/www/id/
if [[ -f android/assets/www/apk/index.html ]]; then
  mv android/assets/www/apk/index.html android/assets/www/index.html
  rmdir android/assets/www/apk 2>/dev/null || true
fi
python3 - <<'PY'
from pathlib import Path
import re
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
PY

# reuse icon generation from build-apk
bash -c 'source /dev/null'
python3 - <<'PY'
from pathlib import Path
from PIL import Image, ImageDraw
root = Path("android/res")
sizes = {"mipmap-mdpi": 48, "mipmap-hdpi": 72, "mipmap-xhdpi": 96, "mipmap-xxhdpi": 144, "mipmap-xxxhdpi": 192}
fg_sizes = {"mipmap-mdpi": 108, "mipmap-hdpi": 162, "mipmap-xhdpi": 216, "mipmap-xxhdpi": 324, "mipmap-xxxhdpi": 432}
SAGE = (154, 173, 160, 255)
DARK = (14, 18, 16, 255)
def flock(draw, size, fill, pad=0.22):
    s = size; p = pad
    draw.polygon([(s*(p+0.02), s*0.62),(s*0.42, s*(p+0.12)),(s*0.50, s*0.50),(s*0.58, s*(p+0.12)),(s*(1-p-0.02), s*0.62),(s*0.58, s*0.54),(s*0.50, s*(1-p)),(s*0.42, s*0.54)], fill=fill)
for folder, size in sizes.items():
    dest = root / folder
    dest.mkdir(parents=True, exist_ok=True)
    img = Image.new("RGBA", (size, size), SAGE)
    d = ImageDraw.Draw(img); flock(d, size, DARK, 0.20)
    img.save(dest / "ic_launcher.png", "PNG")
    img2 = Image.new("RGBA", (size, size), (0,0,0,0)); d2 = ImageDraw.Draw(img2)
    d2.ellipse((1,1,size-2,size-2), fill=SAGE); flock(d2, size, DARK, 0.22)
    img2.save(dest / "ic_launcher_round.png", "PNG")
    fg = Image.new("RGBA", (fg_sizes[folder], fg_sizes[folder]), (0,0,0,0))
    flock(ImageDraw.Draw(fg), fg_sizes[folder], DARK, 0.28)
    fg.save(dest / "ic_launcher_foreground.png", "PNG")
print("icons written")
PY

echo "==> aapt2 proto-format"
"$BT/aapt2" compile --dir android/res -o "$WORKDIR/compiled.flata"
"$BT/aapt2" link \
  --proto-format \
  -o "$WORKDIR/linked.zip" \
  --manifest android/AndroidManifest.xml \
  -I "$PLATFORM/android.jar" \
  --java "$WORKDIR/gen" \
  -A android/assets \
  --auto-add-overlay \
  "$WORKDIR/compiled.flata"

echo "==> javac + d8"
find android/src "$WORKDIR/gen" -name '*.java' > "$WORKDIR/sources.list"
javac --release 8 \
  -classpath "$PLATFORM/android.jar" \
  -d "$WORKDIR/classes" \
  @"$WORKDIR/sources.list"
(
  cd "$WORKDIR/classes"
  jar cf "$WORKDIR/classes.jar" .
)
"$BT/d8" --release --min-api 24 --lib "$PLATFORM/android.jar" --output "$WORKDIR" "$WORKDIR/classes.jar"

echo "==> assemble base module"
python3 - <<PY
import zipfile
from pathlib import Path
work = Path("$WORKDIR")
linked = work / "linked.zip"
base = work / "base"
with zipfile.ZipFile(linked) as z:
    z.extractall(work / "linked")
linked_dir = work / "linked"
man = next(linked_dir.rglob("AndroidManifest.xml"))
(base / "manifest").mkdir(parents=True, exist_ok=True)
(base / "dex").mkdir(parents=True, exist_ok=True)
man.replace(base / "manifest" / "AndroidManifest.xml")
res_pb = linked_dir / "resources.pb"
if res_pb.exists():
    res_pb.replace(base / "resources.pb")
for name in ("res", "assets"):
    src = linked_dir / name
    if src.exists():
        dest = base / name
        if dest.exists():
            import shutil
            shutil.rmtree(dest)
        src.rename(dest)
dex = work / "classes.dex"
if not dex.exists():
    raise SystemExit("classes.dex missing")
dex.replace(base / "dex" / "classes.dex")
out = work / "base.zip"
if out.exists():
    out.unlink()
with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
    for path in base.rglob("*"):
        if path.is_file():
            z.write(path, path.relative_to(base).as_posix())
print("base.zip", out.stat().st_size)
PY

echo "==> bundletool"
java -jar "$BUNDLETOOL" build-bundle \
  --modules="$WORKDIR/base.zip" \
  --output="$WORKDIR/Flyway-unsigned.aab"

KS="$ROOT/android/play-upload.keystore"
PASS_FILE="$ROOT/android/play-upload.pass"
if [[ ! -f "$KS" ]]; then
  PASS="$(python3 -c 'import secrets; print(secrets.token_urlsafe(18))')"
  printf '%s' "$PASS" > "$PASS_FILE"
  chmod 600 "$PASS_FILE"
  keytool -genkeypair \
    -keystore "$KS" \
    -alias flyway-upload \
    -keyalg RSA -keysize 2048 -validity 10000 \
    -storepass "$PASS" \
    -keypass "$PASS" \
    -dname "CN=Flyway, OU=Flyway, O=Flyway, L=Denver, ST=CO, C=US"
fi
PASS="$(cat "$PASS_FILE")"

echo "==> sign AAB"
cp "$WORKDIR/Flyway-unsigned.aab" "$WORKDIR/Flyway.aab"
jarsigner -sigalg SHA256withRSA -digestalg SHA-256 \
  -keystore "$KS" \
  -storepass "$PASS" \
  -keypass "$PASS" \
  "$WORKDIR/Flyway.aab" flyway-upload >/dev/null

jarsigner -verify -verbose -certs "$WORKDIR/Flyway.aab" 2>&1 | tail -8

mkdir -p "$ROOT/public" "$ROOT/artifacts"
cp "$WORKDIR/Flyway.aab" "$ROOT/public/flyway.aab"
cp "$WORKDIR/Flyway.aab" "$ROOT/artifacts/Flyway.aab"
keytool -exportcert -rfc \
  -keystore "$KS" -alias flyway-upload \
  -storepass "$PASS" \
  -file "$ROOT/artifacts/play-upload.pem" >/dev/null
{
  echo "Flyway Play upload key"
  echo "keystore: keep android/play-upload.keystore AND android/play-upload.pass together"
  echo "alias: flyway-upload"
  echo "package: app.flyway.brief"
  echo "versionName: 2.0   versionCode: 20"
} > "$ROOT/artifacts/play-upload-readme.txt"
ls -lh "$ROOT/public/flyway.aab" "$ROOT/artifacts/Flyway.aab"
echo "AAB ready"
