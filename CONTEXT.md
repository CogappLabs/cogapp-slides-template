# Cogapp slides template

A seed template for building presentation decks at Cogapp. Authors copy it via
GitHub's "Use this template", then own and diverge the copy freely. The template
never pushes updates back to copies; the example slides are disposable scaffolding.

## Language

**Template**:
This repository. The thing you copy from. Holds the engine, theme, and example
slides. Not versioned or published as a package.
_Avoid_: framework, library, starter kit (it is not consumed as a dependency)

**Deck**:
A copy made from the template via "Use this template". Owned by its author and
free to diverge. One deck is one presentation.
_Avoid_: instance, project, site

**Slug**:
A slide's identifier: its filename minus `.mdx`. The single string that links
the order list, the file, and the URL (`/slide/<slug>`). Astro's content loader
exposes the same value as `slide.id`, so `id === slug` by construction; prefer
"slug" everywhere except where Astro's API forces `id`.
_Avoid_: id, name, key (when referring to slide identity)

**Order**:
The deck's slide sequence, declared explicitly as a list of slugs in
`slideOrder` in `src/deck.config.ts`. The single source of truth for sequence. A slide file
that exists but is not listed is excluded from the deck with no error; a slug listed
with no matching file is a build error.
_Avoid_: sequence, sort, index

**Base**:
The URL path prefix the deck is served under, set once as `base` in
`astro.config.mjs` (e.g. `/my-deck` for GitHub Pages at
`org.github.io/my-deck`). The single rename pivot: fonts, the home link, and
slide links all derive from it, so changing it is the only edit a rename needs.
_Avoid_: path prefix, root, mount point

## Decisions

Two things in here look like mistakes and are not. Both have bitten someone
already.

### Fonts are Vite assets, not public files

The font files live in `src/assets/fonts/`, and `src/styles/fonts.css` points
at them with relative URLs (`../assets/fonts/...`). Vite resolves those, hashes
the files and adds `base`, in dev and in the build alike. The preload links in
`FontPreloads.astro` import the same files with `?url`, so they get the same
hashed path. That is what keeps `base` the single rename pivot.

Two other layouts look simpler and both break. An absolute
`/<base>/fonts/...` hardcodes the repo name into the CSS: rename the deck, miss
that file, and the fonts 404 and fall back to Georgia with no error. Keeping the
files in `public/` with a relative `../fonts/` URL works in a build (the CSS
lands one directory under `base`) but not in dev, where Vite serves the CSS
from its source path and the URL resolves to `/fonts/...` without `base`.

So: don't move the fonts back to `public/`, and don't make the URLs absolute.

### Brand fonts are committed to the repo

Civil (ABC Dinamo) and Untitled Serif (Klim) live in `src/assets/fonts/` so a new
deck is on-brand immediately, rather than shipping fallbacks and asking each
author to find the files. Cogapp holds redistribution rights for both, which is
why this repo can be public.

Holding redistribution rights is not the same as granting forkers a licence.
Anyone reusing the fonts outside a Cogapp context is responsible for their own.
If those rights ever change, the fonts have to come out of `src/assets/fonts/` and
out of git history, with `@font-face` switched to a fallback.
