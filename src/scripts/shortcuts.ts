// The `?` overlay. One list drives it, so the help cannot drift from what the
// keys actually do; add a shortcut here when you add one to the key handler.

export const shortcuts: [keys: string, description: string][] = [
  ["→ ↓ Page Down", "Next slide"],
  ["← ↑ Page Up", "Previous slide"],
  ["Home / End", "First / last slide"],
  ["F", "Fullscreen"],
  ["P", "Presenter view"],
  ["Alt-click", "Magnify that spot (Ctrl-click on Linux)"],
  ["Esc", "Reset the magnifier"],
  ["?", "This list"],
];

const ID = "deck-shortcuts";

export const isOpen = () => document.getElementById(ID) !== null;

export const close = () => document.getElementById(ID)?.remove();

export const open = () => {
  if (isOpen()) return;
  const dialog = document.createElement("dialog");
  dialog.id = ID;
  dialog.setAttribute("aria-label", "Keyboard shortcuts");
  // outline-none: the dialog takes focus when it opens, and the global
  // focus-visible ring is meant for things you tab to.
  dialog.className =
    "m-auto p-8 rounded-lg border-0 outline-none bg-slate text-cream shadow-xl backdrop:bg-black/50";
  dialog.innerHTML = `
    <h2 class="font-sans text-xs uppercase tracking-[0.16em] opacity-60 m-0 mb-5">Keyboard shortcuts</h2>
    <dl class="grid grid-cols-[auto_1fr] gap-x-8 gap-y-3 m-0 font-sans text-base">
      ${shortcuts
        .map(
          ([keys, description]) =>
            `<dt class="font-mono whitespace-nowrap opacity-90">${keys}</dt><dd class="m-0 opacity-75">${description}</dd>`,
        )
        .join("")}
    </dl>`;
  document.body.appendChild(dialog);
  dialog.showModal();
  // A native dialog closes itself on Escape; drop the element so `open` can
  // rebuild it and the id stays unique.
  dialog.addEventListener("close", () => dialog.remove());
};

export const toggle = () => (isOpen() ? close() : open());
