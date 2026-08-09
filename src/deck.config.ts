// Everything you configure for a deck. The slides themselves are the .mdx
// files in src/content/slides/; this file says what they are called, what
// order they run in, and which backgrounds they may use.
//
// (src/content.config.ts is Astro's own file, not this one. It defines the
// frontmatter schema and reads `surfaceNames` from here.)

/** Title page and browser tab. */
export const deck = {
  title: "Deck title",
  subtitle: "Subtitle · Context line",
  /** Shown beside the logo on the title slide. */
  credit: "Presenter · Date",
  /** Appended to each page's <title>, after the slide name. */
  suffix: "Cogapp",
} as const;

// The deck's sequence, and the only thing that decides it. Each entry is a
// filename in src/content/slides/ minus the `.mdx`. Reorder by moving a line.
// A slide file missing from this list is left out of the deck with no error;
// a slug here with no matching file is a build error.
export const slideOrder = [
  "title",
  "section-divider",
  "bullets",
  "quote",
  "two-column",
  "table",
  "image",
  "terminal",
  "react-island",
  "closing",
] as const;

// Which colours a slide may set as its `bg`, and the text colour that goes on
// top of each. Listing one here makes it a valid `bg:` in frontmatter and tells
// SlideLayout what to apply.
//
// The hex values live in `@theme` in src/styles/global.css, which is what turns
// them into `bg-*` / `text-*` utilities. Add the colour there first, then pair
// it here.
//
// Each pairing carries body text across a whole slide, so it has to clear WCAG
// AA. A colour you would not put a paragraph on top of does not belong here;
// define it in `@theme` and use it as an accent utility instead.
//
// Any Tailwind class works: a palette token (`bg-cream`), a Tailwind default
// (`bg-red-500`), or an arbitrary value (`bg-[#ff6600]`). Prefer a token, so
// the deck's colours stay in one place.
//
// Write the class out in full. Tailwind scans source for whole class names, so
// a string built at runtime (`bg-${name}`) generates no CSS, and a typo that
// isn't a real utility renders as no background rather than an error.
export const surfaces = {
  cream: { class: "bg-cream text-slate" },
  slate: { class: "bg-slate text-cream" },
  white: { class: "bg-white text-slate" },
  pink: { class: "bg-pink text-slate" },
  green: { class: "bg-green text-slate" },
  purple: { class: "bg-purple text-slate" },
  blue: { class: "bg-blue text-slate" },
} as const;

export type Surface = keyof typeof surfaces;
export const surfaceNames = Object.keys(surfaces) as [Surface, ...Surface[]];
