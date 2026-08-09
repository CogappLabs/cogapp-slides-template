// The presenter window: notes, next slide, and a timer. Navigating here moves
// the deck window too, over the same channel the deck listens on.
//
// This is deliberately separate from deck.ts rather than sharing a base: the
// two windows do different jobs, and a deck author is more likely to edit one
// than to want them coupled.

import { onMessage, post } from "./sync";
import { start as startTimer } from "./timer";

const body = document.body;
const base = body.dataset.base || "";
const slug = body.dataset.slug!;
const prev = body.dataset.prev;
const next = body.dataset.next;

const go = (target?: string) => {
  if (!target) return;
  post({ slug: target });
  location.href = `${base}/presenter/${target}`;
};

// Fullscreen belongs to the deck window, never this one: notes are for the
// presenter, so making them fullscreen would hide what is being controlled.
const fullscreenDeck = () => post({ fullscreen: true });

onMessage((message) => {
  if (!message.slug || message.slug === slug) return;
  location.href = `${base}/presenter/${message.slug}`;
});

// Announce where we are, so a deck window opened later catches up.
post({ slug });

document.addEventListener("keydown", (e) => {
  if (e.metaKey || e.ctrlKey || e.altKey || e.shiftKey) return;
  const el = e.target;
  if (
    el instanceof HTMLElement &&
    (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))
  ) {
    return;
  }
  if (e.key === "ArrowRight" || e.key === "ArrowDown" || e.key === "PageDown") {
    e.preventDefault();
    go(next);
  } else if (e.key === "ArrowLeft" || e.key === "ArrowUp" || e.key === "PageUp") {
    e.preventDefault();
    go(prev);
  } else if (e.key === "f" || e.key === "F") {
    e.preventDefault();
    fullscreenDeck();
  }
});

document.addEventListener("click", (e) => {
  const target = e.target as HTMLElement;
  if (target.closest?.("[data-deck-fullscreen]")) {
    fullscreenDeck();
    return;
  }
  const link = target.closest?.<HTMLAnchorElement>(
    'nav a[rel="prev"], nav a[rel="next"]',
  );
  if (!link) return;
  e.preventDefault();
  go(link.rel === "prev" ? prev : next);
});

startTimer();
