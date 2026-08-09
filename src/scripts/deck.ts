// Everything the deck window does in the browser: keyboard navigation, the nav
// buttons, transition direction, and the presenter link.
//
// This module runs once per browser load, not per ClientRouter swap, so the
// listeners cannot stack. `init` re-runs on every astro:page-load to re-sync
// the parts of the nav the swap replaces with fresh server HTML.

import { navigate } from "astro:transitions/client";
import { syncFullscreenButton, toggleFullscreen } from "./fullscreen";
import { channel, me, onMessage, post } from "./sync";
import * as shortcuts from "./shortcuts";
import {
  clearZoomCursor,
  isZoomed,
  resetZoom,
  syncZoomCursor,
  zoomAt,
} from "./zoom";

const deckData = () => document.documentElement.dataset;
const currentSlug = () => deckData().slideSlug;
const base = () => deckData().slideBase || "";

const openPresenter = () =>
  window.open(
    `${base()}/presenter/${currentSlug()}`,
    "deck-presenter",
    "width=720,height=820",
  );

// ClientRouter picks the transition itself and has no idea which way we are
// going, so the direction is stashed here and applied as the swap is prepared.
let pendingDirection: "forward" | "back" | null = null;
const setDirection = (dir: "forward" | "back") => {
  pendingDirection = dir;
};
const onBeforePreparation = (e: any) => {
  if (pendingDirection) {
    e.direction = pendingDirection;
    pendingDirection = null;
  }
};

const goTo = (href: string, direction: "forward" | "back") => {
  setDirection(direction);
  navigate(href);
};

const onClick = (e: MouseEvent) => {
  const target = e.target as HTMLElement;
  if (isZoomed()) {
    resetZoom();
    return;
  }
  if ((e.altKey || e.ctrlKey) && !target.closest("nav, a, button")) {
    e.preventDefault();
    // Offset by scroll position so the origin is in page coordinates.
    zoomAt(e.clientX + window.scrollX, e.clientY + window.scrollY);
    return;
  }
  if (target.closest?.("[data-presenter-open]")) {
    openPresenter();
    return;
  }
  if (target.closest?.("[data-fullscreen]")) {
    toggleFullscreen();
    return;
  }
  const link = target.closest?.<HTMLAnchorElement>(
    'nav a[rel="prev"], nav a[rel="next"]',
  );
  if (link) setDirection(link.rel === "prev" ? "back" : "forward");
};

const onKey = (e: KeyboardEvent) => {
  syncZoomCursor(e);

  const nav = document.querySelector('nav[aria-label="Slide navigation"]');
  if (!nav) return;

  // Leave every modifier combination to the browser, so Alt+Left still goes
  // back and Cmd/Ctrl+F still opens the find bar.
  if (e.metaKey || e.ctrlKey || e.altKey) return;
  // Typing in an island's input should not drive the deck.
  const el = e.target;
  if (
    el instanceof HTMLElement &&
    (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
  ) {
    return;
  }

  // Escape closes the overlay or a zoom before anything else looks at the key.
  if (e.key === "Escape") {
    if (shortcuts.isOpen()) return; // the dialog closes itself
    if (isZoomed()) {
      e.preventDefault();
      resetZoom();
    }
    return;
  }
  if (e.key === "?") {
    e.preventDefault();
    shortcuts.toggle();
    return;
  }
  // With the overlay up, the deck should not navigate behind it.
  if (shortcuts.isOpen()) return;
  // Navigating away from a zoomed slide should not leave it scaled.
  if (isZoomed()) resetZoom();

  const prev = nav.querySelector<HTMLAnchorElement>('a[rel="prev"]');
  const next = nav.querySelector<HTMLAnchorElement>('a[rel="next"]');
  const { slideFirst: first, slideLast: last } = deckData();

  if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
    if (!next) return;
    e.preventDefault();
    goTo(next.getAttribute("href")!, "forward");
  } else if (
    e.key === "ArrowLeft" ||
    e.key === "ArrowUp" ||
    e.key === "PageUp"
  ) {
    if (!prev) return;
    e.preventDefault();
    goTo(prev.getAttribute("href")!, "back");
  } else if (e.key === "Home" && first) {
    // prev is absent on the first slide, so we are already there.
    if (!prev) return;
    e.preventDefault();
    goTo(`${base()}/slide/${first}`, "back");
  } else if (e.key === "End" && last) {
    if (!next) return;
    e.preventDefault();
    goTo(`${base()}/slide/${last}`, "forward");
  } else if (e.key === "f" || e.key === "F") {
    e.preventDefault();
    toggleFullscreen();
  } else if (e.key === "p" || e.key === "P") {
    e.preventDefault();
    openPresenter();
  }
};

// The presenter window drives fullscreen here, because this is the window an
// audience sees. A browser may refuse without a gesture in this window;
// toggleFullscreen swallows that.
onMessage((message) => {
  if (message.fullscreen) {
    toggleFullscreen();
    return;
  }
  if (!message.slug || message.slug === currentSlug()) return;
  navigate(`${base()}/slide/${message.slug}`);
});

const init = () => {
  document.addEventListener("keydown", onKey);
  // Capture phase: ClientRouter intercepts link clicks before they bubble, so a
  // bubble-phase listener would set the direction too late.
  document.addEventListener("click", onClick, true);
  document.addEventListener("fullscreenchange", syncFullscreenButton);
  document.addEventListener("astro:before-preparation", onBeforePreparation);
  // keyup alone would miss the window losing focus with alt still held
  // (alt-tab), which leaves the cursor stuck.
  document.addEventListener("keyup", syncZoomCursor);
  window.addEventListener("blur", clearZoomCursor);
  syncFullscreenButton();
  post({ slug: currentSlug() });
};

document.addEventListener("astro:page-load", init);
if (document.readyState !== "loading") init();

// `channel` and `me` are re-exported for decks that want to send their own
// messages between the two windows.
export { channel, me };
