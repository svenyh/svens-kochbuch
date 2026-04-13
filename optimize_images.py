from __future__ import annotations

import argparse
import shutil
import zipfile
from pathlib import Path
from PIL import Image, ImageOps

SUPPORTED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}


def ensure_rgb_for_jpeg(img: Image.Image) -> Image.Image:
    if img.mode in ("RGBA", "LA", "P"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        alpha = img.convert("RGBA")
        background.paste(alpha, mask=alpha.split()[-1])
        return background
    if img.mode != "RGB":
        return img.convert("RGB")
    return img


def resize_image(img: Image.Image, max_size: tuple[int, int]) -> Image.Image:
    img = ImageOps.exif_transpose(img)
    resized = img.copy()
    resized.thumbnail(max_size, Image.Resampling.LANCZOS)
    return resized


def optimize_image(
    src_file: Path,
    src_root: Path,
    dst_root: Path,
    max_width: int,
    max_height: int,
    jpeg_quality: int,
    webp_quality: int,
    png_compress_level: int,
    keep_metadata: bool,
) -> tuple[float, float]:
    relative_path = src_file.relative_to(src_root)
    dst_file = dst_root / relative_path
    dst_file.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(src_file) as img:
        original_format = (img.format or src_file.suffix.replace(".", "")).upper()
        img = resize_image(img, (max_width, max_height))

        save_kwargs = {}
        if keep_metadata:
            exif = img.info.get("exif")
            if exif:
                save_kwargs["exif"] = exif

        ext = src_file.suffix.lower()

        if ext in {".jpg", ".jpeg"}:
            img = ensure_rgb_for_jpeg(img)
            img.save(
                dst_file,
                format="JPEG",
                quality=jpeg_quality,
                optimize=True,
                progressive=True,
                **save_kwargs,
            )

        elif ext == ".png":
            if img.mode not in ("RGB", "RGBA", "L", "LA", "P"):
                img = img.convert("RGBA")
            img.save(
                dst_file,
                format="PNG",
                optimize=True,
                compress_level=png_compress_level,
                **save_kwargs,
            )

        elif ext == ".webp":
            if img.mode not in ("RGB", "RGBA"):
                img = img.convert("RGBA" if "A" in img.mode else "RGB")
            img.save(
                dst_file,
                format="WEBP",
                quality=webp_quality,
                method=6,
                **save_kwargs,
            )

        else:
            img.save(dst_file, format=original_format, **save_kwargs)

    old_size_kb = src_file.stat().st_size / 1024
    new_size_kb = dst_file.stat().st_size / 1024
    return old_size_kb, new_size_kb


def create_zip_from_folder(folder: Path, zip_path: Path) -> None:
    with zipfile.ZipFile(zip_path, "w", compression=zipfile.ZIP_DEFLATED) as zf:
        for file_path in folder.rglob("*"):
            if file_path.is_file():
                zf.write(file_path, file_path.relative_to(folder))


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Optimiert Bilder für Web und kann optional Originale überschreiben oder ZIP erstellen."
    )
    parser.add_argument("input_dir", help="Eingabeordner mit Bildern")
    parser.add_argument(
        "--output-dir",
        default=None,
        help="Ausgabeordner für optimierte Bilder. Standard: <input>_optimized",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Optimierte Bilder am Ende in den Originalordner zurückkopieren",
    )
    parser.add_argument(
        "--backup",
        action="store_true",
        help="Vor dem Überschreiben eine Sicherung des Originalordners anlegen",
    )
    parser.add_argument(
        "--zip",
        action="store_true",
        help="Zusätzlich eine ZIP-Datei mit den optimierten Bildern erstellen",
    )
    parser.add_argument(
        "--zip-name",
        default=None,
        help="Name/Pfad der ZIP-Datei. Standard: <output_dir>.zip",
    )
    parser.add_argument("--max-width", type=int, default=1400)
    parser.add_argument("--max-height", type=int, default=1400)
    parser.add_argument("--jpeg-quality", type=int, default=72)
    parser.add_argument("--webp-quality", type=int, default=70)
    parser.add_argument("--png-compress-level", type=int, default=9)
    parser.add_argument(
        "--keep-metadata",
        action="store_true",
        help="EXIF-Metadaten behalten",
    )

    args = parser.parse_args()

    input_dir = Path(args.input_dir).resolve()
    if not input_dir.exists() or not input_dir.is_dir():
        raise SystemExit(f"Eingabeordner nicht gefunden: {input_dir}")

    output_dir = (
        Path(args.output_dir).resolve()
        if args.output_dir
        else input_dir.parent / f"{input_dir.name}_optimized"
    )

    files = [
        p for p in input_dir.rglob("*")
        if p.is_file() and p.suffix.lower() in SUPPORTED_EXTENSIONS
    ]

    if not files:
        raise SystemExit("Keine unterstützten Bilddateien gefunden.")

    print(f"Starte Optimierung von {len(files)} Bilddatei(en)...")
    print(f"Quelle: {input_dir}")
    print(f"Ziel:   {output_dir}")
    print("-" * 70)

    total_old = 0.0
    total_new = 0.0
    ok = 0
    failed = 0

    for file_path in files:
        rel = file_path.relative_to(input_dir)
        try:
            old_kb, new_kb = optimize_image(
                src_file=file_path,
                src_root=input_dir,
                dst_root=output_dir,
                max_width=args.max_width,
                max_height=args.max_height,
                jpeg_quality=args.jpeg_quality,
                webp_quality=args.webp_quality,
                png_compress_level=args.png_compress_level,
                keep_metadata=args.keep_metadata,
            )
            total_old += old_kb
            total_new += new_kb
            ok += 1
            print(f"[OK] {rel} | {old_kb:.1f} KB -> {new_kb:.1f} KB")
        except Exception as e:
            failed += 1
            print(f"[FEHLER] {rel}: {e}")

    print("-" * 70)
    print(f"Fertig. Erfolgreich: {ok}, Fehler: {failed}")
    print(f"Gesamt: {total_old/1024:.2f} MB -> {total_new/1024:.2f} MB")
    print(f"Ersparnis: {(total_old-total_new)/1024:.2f} MB")

    if args.overwrite:
        if args.backup:
            backup_dir = input_dir.parent / f"{input_dir.name}_backup"
            if backup_dir.exists():
                shutil.rmtree(backup_dir)
            shutil.copytree(input_dir, backup_dir)
            print(f"[BACKUP] Originalordner gesichert nach: {backup_dir}")

        for optimized_file in output_dir.rglob("*"):
            if optimized_file.is_file():
                rel = optimized_file.relative_to(output_dir)
                target_file = input_dir / rel
                target_file.parent.mkdir(parents=True, exist_ok=True)
                shutil.copy2(optimized_file, target_file)

        print(f"[OVERWRITE] Optimierte Bilder in Originalordner zurückkopiert: {input_dir}")

    if args.zip:
        zip_path = (
            Path(args.zip_name).resolve()
            if args.zip_name
            else output_dir.parent / f"{output_dir.name}.zip"
        )
        create_zip_from_folder(output_dir, zip_path)
        print(f"[ZIP] Erstellt: {zip_path}")


if __name__ == "__main__":
    main()