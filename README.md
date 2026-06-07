# Cogapp slides template

A starting point for building presentation decks at Cogapp. Astro 6 + MDX,
themed with the Cogapp palette and brand fonts (Civil + Untitled Serif).

Write each slide as an MDX file, set the order in one list, and present in the
browser with keyboard navigation. Export the whole deck to a single PDF.

## Use this template

On GitHub, click **Use this template** to create a new repo from it, or:

```sh
gh repo create CogappLabs/my-deck --template CogappLabs/cogapp-slides-template
```

Then, in the new repo:

1. Set `base` in `astro.config.mjs` to `/<your-repo-name>` (and `site` to your
   org Pages URL). Everything else, including the font URLs, follows `base`
   automatically.
2. Replace the example slides in `src/content/slides/` and the order in
   `src/content/order.ts`.
3. Update the deck title and intro copy in `src/pages/index.astro`.

## Run

```sh
npm install
npm run dev      # localhost:4321
```

Index at `/`. Individual slides at `/slide/<slug>` where slug is the mdx
filename (e.g. `/slide/bullets`). Arrow keys / PageUp-Down navigate; Home/End
jump to first/last.

## Build

```sh
npm run build    # outputs to dist/
npm run preview  # serve the built deck
```

## PDF export

```sh
npm run build    # build first
npm run pdf      # renders dist/ to deck.pdf, one slide per page
```

`scripts/build-pdf.ts` runs the built deck through Playwright Chromium and
merges one landscape page per slide. It imports `slideOrder` and `base` from
the real sources, so there's nothing to keep in sync. Needs Playwright's
Chromium (`npx playwright install chromium`). Runs as TypeScript directly on
Node 22.18+ / 23+ via built-in type stripping.

## Slides

- Content lives in `src/content/slides/<slug>.mdx`
- Order is set in `src/content/order.ts` (move a line to reorder). A slide file
  not listed there is silently excluded; a slug listed with no file is a build error.
- Frontmatter: `title`, optional `bg`, `align`, `section`, `notes`, `docs`

| Frontmatter | Purpose |
| :--- | :--- |
| `title` | Slide title (used in `<title>` and the index) |
| `bg` | Background theme (see below). Default `cream` |
| `align` | `start` (top), `center`, or `end`. Default `start` |
| `section` | Small eyebrow label shown above the content |
| `notes` | Speaker notes (not rendered on the slide) |
| `docs` | URL, array of URLs, or `{label, href}` objects — renders a collapsible References list |

### Backgrounds (`bg`)

The Cogapp palette: a cream base, slate ink, and four pastel accents for
section and feature slides.

| `bg` | colour | text |
| :--- | :--- | :--- |
| `cream` | Cream `#ebebe1` | slate |
| `slate` | Slate `#282828` | cream |
| `pink` | Pink `#ffdaea` | slate |
| `green` | Green `#edffda` | slate |
| `purple` | Purple `#e8daff` | slate |
| `blue` | Blue `#dae9ff` | slate |
| `white` | White | slate |

All colours are `--color-*` tokens in `src/styles/global.css` and resolve as
Tailwind utilities (`bg-pink`, `text-slate`, etc.).

## Components

- `Bullets` — dash-marked list; pass `size="lg"` for a larger list
- `Quote` — large italic pull quote with optional `cite` attribution
- `Eyebrow` — small uppercase label above a heading

The example slides demonstrate each one.

## Fonts

Cogapp brand faces, both licensed (don't redistribute the woff2 outside Cogapp
use):

- **Civil** (ABC Dinamo) → `--font-sans` (body, labels, UI)
- **Untitled Serif** (Klim) → `--font-serif` (headings)

Files live in `public/fonts/`, declared as `@font-face` in `global.css`, and
exposed as Tailwind tokens so `font-sans` / `font-serif` resolve everywhere.

## Stack

Astro 6, MDX, Tailwind v4, Node 22+.

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to
`main`. Enable Pages (source: GitHub Actions) in the repo settings.

## Privacy

`noindex, nofollow` on every page and `public/robots.txt` denies all crawlers.
Don't commit private client data.
