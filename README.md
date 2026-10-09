# Youssef Mohamed — Portfolio editing guide

This is a static HTML/CSS/JavaScript portfolio. The main page is `index.html` (or the updated file supplied with this guide, `index-updated.html`). Keep the existing `app.js`, `theme.js`, `style.css`, `theme.css`, and `img/` folder in the same project when publishing.

## 1. Change a thumbnail

Each gallery image has two paths:

```html
<a class="lb" href="img/posters/cairoke.webp" ...>
  <!-- THUMBNAIL: Change this img src to replace the small preview. Change the closest parent link href to replace the full-size image. -->
  <img src="img/posters/cairoke-thumb.webp" ...>
</a>
```

- `img src="...-thumb.webp"` is the small image shown in the gallery and collection cards.
- The parent link's `href="...webp"` is the full-size image opened by the lightbox.
- Use the same folder for the full-size image and its thumbnail, and keep the filename/path exact (paths are case-sensitive when deployed).
- For speed, export thumbnails as compressed WebP images. Aim for roughly 400–720 pixels on the longest side, depending on the image's shape. Keep the full-size version separately.
- The home page and the “All Work” page each have a collection-cover thumbnail. If you change a collection's cover, update the matching `<img src="...-thumb.webp">` in both places as well as any other cover occurrence you want to change.

## 2. Add a new photo/design to an existing collection

1. Export two files: a compressed thumbnail (for example `poster-05-thumb.webp`) and the larger image (for example `poster-05.webp`).
2. Put them in the appropriate folder under `img/`, such as `img/posters/`, `img/stories/`, `img/seniors/`, or `img/photography/`.
3. Open `index.html` and find the relevant section by its heading, for example `id="view-posters"`.
4. Inside that section's `<ul class="gallery ...">`, copy one existing `<li>...</li>` item and update:
   - the anchor `href` to the full-size image path;
   - `data-caption` and `aria-label` to describe the work;
   - the thumbnail `<img src>` path;
   - `alt` text;
   - `data-w` and `data-h` to the full-size image's actual pixel dimensions;
   - visible caption text if that collection shows a caption.
5. Save and refresh the site. Check the thumbnail, full-size lightbox, mobile layout, and browser console.

Example item (adapt the dimensions and text to your image):

```html
<li>
  <div class="card media square">
    <a class="lb" href="img/posters/poster-05.webp"
       data-caption="Poster 05" data-w="1800" data-h="1800"
       aria-label="View larger: Poster 05">
      <!-- THUMBNAIL: Change this img src to replace the small preview. Change the closest parent link href to replace the full-size image. -->
      <img src="img/posters/poster-05-thumb.webp" width="720" height="720"
           alt="Poster 05" loading="lazy" decoding="async">
    </a>
  </div>
</li>
```

## 3. Add a new work-experience entry

The section previously labelled “Brands” is now labelled “Work Experience” and still uses the existing `#/brands` route and `img/brands/` folder so the current JavaScript navigation does not break.

1. Add the company logo/artwork and its thumbnail to `img/brands/` (you can keep this folder name; it is an internal asset path).
2. In `index.html`, find `id="view-brands"` and its `<ul class="gallery g-brands">`.
3. Copy one existing `<li>...</li>` item and update its full image path, thumbnail path, company name, dates, alt text, and image dimensions.
4. If the new experience should be shown as the Work Experience cover, update the cover image path in the “All Work” tile (`id="all-tiles"`) and, if desired, the featured home tile area.
5. Keep dates accurate and consistent with your CV. Do not add an employer or date unless it reflects your actual experience.

## 4. Rename a collection

Change the visible text in the dropdown menu, home featured tiles, “All Work” tiles, section heading, page title, and previous/next pager links. The route and asset folder can stay the same. For example, “Official Stories” still uses `#/stories` and `img/stories/`; changing the visible label does not require renaming the folder.

## 5. Add a brand-new collection

A new collection needs more than a gallery: it normally needs a new `<section class="view" id="view-...">`, a cover tile in the “All Work” grid, a navigation dropdown link, pager links as appropriate, and a matching route entry in `app.js`. Read `app.js` first and copy the pattern of an existing collection before creating a new route. Use a unique route/section ID and test direct navigation, mobile menu, filters, and lightbox behavior.

## 6. Image-loading tips

- Keep `loading="lazy" decoding="async"` on gallery thumbnails below the fold.
- Use appropriately sized compressed thumbnails rather than using the full-size file as the thumbnail.
- Avoid adding huge PNGs when a WebP/JPEG is visually equivalent.
- The `href` image only needs to load when the user opens the lightbox; don't set it as the thumbnail `src`.
- Do not lazy-load the main above-the-fold hero content if you later add a hero image; it is usually better to load that image eagerly.

## Important

The HTML references external files (`style.css`, `theme.css`, `app.js`, and `theme.js`) that are not included in the supplied HTML attachment. Keep your repository's existing versions of those files. Before replacing your live page, back up the current `index.html` and test the updated file with the existing assets and scripts.
