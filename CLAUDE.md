# Cogapp slides — deck guide for Claude Code

An Astro 6 + MDX presentation deck, copied from the cogapp-slides-template seed.
See `README.md` for full docs and `CONTEXT.md` for the glossary. This file is
the short list of things that are easy to get wrong.

## Adding or editing a slide

1. Create `src/content/slides/<slug>.mdx`. The slug is the filename minus `.mdx`.
2. Add the slug to the list in `src/content/order.ts`, in the position you want.
3. Frontmatter: `title` (required); optional `bg`, `align`, `section`, `notes`, `docs`.

A slide file that is NOT listed in `order.ts` is silently excluded from the deck
(no error). A slug listed with no matching file is a build error. `order.ts` is
the single source of truth for sequence.

## Theme rules

- Use the palette tokens, never raw hex or Tailwind default colours (`gray-*`).
  Tokens: `cream`, `slate`, `white`, `grey`, `light-grey`, and pastels `pink`,
  `green`, `purple`, `blue`. They resolve as utilities (`bg-pink`, `text-slate`).
- `bg`: use `cream` / `slate` / `white` for content-heavy slides; the four
  pastels are accents for section dividers and sparse feature slides.
- Slide text colour comes from the `bg` (set in `SlideLayout`). Inside a slide,
  prefer `currentColor` / opacity over hardcoding a text colour, so it adapts.
- `src/styles/global.css` `.prose-slide` styles the raw HTML that MDX produces
  (`h1`, `p`, `ul`, `blockquote`, `table`…). Everything else uses Tailwind
  utilities. Edit `.prose-slide` to change default slide typography.

## Components (in `src/components/`)

- `Bullets` — dash-marked list; `size="lg"` for a larger, sparser list. Prefer
  it over a raw markdown list when the list IS the slide's content.
- `Quote` — large italic pull quote; optional `cite` attribution.
- `Eyebrow` — small uppercase label above a heading.

## Don't break these

- **`base` is the single rename pivot.** To rename/redeploy the deck, edit only
  `base` (and `site`) in `astro.config.mjs`. Fonts, home link, and slide links
  all derive from it. Do NOT hardcode the base path anywhere, and do NOT change
  the `../fonts/` URLs in `global.css` to absolute paths (see docs/adr/0002).
- **Fonts** (Civil, Untitled Serif) are committed to the repo; Cogapp holds
  redistribution rights, so it can be public (see docs/adr/0001). Reusing the
  fonts outside a Cogapp context is the reuser's licensing responsibility.

## After changes

`npm run build` must pass. For a PDF export: `npm run build && npm run pdf`.
