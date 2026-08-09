// The presenter's elapsed timer, with pause and reset.
//
// State lives in sessionStorage so it survives moving between presenter pages:
// `elapsed` is banked time, `since` is when the running stretch began, or null
// while paused.

const KEY = "deck-timer";

type TimerState = { elapsed: number; since: number | null };

const read = (): TimerState => {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as TimerState;
  } catch {}
  return { elapsed: 0, since: Date.now() };
};

const write = (state: TimerState) =>
  sessionStorage.setItem(KEY, JSON.stringify(state));

const total = (state: TimerState) =>
  state.elapsed + (state.since === null ? 0 : Date.now() - state.since);

export const start = () => {
  const display = document.querySelector("[data-timer]");
  const toggle = document.querySelector("[data-timer-toggle]");
  const reset = document.querySelector("[data-timer-reset]");
  if (!display || !toggle || !reset) return;

  let state = read();
  write(state);

  const render = () => {
    const seconds = Math.floor(total(state) / 1000);
    const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
    const ss = String(seconds % 60).padStart(2, "0");
    display.textContent = `${mm}:${ss}`;
    display.classList.toggle("opacity-50", state.since === null);
    toggle.textContent = state.since === null ? "Resume" : "Pause";
  };

  toggle.addEventListener("click", () => {
    state =
      state.since === null
        ? { elapsed: state.elapsed, since: Date.now() }
        : { elapsed: total(state), since: null };
    write(state);
    render();
  });

  reset.addEventListener("click", () => {
    state = { elapsed: 0, since: state.since === null ? null : Date.now() };
    write(state);
    render();
  });

  render();
  setInterval(render, 1000);
};
