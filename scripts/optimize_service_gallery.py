from pathlib import Path

from PIL import Image, ImageOps


PROJECT_ROOT = Path(__file__).resolve().parents[1]
GALLERY_ROOT = PROJECT_ROOT / "source-assets" / "gallery-originals"
OUTPUT_ROOT = PROJECT_ROOT / "public" / "images" / "gallery" / "services"
SERVICE_FOLDERS = {
    "1. Aroma": "aroma",
    "2. Thai": "thai",
    "3. Bamboo": "bamboo",
    "4. Herbal": "herbal",
    "5. physical": "physical-therapy",
    "6. Four hand": "four-hand",
    "7. Foot": "foot",
    "8. Facial": "facial",
}


def image_sort_key(path: Path) -> tuple[int, ...]:
    prefix = path.stem.split(" ", 1)[0]
    return tuple(int(part) for part in prefix.split("."))


def main() -> None:
    converted = 0
    source_bytes = 0
    output_bytes = 0

    for folder_name, output_name in SERVICE_FOLDERS.items():
        source_folder = GALLERY_ROOT / folder_name
        output_folder = OUTPUT_ROOT / output_name
        output_folder.mkdir(parents=True, exist_ok=True)

        for index, source_path in enumerate(
            sorted(source_folder.glob("*.png"), key=image_sort_key),
            start=1,
        ):
            output_path = output_folder / f"{output_name}-{index}.webp"
            with Image.open(source_path) as source:
                image = ImageOps.exif_transpose(source)
                if image.mode not in ("RGB", "RGBA"):
                    image = image.convert("RGB")
                # Preserve skin tones and soft spa lighting without bloating the site.
                image.save(output_path, "WEBP", quality=90, method=6)

            converted += 1
            source_bytes += source_path.stat().st_size
            output_bytes += output_path.stat().st_size

    saving = 0 if source_bytes == 0 else 100 * (1 - output_bytes / source_bytes)
    print(
        f"Converted {converted} images: "
        f"{source_bytes / 1024 / 1024:.2f} MB -> "
        f"{output_bytes / 1024 / 1024:.2f} MB ({saving:.1f}% smaller)"
    )


if __name__ == "__main__":
    main()
