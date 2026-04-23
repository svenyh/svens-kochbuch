from pathlib import Path
from PIL import Image

SOURCE_DIR = Path("images_original")
TARGET_DIR = Path("images")

MAX_WIDTH = 768
MAX_HEIGHT = 1152

JPEG_QUALITY = 82
PNG_COLORS = 256

TARGET_DIR.mkdir(parents=True, exist_ok=True)

def process_image(src_path: Path):
    ext = src_path.suffix.lower()
    dst_path = TARGET_DIR / src_path.name

    try:
        with Image.open(src_path) as img:
            has_alpha = (
                img.mode in ("RGBA", "LA")
                or (img.mode == "P" and "transparency" in img.info)
            )

            img.thumbnail((MAX_WIDTH, MAX_HEIGHT), Image.LANCZOS)

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
                if has_alpha:
                    img = img.convert("RGBA")
                    img = img.quantize(colors=PNG_COLORS)
                else:
                    img = img.convert("P", palette=Image.ADAPTIVE, colors=PNG_COLORS)

                img.save(
                    dst_path,
                    format="PNG",
                    optimize=True
                )

            else:
                print(f"Übersprungen: {src_path.name}")
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