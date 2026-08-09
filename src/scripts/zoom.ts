// Alt-click (Ctrl-click on Linux) magnifies the point you clicked, the way
// reveal.js does it: scale the whole slide about that point rather than picking
// out an element, so it works anywhere on the slide.

const ZOOM = 2;
let zoomed = false;

const slide = () => document.querySelector<HTMLElement>("main[data-slide]");

export const isZoomed = () => zoomed;

/** `x` and `y` are page coordinates, so add scroll offset to a click's client position. */
export const zoomAt = (x: number, y: number) => {
  const main = slide();
  if (!main) return;
  main.style.transition = "transform 0.3s ease";
  main.style.transformOrigin = `${x}px ${y}px`;
  main.style.transform = `scale(${ZOOM})`;
  zoomed = true;
  clearZoomCursor();
};

export const resetZoom = () => {
  if (!zoomed) return;
  const main = slide();
  if (main) main.style.transform = "";
  zoomed = false;
};

// The cursor is the only hint that alt-click does anything.
export const syncZoomCursor = (e: KeyboardEvent) => {
  document.body.classList.toggle(
    "cursor-zoom-in",
    (e.altKey || e.ctrlKey) && !zoomed,
  );
};

export const clearZoomCursor = () =>
  document.body.classList.remove("cursor-zoom-in");
