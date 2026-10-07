"use client";

import { useCallback, useState, type KeyboardEvent, type ReactNode } from "react";
import { EXPERIMENTS, type Experiment } from "./data";
import { LabModal } from "./LabModal";

// Just enough colour for the pseudo-code to read as code: keywords, strings and calls.
const TOKEN = /(\b(?:function|const|return|import|from)\b)|('[^']*'|"[^"]*")|([A-Za-z_]\w*)(?=\()/g;

function highlight(line: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(TOKEN)) {
    const index = match.index ?? 0;
    if (index > last) out.push(line.slice(last, index));
    const tone = match[1] ? "text-blue-400" : match[2] ? "text-amber-300" : "text-green-400";
    out.push(
      <span key={index} className={tone}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < line.length) out.push(line.slice(last));
  return out;
}

export function LabGrid() {
  const [selectedItem, setSelectedItem] = useState<Experiment | null>(null);
  // Stable so the modal's open/close effect doesn't re-run on every render.
  const close = useCallback(() => setSelectedItem(null), []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: Experiment) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelectedItem(item);
    }
  };

  return (
    <>
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 pb-32 lg:grid-cols-2">
        {EXPERIMENTS.map((item) => (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            aria-haspopup="dialog"
            aria-label={`Inspect ${item.filename}`}
            onClick={() => setSelectedItem(item)}
            onKeyDown={(event) => onKeyDown(event, item)}
            className="flex h-64 cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-600 focus-visible:border-zinc-500 focus-visible:outline-none"
          >
            <div className="relative flex shrink-0 items-center border-b border-zinc-800 bg-zinc-900 px-4 py-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate font-mono text-xs text-zinc-500">
                {item.filename}
              </span>
            </div>

            <div className="flex min-h-0 flex-1 flex-col p-5">
              <pre className="min-h-0 flex-1 overflow-hidden font-mono text-sm leading-relaxed text-zinc-300">
                <code>
                  {item.codeSnippet.split("\n").map((line, index) => (
                    <div key={index} className="flex">
                      <span className="mr-4 w-4 shrink-0 select-none text-right text-zinc-700">
                        {index + 1}
                      </span>
                      <span>{line ? highlight(line) : " "}</span>
                    </div>
                  ))}
                </code>
              </pre>
              <div className="mt-4 font-mono text-xs text-orange-400">{"> Click to execute & inspect"}</div>
            </div>
          </div>
        ))}
      </section>

      <LabModal selectedItem={selectedItem} onClose={close} />
    </>
  );
}
