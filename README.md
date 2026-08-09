# Cogapp slides template

A starting point for building presentation decks at Cogapp. Astro 7 + MDX,
themed with the Cogapp palette and brand fonts (Civil + Untitled Serif).

Write each slide as an MDX file, set the order in one list, and present in the
browser with keyboard navigation. Export the whole deck to a single PDF.

**Live demo:** https://cogapplabs.github.io/cogapp-slides-template/ (the
example slides, deployed from this repo).

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
   `src/deck.config.ts`.
3. Set the deck title, subtitle and credit line in `src/deck.config.ts`. The
   title slide and the index both read from it.

## Run

```sh
npm install
npm run dev      # localhost:4321
```

Index at `/`. Individual slides at `/slide/<slug>` where slug is the mdx
filename (e.g. `/slide/bullets`). Arrow keys / PageUp-Down navigate; Home/End
jump to first/last; `F` toggles fullscreen; `P` opens the presenter view.

## Presenter view

`P`, or the monitor button in the slide nav, opens `/presenter/<slug>` in a
second window: speaker notes, a timer with pause and reset, the slide count,
and the next slide's title. Moving in either window moves the other.

Sync uses `BroadcastChannel`, which reaches other tabs in the same browser
only. Someone opening a presenter URL on another machine gets a standalone
view that doesn't follow along. Note that notes are published with the deck,
so anyone with the URL can read them.

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
- Order is set in `src/deck.config.ts` (move a line to reorder). A slide file
  not listed there is excluded with no warning; a slug listed with no file is a
  build error.
- Frontmatter: `title`, optional `bg`, `align`, `section`, `eyebrow`, `notes`, `docs`

| Frontmatter | Purpose |
| :--- | :--- |
| `title` | Slide title (used in `<title>` and the index) |
| `bg` | Background theme (see below). Default `cream` |
| `align` | `start` (top), `center`, or `end`. Default `start` |
| `section` | Groups the slide in the index, and labels it above the content |
| `eyebrow` | Label above the content only, when it should differ from `section` |
| `notes` | Speaker notes (not rendered on the slide) |
| `docs` | URL, array of URLs, or `{label, href}` objects. Renders a collapsible References list |

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

Use `cream`, `slate` or `white` for content-heavy slides; the four pastels are
accents, best on section dividers and sparse feature slides where the lighter
contrast against slate text reads fine.

All colours are `--color-*` tokens in `src/styles/global.css` and resolve as
Tailwind utilities (`bg-pink`, `text-slate`, etc.). Two muted neutrals,
`grey` and `light-grey`, round out the palette for secondary text and panels.

### Stylesheets

`global.css` holds the `@theme` tokens and imports the rest: `fonts.css`
(`@font-face`), `transitions.css` (slide animation), and `slide-content.css`
(`.prose-slide`, the typography for MDX output). Everything outside
`.prose-slide` is Tailwind utilities.

## Writing a slide

Slides are markdown. Headings, lists, tables, quotes, code and links are styled
by `.prose-slide`, so a slide rarely needs any markup of its own:

- `ul` gets dash markers, `ol` keeps numbers, nesting works
- a `>` blockquote is the pull quote; a final paragraph inside it is the attribution
- the paragraph after the heading becomes the large lead line
- a trailing paragraph is set back as a note

Components cover the things markdown has no syntax for.

## Components

- `Eyebrow`: the uppercase label rendered from `eyebrow`/`section` frontmatter
- `Terminal`: dark terminal window with chrome; pass `text` and optional `title`
- `TwoCol`: two columns; `ratio="2-1"` or `"1-2"` to weight a side
- `Byline`: Cogapp logo with the credit line from `deck.config.ts`
- `References`: collapsible list rendered from the `docs` frontmatter
- `Poll`: React island, a live show-of-hands tally. Needs a `client:*` directive

The example slides demonstrate each one.

## Fonts

Cogapp brand faces. Cogapp holds redistribution rights for both:

- **Civil** (ABC Dinamo) → `--font-sans` (body, labels, UI)
- **Untitled Serif** (Klim) → `--font-serif` (headings)

Files live in `public/fonts/`, declared as `@font-face` in `fonts.css`, and
exposed as Tailwind tokens so `font-sans` / `font-serif` resolve everywhere.
Reusing the fonts outside a Cogapp context is the reuser's responsibility.

## Stack

Astro 7, MDX, Tailwind v4, Node 22.18+ (the PDF script runs as TypeScript
directly, which needs that version's type stripping).

Markdown is rendered by Sätteri, Astro 7's own processor. It applies GFM, so
tables and strikethrough work without a remark plugin.

React is available for interactive islands (`client:load` on a `.tsx`
component). The `overrides` block in `package.json` pulls `@vitejs/plugin-react`
up to v6, the Rolldown/Oxc build: `@astrojs/react` still asks for v5, which
prints deprecation warnings on every Vite 8 build. Drop the override once Astro
bumps its own dependency.

`CLAUDE.md` holds a short guide for working on the deck with Claude Code (the
authoring procedure, theme rules, and the things that are easy to get wrong).

## Deploy

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on push to
`main`. Enable Pages (source: GitHub Actions) in the repo settings.

## Privacy

`noindex, nofollow` on every page and `public/robots.txt` denies all crawlers.
Don't commit private client data.
