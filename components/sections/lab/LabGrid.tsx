"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import { EXPERIMENTS, type Experiment, type ExperimentType } from "./data";
import { LabModal } from "./LabModal";

// A line is a list of [text, tone] tokens, so the teaser reads as syntax-highlighted source.
type Tone = "kw" | "fn" | "str" | "dim" | "txt";
type Line = [string, Tone][];

const TONE_CLASS: Record<Tone, string> = {
  kw: "text-blue-400",
  fn: "text-green-400",
  str: "text-amber-300",
  dim: "text-zinc-600",
  txt: "text-zinc-300",
};

const SNIPPETS: Record<ExperimentType, Line[]> = {
  python: [
    [["import", "kw"], [" requests", "txt"]],
    [["from", "kw"], [" pathlib ", "txt"], ["import", "kw"], [" Path", "txt"]],
    [],
    [["def", "kw"], [" run", "fn"], ["(config: dict) -> ", "txt"], ["None", "kw"], [":", "txt"]],
    [["    # TODO: handle rate limits properly", "dim"]],
    [["    session", "txt"], [" = ", "txt"], ["requests", "txt"], [".", "txt"], ["Session", "fn"], ["()", "txt"]],
  ],
  typescript: [
    [["import", "kw"], [" { pipeline } ", "txt"], ["from", "kw"], [' "./core"', "str"], [";", "txt"]],
    [],
    [["export async function", "kw"], [" init", "fn"], ["(): ", "txt"], ["Promise", "kw"], ["<void> {", "txt"]],
    [["  // ship first, refactor later", "dim"]],
    [["  const", "kw"], [" jobs = ", "txt"], ["await", "kw"], [" pipeline", "txt"], [".", "txt"], ["collect", "fn"], ["();", "txt"]],
    [["}", "txt"]],
  ],
  script: [
    [["function", "kw"], [" onEdit", "fn"], ["(e) {", "txt"]],
    [["  const", "kw"], [" sheet = ", "txt"], ["SpreadsheetApp", "txt"], [".", "txt"], ["getActive", "fn"], ["();", "txt"]],
    [["  // dropdowns -> master prompt", "dim"]],
    [["  const", "kw"], [" range = sheet.", "txt"], ["getRange", "fn"], ["(", "txt"], ['"A2:F"', "str"], [");", "txt"]],
    [["  compile", "fn"], ["(range.", "txt"], ["getValues", "fn"], ["());", "txt"]],
    [["}", "txt"]],
  ],
};

export function LabGrid() {
  const [selected, setSelected] = useState<Experiment | null>(null);
  // Stable so the modal's open/close effect doesn't re-run on every render.
  const close = useCallback(() => setSelected(null), []);

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, item: Experiment) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected(item);
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
            onClick={() => setSelected(item)}
            onKeyDown={(event) => onKeyDown(event, item)}
            className="group flex h-64 cursor-pointer flex-col overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-600 focus-visible:border-zinc-500 focus-visible:outline-none"
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

            <pre className="min-h-0 flex-1 overflow-hidden p-5 font-mono text-sm leading-relaxed">
              <code>
                {SNIPPETS[item.type].map((line, index) => (
                  <div key={index} className="flex">
                    <span className="mr-4 w-4 shrink-0 select-none text-right text-zinc-700">
                      {index + 1}
                    </span>
                    <span>
                      {line.length === 0
                        ? " "
                        : line.map(([text, tone], tokenIndex) => (
                            <span key={tokenIndex} className={TONE_CLASS[tone]}>
                              {text}
                            </span>
                          ))}
                    </span>
                  </div>
                ))}
              </code>
            </pre>

            <div className="shrink-0 border-t border-zinc-900 px-5 py-2.5 font-mono text-xs text-zinc-500 transition-colors group-hover:text-green-400">
              &gt; Click to execute &amp; inspect
            </div>
          </div>
        ))}
      </section>

      <LabModal item={selected} onClose={close} />
    </>
  );
}
