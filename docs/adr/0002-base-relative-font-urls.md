# Font URLs are relative to the stylesheet, not absolute under `base`

`@font-face` `src` URLs in `src/styles/global.css` use `../fonts/...`, relative
to the stylesheet, instead of an absolute `/<base>/fonts/...`. Astro bundles the
CSS under `<base>/_astro/`, so `../fonts/` resolves to `<base>/fonts/` and
auto-follows `base`. This makes the deck's `base` the single rename pivot:
renaming a deck means editing `base` in `astro.config.mjs` and nothing else.

The absolute form is the obvious choice and is what the source decks
(wyeth-board-deck, claude-at-cogapp) used. We rejected it because it hardcodes
the repo name into the CSS: an author who renames their deck but misses the CSS
gets fonts that 404 and silently fall back to Georgia/Helvetica, off-brand with
no error. Verified by renaming `base` and rebuilding with no other edit (fonts
still 200).

## Consequences

- Don't "fix" the font URLs to absolute paths — it reintroduces the silent-404
  rename trap this avoids.
- Relies on Astro bundling CSS one directory deep under `base` (`/_astro/`). If
  a future Astro version changes that layout, the `../` depth must change too.
