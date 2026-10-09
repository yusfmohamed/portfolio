# Youssef Mohammed — Portfolio

Graphic design portfolio: posters, stories, social posts, artworks, 3D, photography and brand work.
Live at https://yusfmohamed.github.io/portfolio/

## Structure

| File | Purpose |
| --- | --- |
| `index.html` | All pages in one file. Each collection is a `<section class="view" id="view-NAME">`. |
| `style.css` | Light theme, layout, responsive rules. |
| `app.js` | Page switching (`#/posters`, `#/3d`, ...), mobile menu, work filter, image viewer. |
| `img/` | Optimized WebP images. `NAME-thumb.webp` (grid) and `NAME.webp` (large view). |

## Adding a new image

1. Export two WebP files into the right `img/<collection>/` folder:
   - `my-piece-thumb.webp` — about 720px on the long edge
   - `my-piece.webp` — about 1800px on the long edge
   Use lowercase names with hyphens, no spaces.
2. In `index.html`, copy an existing `<li>` block inside that collection and change the file names,
   `width`/`height` (the real pixel size of the thumb), `alt`, and `data-caption`.

Keep images under about 300 KB (thumb) and 1.5 MB (large) so the site stays fast.
