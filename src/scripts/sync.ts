// Keeps the deck window and the presenter window on the same slide.
//
// BroadcastChannel only reaches other tabs in the same browser, so a presenter
// URL opened on another machine is a standalone read-only view. Every message
// carries a sender id, so a window never acts on its own broadcast.

export type DeckMessage = {
  from: string;
  slug?: string;
  fullscreen?: true;
};

export const channel =
  "BroadcastChannel" in window ? new BroadcastChannel("deck") : null;

/** This window's id, used to ignore our own messages. */
export const me = Math.random().toString(36).slice(2);

export const post = (message: Omit<DeckMessage, "from">) =>
  channel?.postMessage({ from: me, ...message });

/** Calls `handler` for messages from any window except this one. */
export const onMessage = (handler: (message: DeckMessage) => void) =>
  channel?.addEventListener("message", (e) => {
    const data = e.data as DeckMessage | undefined;
    if (!data || data.from === me) return;
    handler(data);
  });
