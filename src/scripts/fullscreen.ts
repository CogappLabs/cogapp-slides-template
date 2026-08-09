// Fullscreen for the deck window, and the nav button that reflects its state.

/** The button is replaced on every navigation, so query it rather than hold it. */
export const syncFullscreenButton = () => {
  const btn = document.querySelector("[data-fullscreen]");
  if (!btn) return;
  // The label names the action, so aria-pressed is left off: pairing a changing
  // name with a pressed state reads as a contradiction.
  const on = document.fullscreenElement !== null;
  btn.setAttribute("aria-label", on ? "Exit fullscreen" : "Enter fullscreen");
  btn.querySelector("[data-icon-expand]")?.classList.toggle("hidden", on);
  btn.querySelector("[data-icon-collapse]")?.classList.toggle("hidden", !on);
};

// requestFullscreen rejects when the browser blocks it (no user gesture, or an
// iframe without allowfullscreen). Swallow it so the console stays clean; the
// icon is driven by the fullscreenchange event either way.
export const toggleFullscreen = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen().catch(() => {});
  }
};
