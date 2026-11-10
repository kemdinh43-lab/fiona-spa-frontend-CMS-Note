# Image assets

This directory contains website image assets organized by usage area.

## Structure

```txt
public/images/
  brand/      Logo files
  hero/       Large above-the-fold images
  services/   Service category and service detail images
  packages/   Package card images
  gallery/    Gallery grid images
  blog/       Blog thumbnail and detail images
```

## Recommended sizes

- Brand logo: prefer SVG. If using raster, keep it under 100 KB when possible.
- Hero images: 1600x1000 WebP, usually 300-700 KB.
- Card images: 1200x900 WebP, usually 100-300 KB.
- Small thumbnails: 800x600 WebP, usually 50-150 KB.

Prefer WebP for normal photos. Keep source image names lowercase and descriptive, for example `hot-stone-massage.webp`.

When replacing remote Unsplash URLs, import images from this directory and assign them to `imageUrl` fields in `src/data/mockData.ts` or a future content file.
