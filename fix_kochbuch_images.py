#!/usr/bin/env python3
"""
Fix image file extension mismatches for Svens Kochbuch.

What it does:
- Reads kochbuch.xml
- Looks at every <image src="images/...ext">
- If the exact target file is missing, it searches for the same basename
  with other common extensions (.jpg, .jpeg, .png, .webp, .jfif)
- Converts/copies that file to the extension expected by the XML
- Keeps the XML unchanged
- Writes a small report at the end

Typical use:
    python fix_kochbuch_images.py --xml kochbuch.xml --images-dir images --dry-run
    python fix_kochbuch_images.py --xml kochbuch.xml --images-dir images

Notes:
- For JPG output, images are converted to RGB automatically.
- Existing correct target files are never overwritten unless --overwrite is used.
"""

from __future__ import annotations

import argparse
import sys
import shutil
from pathlib import Path
import xml.etree.ElementTree as ET

try:
    from PIL import Image
except ImportError:
    print("Pillow is required. Install with: pip install pillow", file=sys.stderr)
    raise

COMMON_EXTS = [".jpg", ".jpeg", ".png", ".webp", ".jfif", ".JPG", ".JPEG", ".PNG", ".WEBP", ".JFIF"]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="Fix image extension mismatches for kochbuch.xml")
    parser.add_argument("--xml", required=True, help="Path to kochbuch.xml")
    parser.add_argument("--images-dir", required=True, help="Path to images directory")
    parser.add_argument("--dry-run", action="store_true", help="Only show what would be changed")
    parser.add_argument("--overwrite", action="store_true", help="Overwrite existing target files")
    parser.add_argument("--quality", type=int, default=92, help="JPEG quality for converted JPG files (default: 92)")
    return parser.parse_args()


def find_alternative_file(images_dir: Path, target_name: str) -> Path | None:
    target_path = Path(target_name)
    stem = target_path.stem

    for ext in COMMON_EXTS:
        candidate = images_dir / f"{stem}{ext}"
        if candidate.exists():
            return candidate

    # Also try case-insensitive basename match
    lower_stem = stem.lower()
    for file in images_dir.iterdir():
        if file.is_file() and file.stem.lower() == lower_stem:
            return file

    return None


def ensure_parent(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)


def convert_image(src: Path, dst: Path, quality: int) -> None:
    ensure_parent(dst)
    ext = dst.suffix.lower()

    if ext in {".jpg", ".jpeg"}:
        with Image.open(src) as im:
            if im.mode in ("RGBA", "LA", "P"):
                bg = Image.new("RGB", im.size, (255, 255, 255))
                if im.mode != "RGBA":
                    im = im.convert("RGBA")
                bg.paste(im, mask=im.split()[-1])
                out = bg
            else:
                out = im.convert("RGB")
            out.save(dst, format="JPEG", quality=quality, optimize=True)
        return

    if ext == ".png":
        with Image.open(src) as im:
            im.save(dst, format="PNG")
        return

    if ext == ".webp":
        with Image.open(src) as im:
            im.save(dst, format="WEBP", quality=quality)
        return

    # Unknown target extension: just copy
    shutil.copy2(src, dst)


def main() -> int:
    args = parse_args()
    xml_path = Path(args.xml).resolve()
    images_dir = Path(args.images_dir).resolve()

    if not xml_path.exists():
        print(f"XML not found: {xml_path}", file=sys.stderr)
        return 1
    if not images_dir.exists():
        print(f"Images directory not found: {images_dir}", file=sys.stderr)
        return 1

    tree = ET.parse(xml_path)
    root = tree.getroot()

    checked = 0
    ok = 0
    fixed = 0
    missing = []
    skipped = []

    for recipe in root.findall(".//recipe"):
        recipe_id = recipe.attrib.get("id", "?")
        image_node = recipe.find("image")
        if image_node is None:
            continue

        src_attr = image_node.attrib.get("src", "").strip()
        if not src_attr:
            continue

        # Expecting XML paths like images/rezeptbild_192.jpg
        rel_path = Path(src_attr)
        target_file = (xml_path.parent / rel_path).resolve()

        checked += 1

        if target_file.exists():
            ok += 1
            continue

        alt = find_alternative_file(images_dir, rel_path.name)
        if alt is None:
            missing.append((recipe_id, src_attr))
            continue

        if target_file.exists() and not args.overwrite:
            skipped.append((recipe_id, str(target_file)))
            continue

        print(f"[FIX] Rezept {recipe_id}: {src_attr} missing -> using {alt.name}")

        if not args.dry_run:
            convert_image(alt, target_file, args.quality)

        fixed += 1

    print()
    print("Summary")
    print("-------")
    print(f"Checked: {checked}")
    print(f"Already OK: {ok}")
    print(f"Fixed: {fixed}")
    print(f"Missing: {len(missing)}")
    print(f"Skipped: {len(skipped)}")

    if missing:
        print()
        print("Still missing:")
        for recipe_id, img in missing[:50]:
            print(f"  Rezept {recipe_id}: {img}")
        if len(missing) > 50:
            print(f"  ... and {len(missing) - 50} more")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
