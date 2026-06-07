# Bundle licensed brand fonts in the repo

The Cogapp look depends on Civil (ABC Dinamo) and Untitled Serif (Klim), both
licensed and not redistributable. We commit the woff2 files into the repo so a
deck looks on-brand the moment it's created, rather than shipping fallback
fonts and asking each author to source the files. The trade-off is licensing
exposure, which we contain by keeping the template and its copies **private**.

## Consequences

- The repo and every deck copied from it must stay private. A public deck would
  redistribute the licensed fonts.
- Swapping to open fonts later means editing `@font-face` and `@theme` in
  `src/styles/global.css` and removing `public/fonts/`.
