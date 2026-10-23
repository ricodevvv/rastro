# Rastro

See and remove the metadata hidden in your files: the GPS location and phone model in photos, the author and company in PDFs and Office documents, the device and place in videos. In English and Spanish.

Everything runs in your browser. Files are read on your device and never uploaded.

Live at https://metadata.ricodevvv.com

## What it reads

| Files | How |
| --- | --- |
| JPG, PNG, WebP, HEIC, TIFF, AVIF | [exifr](https://github.com/MikeKovarik/exifr): EXIF, GPS, XMP, IPTC, ICC |
| PDF | [pdf-lib](https://pdf-lib.js.org): document info and the XMP packet |
| DOCX, XLSX, PPTX, ODT, ODS, ODP | The properties inside the zip, plus the names on comments and tracked changes |
| Audio and video | [MediaInfo](https://mediaarea.net/en/MediaInfo) compiled to WebAssembly |

Each file gets a short list of what it gives away (location, names, serial numbers, device, dates, software), each with the fields that triggered it.

## What it cleans

- **JPEG** without re-encoding: EXIF, XMP, IPTC, comments and thumbnails go, the color profile stays, and the orientation is written back so the photo isn't sideways.
- **PNG**: text chunks, EXIF and timestamps.
- **WebP**: EXIF and XMP chunks.
- **PDF**: document info and XMP, deleted from the file rather than just unlinked.
- **Office and OpenDocument**: author, company, editor, revision and custom properties. Names on comments and tracked changes become "Author".

Audio and video can be inspected but not cleaned yet.

## Running it

```bash
pnpm install
pnpm dev
```

`predev` and `prebuild` copy MediaInfo's WebAssembly build into `public/vendor`. Set `SITE_URL` to the real domain for the Open Graph image and sitemap.

## License

MIT. MediaInfo is BSD-2-Clause.
