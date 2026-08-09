# Cogapp slides: deck guide for Claude Code

An Astro 7 + MDX presentation deck, copied from the cogapp-slides-template seed.
See `README.md` for full docs and `CONTEXT.md` for the glossary. This file is
the short list of things that are easy to get wrong.

## Adding or editing a slide

1. Create `src/content/slides/<slug>.mdx`. The slug is the filename minus `.mdx`.
2. Add the slug to the list in `src/content/order.ts`, in the position you want.
3. Frontmatter: `title` (required); optional `bg`, `align`, `section`, `eyebrow`,
   `notes`, `docs`.

A slide file not listed in `order.ts` is excluded from the deck with no error. A slug listed with no matching file is a build error. `order.ts` is
the single source of truth for sequence.

A running dev server can miss a brand-new slide and report "Order references
missing slide", or serve it half-rendered. The content collection is cached, and
adding a file plus its `order.ts` entry is not a change it picks up. Stop the
server, `rm -rf .astro node_modules/.vite`, and start it again.

## Theme rules

- Use the palette tokens, never raw hex or Tailwind default colours (`gray-*`).
  Tokens: `cream`, `slate`, `white`, `grey`, `light-grey`, and pastels `pink`,
  `green`, `purple`, `blue`. They resolve as utilities (`bg-pink`, `text-slate`).
  One exception: `Terminal` chrome is deliberately off-palette, so leave its hex
  values alone.
- `bg`: use `cream` / `slate` / `white` for content-heavy slides; the four
  pastels are accents for section dividers and sparse feature slides.
- Slide text colour comes from the `bg` (set in `SlideLayout`). Inside a slide,
  prefer `currentColor` / opacity over hardcoding a text colour, so it adapts.
- `src/styles/slide-content.css` `.prose-slide` styles the raw HTML MDX produces
  (`h1`, `p`, `ul`, `blockquote`, `table`…). Everything else uses Tailwind
  utilities. Edit `.prose-slide` to change default slide typography.

## Write slides in markdown

Plain markdown covers most of a slide, so reach for a component only when
markdown can't express the thing. `.prose-slide` already handles:

- Lists: dash markers on `ul`, numbers on `ol`, nesting included.
- The paragraph straight after the slide heading, styled as a large lead.
- A trailing paragraph, set back slightly as a note.
- Tables, code and links.
- Blockquotes as pull quotes. A final paragraph inside the quote, after a blank
  line, becomes the attribution.

Adding `class="..."` to markup in a slide should be rare. If you find yourself
repeating one, it belongs in `.prose-slide` or a component instead.

The deck's title, subtitle and credit line live in `src/content/deck.ts`. The
title slide and the index read from it, so change it in one place.

`notes` frontmatter is the script for the presenter view at `/presenter/<slug>`,
which the deck opens with `P`. It is served with the deck, so treat it as public.

## Components (in `src/components/`)

- `Eyebrow`: the uppercase label the layout renders from `eyebrow`/`section`.
  Only needed directly for a second label inside a slide.
- `Terminal`: dark terminal window with chrome; pass `text` and optional `title`.
- `TwoCol`: two columns; `ratio="2-1"` or `"1-2"` to weight a side.
- `Byline`: Cogapp logo with the credit from `deck.ts`; pass `credit` to override.
- `References`: the collapsible list rendered from `docs` frontmatter.
- `Poll`: React island (`.tsx`), a live show-of-hands tally. Needs a `client:*`
  directive or it renders static. The only component that ships JavaScript.

## Don't break these

- **`base` is the single rename pivot.** To rename/redeploy the deck, edit only
  `base` (and `site`) in `astro.config.mjs`. Fonts, home link, and slide links
  all derive from it. Don't hardcode the base path anywhere, and don't change
  the `../fonts/` URLs in `fonts.css` to absolute paths (see docs/adr/0002).
- **Fonts** (Civil, Untitled Serif) are committed to the repo; Cogapp holds
  redistribution rights, so it can be public (see docs/adr/0001). Reusing the
  fonts outside a Cogapp context is the reuser's licensing responsibility.
- **The `@vitejs/plugin-react` override in `package.json`** is temporary. It
  forces v6 (the Rolldown/Oxc build) because `@astrojs/react` still asks for v5,
  which warns on every build. Check whether it is still needed when upgrading
  Astro or `@astrojs/react`, and drop it once their own dependency catches up.

## After changes

`npm run build` must pass. For a PDF export: `npm run build && npm run pdf`.
