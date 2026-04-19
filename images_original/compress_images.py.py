from pathlib import Path
from PIL import Image

SOURCE_DIR = Path("images/original")
TARGET_DIR = Path("images")

JPEG_QUALITY = 82
PNG_COMPRESS_LEVEL = 9
MAX_WIDTH = 1600
MAX_HEIGHT = 1600

TARGET_DIR.mkdir(parents=True, exist_ok=True)

def process_image(src_path: Path):
    ext = src_path.suffix.lower()
    dst_path = TARGET_DIR / src_path.name

    try:
        with Image.open(src_path) as img:
            img = img.convert("RGBA") if img.mode in ("RGBA", "LA", "P") else img.convert("RGB")

            # proportional verkleinern, falls zu groß
            img.thumbnail((MAX_WIDTH, MAX_HEIGHT))

            if ext in [".jpg", ".jpeg"]:
                if img.mode != "RGB":
                    img = img.convert("RGB")
                img.save(
                    dst_path,
                    format="JPEG",
                    quality=JPEG_QUALITY,
                    optimize=True,
                    progressive=True
                )

            elif ext == ".png":
                img.save(
                    dst_path,
                    format="PNG",
                    optimize=True,
                    compress_level=PNG_COMPRESS_LEVEL
                )

            else:
                print(f"Übersprungen (nicht unterstützt): {src_path.name}")
                return

        old_size = src_path.stat().st_size / 1024
        new_size = dst_path.stat().st_size / 1024
        print(f"OK: {src_path.name} | {old_size:.0f} KB -> {new_size:.0f} KB")

    except Exception as e:
        print(f"FEHLER bei {src_path.name}: {e}")

for file_path in SOURCE_DIR.iterdir():
    if file_path.is_file():
        process_image(file_path)

print("Fertig.")