"use client";

import { useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

type ExperimentType = "python" | "typescript" | "script";

type Experiment = {
  id: number;
  filename: string;
  type: ExperimentType;
  bottleneck: string;
  fix: string;
  outcome: string;
};

const EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    filename: "jira-rice-automation.py",
    type: "python",
    bottleneck: "Product teams were slow at prioritizing backlog tasks manually.",
    fix: "Integrated the RICE framework formula with Jira's API via Python to auto-calculate task weights.",
    outcome: "Saved 5 hours per sprint in planning meetings.",
  },
  {
    id: 2,
    filename: "article-content-pipeline.ts",
    type: "typescript",
    bottleneck: "Content team had a fragmented workflow for drafting and publishing.",
    fix: "Built an end-to-end automation pipeline connecting docs to the CMS.",
    outcome: "Reduced publishing friction by 60%.",
  },
  {
    id: 3,
    filename: "prompt-generator-engine.gs",
    type: "script",
    bottleneck: "Designers were writing inconsistent AI prompts for product photography.",
    fix: "Created a Google Sheet with a dynamic script that compiles master prompts based on UI dropdowns.",
    outcome: "Standardized AI outputs across the design team.",
  },
  {
    id: 4,
    filename: "blender-physics-sim.py",
    type: "python",
    bottleneck: "Explaining complex physical dispatching mechanisms visually was too manual.",
    fix: "Combined Python scripting with Blender/Manim to automate technical 3D animations.",
    outcome: "Created reusable code-driven animation assets.",
  },
];

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
  const [openId, setOpenId] = useState<number | null>(null);
  const reduceMotion = useReducedMotion();

  const toggle = (id: number) => setOpenId((current) => (current === id ? null : id));

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>, id: number) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle(id);
    }
  };

  const transition = { duration: reduceMotion ? 0 : 0.22, ease: "easeOut" } as const;

  return (
    // items-start: expanding one card must not stretch its neighbour in the same row.
    <section className="mx-auto grid max-w-7xl grid-cols-1 items-start gap-6 px-6 pb-32 lg:grid-cols-2">
      {EXPERIMENTS.map((item) => {
        const isOpen = openId === item.id;
        const bodyId = `lab-body-${item.id}`;

        return (
          <div
            key={item.id}
            role="button"
            tabIndex={0}
            aria-expanded={isOpen}
            aria-controls={bodyId}
            onClick={() => toggle(item.id)}
            onKeyDown={(event) => onKeyDown(event, item.id)}
            className="cursor-pointer overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 transition-colors hover:border-zinc-700 focus-visible:border-zinc-600 focus-visible:outline-none"
          >
            <div className="relative flex items-center border-b border-zinc-800 bg-zinc-900 px-4 py-2">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
                <span className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
              </div>
              <span className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate font-mono text-xs text-zinc-500">
                {item.filename}
              </span>
              <span className="ml-auto font-mono text-[10px] uppercase tracking-widest text-zinc-600">
                {isOpen ? "[-]" : "[+]"}
              </span>
            </div>

            <div id={bodyId} className="font-mono text-sm">
              <AnimatePresence mode="wait" initial={false}>
                {isOpen ? (
                  <motion.div
                    key="readme"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transition}
                    className="overflow-hidden"
                  >
                    <div className="p-5 leading-relaxed">
                      <div className="mb-4 text-zinc-600">
                        $ cat {item.filename.replace(/\.\w+$/, "")}/README.md
                      </div>
                      <div className="mb-1 font-bold text-orange-400">{"// THE BOTTLENECK"}</div>
                      <div className="mb-4 text-zinc-300">{item.bottleneck}</div>
                      <div className="mb-1 font-bold text-blue-400">{"// THE FIX"}</div>
                      <div className="mb-4 text-zinc-300">{item.fix}</div>
                      <div className="mb-1 font-bold text-green-400">{"// THE OUTCOME"}</div>
                      <div className="text-zinc-300">{item.outcome}</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="source"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={transition}
                    className="overflow-hidden"
                  >
                    <pre className="overflow-x-auto p-5 leading-relaxed">
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
                    <div className="border-t border-zinc-900 px-5 py-2 text-xs text-zinc-600">
                      <span className="text-green-400">~</span> click to inspect
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </section>
  );
}
