from pathlib import Path
from PIL import Image, ImageOps

# Quelle: große Bilder
SRC_DIR = Path("images_large")

# Ziel: weboptimierte Bilder
OUT_DIR = Path("images")

# Lange Kante für Webseite. 1200 ist meist ein guter Kompromiss.
MAX_EDGE = 1200

OUT_DIR.mkdir(exist_ok=True)

if not SRC_DIR.exists():
    raise SystemExit("FEHLER: Ordner images_large wurde nicht gefunden. Bitte Script im Projektordner svens-kochbuch starten.")

files = sorted([p for p in SRC_DIR.iterdir() if p.suffix.lower() in [".png", ".jpg", ".jpeg", ".webp"]])

if not files:
    raise SystemExit("FEHLER: Keine Bilddateien in images_large gefunden.")

print(f"Quelle: {SRC_DIR.resolve()}")
print(f"Ziel:   {OUT_DIR.resolve()}")
print(f"Bilder: {len(files)}")
print()

for src in files:
    # Dateiname und Endung komplett klein
    out_name = src.stem.lower() + ".png"
    out_path = OUT_DIR / out_name

    img = Image.open(src)
    img = ImageOps.exif_transpose(img).convert("RGB")

    w, h = img.size
    scale = min(1.0, MAX_EDGE / max(w, h))
    new_size = (round(w * scale), round(h * scale))

    if new_size != (w, h):
        img = img.resize(new_size, Image.Resampling.LANCZOS)

    # PNG-Optimierung ist verlustfrei. Das Herunterrechnen selbst reduziert aber Pixel.
    img.save(out_path, "PNG", optimize=True)

    old_kb = src.stat().st_size / 1024
    new_kb = out_path.stat().st_size / 1024

    print(f"{src.name} -> {out_name} | {w}x{h} -> {new_size[0]}x{new_size[1]} | {old_kb:.0f} KB -> {new_kb:.0f} KB")

print()
print("FERTIG: Weboptimierte PNG-Dateien liegen im Ordner images.")
print("Hinweis: PNG-Optimierung ist verlustfrei; die Größenreduzierung durch Resize ist visuell optimiert, aber technisch nicht pixelverlustfrei.")
