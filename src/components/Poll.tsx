import { useState } from "react";

interface Props {
  question: string;
  options: string[];
}

/**
 * Live show-of-hands tally for use during a talk. State is per-browser and
 * resets on reload, so it counts the room in the moment rather than persisting.
 */
export default function Poll({ question, options }: Props) {
  const [votes, setVotes] = useState<number[]>(() => options.map(() => 0));
  const total = votes.reduce((a, b) => a + b, 0);

  return (
    <div className="w-full">
      <p className="font-sans font-medium mb-4">{question}</p>
      <ul role="list" className="list-none p-0 m-0 flex flex-col gap-3">
        {options.map((option, i) => {
          // Bars stay at 0 width until the first vote, avoiding 0/0.
          const share = total === 0 ? 0 : Math.round((votes[i] / total) * 100);
          return (
            <li key={option} className="list-none">
              <button
                type="button"
                // Functional update: clicks in the same tick each build on the
                // previous count instead of a stale snapshot.
                onClick={() => setVotes((prev) => prev.map((v, j) => (j === i ? v + 1 : v)))}
                className="w-full text-left bg-transparent border-0 p-0 cursor-pointer font-sans"
              >
                <span className="flex justify-between items-baseline mb-1">
                  <span>{option}</span>
                  <span className="tabular-nums opacity-60 text-sm">
                    {votes[i]} ({share}%)
                  </span>
                </span>
                <span className="block h-3 rounded-full bg-current/15 overflow-hidden">
                  <span
                    className="block h-full bg-current transition-[width] duration-300"
                    style={{ width: `${share}%` }}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="font-sans text-sm opacity-60 mt-4">
        {total === 0 ? "Click an option to vote." : `${total} vote${total === 1 ? "" : "s"}`}
      </p>
    </div>
  );
}
