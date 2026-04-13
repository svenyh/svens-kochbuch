from __future__ import annotations

import sys
from pathlib import Path
from PIL import Image, ImageOps

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def resize_image(img: Image.Image, max_size: tuple[int, int]) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    resized = img.copy()
    resized.thumbnail(max_size, Image.Resampling.LANCZOS)
    return resized


def optimize_to_png(src_file: Path, src_root: Path, dst_root: Path, max_size: tuple[int, int]) -> None:
    relative_path = src_file.relative_to(src_root)
    dst_relative = relative_path.with_suffix(".png")
    dst_file = dst_root / dst_relative
    dst_file.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(src_file) as img:
        img = resize_image(img, max_size)

        if img.mode not in ("RGB", "RGBA", "L", "LA", "P"):
            img = img.convert("RGBA")

        img.save(
            dst_file,
            format="PNG",
            optimize=True,
            compress_level=9,
        )

    old_size = src_file.stat().st_size / 1024
    new_size = dst_file.stat().st_size / 1024
    print(f"[OK] {relative_path} -> {dst_relative} | {old_size:.1f} KB -> {new_size:.1f} KB")


def main() -> None:
    if len(sys.argv) < 3:
        print("Verwendung:")
        print("python optimize_to_png.py <eingabeordner> <ausgabeordner>")
        print("Beispiel:")
        print("python optimize_to_png.py images images_png")
        sys.exit(1)

    src_root = Path(sys.argv[1]).resolve()
    dst_root = Path(sys.argv[2]).resolve()

    if not src_root.exists() or not src_root.is_dir():
        print(f"Eingabeordner nicht gefunden: {src_root}")
        sys.exit(1)

    files = [
        p for p in src_root.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not files:
        print("Keine unterstützten Bilddateien gefunden.")
        sys.exit(0)

    print(f"Starte PNG-Optimierung für {len(files)} Datei(en)...")
    print(f"Quelle: {src_root}")
    print(f"Ziel:   {dst_root}")
    print("-" * 60)

    for file_path in files:
        try:
            optimize_to_png(file_path, src_root, dst_root, (1400, 1400))
        except Exception as e:
            print(f"[FEHLER] {file_path.name}: {e}")

    print("-" * 60)
    print("Fertig.")


if __name__ == "__main__":
    main()