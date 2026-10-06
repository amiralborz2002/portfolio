"use client";

import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { SquareTerminal } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

import { cn } from "@/lib/utils";
import { BentoCard } from "../ui/BentoCard";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

/*
 * Desktop (4 cols × 180px rows) — every cell filled:
 *
 *   ┌───────────┬─────┬─────┐
 *   │ Systems   │ 5+  │Code │
 *   │           ├─────┤     │
 *   │           │ IA  │     │
 *   ├───────────┴─────┼─────┤
 *   │ Tool stack      │ Loc │
 *   ├─────────────────┤     │
 *   │ Business logic  │     │
 *   └─────────────────┴─────┘
 */
export function BentoSnapshot() {
  const reduceMotion = !!useReducedMotion();

  const grid: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  const card: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
  };

  const shared = { variants: card, interactive: true, padding: "none", radius: "3xl" } as const;
  const body = "flex h-full flex-col p-6";

  return (
    <section
      id="at-a-glance"
      aria-labelledby="at-a-glance-title"
      className="mx-auto w-full max-w-6xl px-6"
    >
      <div className="mb-8 flex items-end justify-between gap-6">
        <div>
          <p className="eyebrow">At a glance</p>
          <h2 id="at-a-glance-title" className="mt-3 text-display-lg">
            Systems, signals &amp; shipped code.
          </h2>
        </div>
      </div>

      <motion.div
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
        className="grid auto-rows-[180px] grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 md:gap-5"
      >
        {/* 1. Core capability */}
        <BentoCard {...shared} className="row-span-2 sm:col-span-2" contentClassName={body}>
          <Glow className="bg-[radial-gradient(circle_at_70%_20%,rgb(249_115_22/0.22),transparent_60%)]" />
          <SystemGraph reduceMotion={reduceMotion} />
          <div className="mt-auto">
            <p className="eyebrow">Core capability</p>
            <h3 className="mt-2 text-title">Complex System Architecture</h3>
            <p className="mt-1.5 max-w-sm text-sm text-muted">
              Structuring chaos into scalable, navigable digital products.
            </p>
          </div>
        </BentoCard>

        {/* 2. Experience metric */}
        <BentoCard {...shared} contentClassName={cn(body, "justify-between")}>
          <Glow className="bg-[radial-gradient(circle_at_100%_0%,rgb(255_255_255/0.08),transparent_55%)]" />
          <p className="eyebrow">Experience</p>
          <div>
            <CountUp to={5} reduceMotion={reduceMotion} />
            <p className="text-sm text-muted">Years Experience</p>
          </div>
        </BentoCard>

        {/* 3. Design ↔ code */}
        <BentoCard {...shared} className="row-span-2" contentClassName={body}>
          <Glow className="bg-[radial-gradient(circle_at_20%_0%,rgb(56_189_248/0.16),transparent_60%)]" />
          <CodeMockup reduceMotion={reduceMotion} />
          <div className="mt-auto">
            <h3 className="text-lg font-semibold">Bridging Design &amp; Code</h3>
            <p className="mt-1 text-sm text-muted">From Figma frames to production components.</p>
          </div>
        </BentoCard>

        {/* 5. Information architecture */}
        <BentoCard {...shared} contentClassName={cn(body, "pt-5")}>
          <Glow className="bg-[radial-gradient(circle_at_80%_0%,rgb(168_85_247/0.22),transparent_60%)]" />
          <SchemaDiagram reduceMotion={reduceMotion} />
          <div className="mt-auto">
            <h3 className="text-base font-semibold">Information Architecture</h3>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              Structuring complex databases and dynamic logic into intuitive flows.
            </p>
          </div>
        </BentoCard>

        {/* 4. Tool stack */}
        <BentoCard
          {...shared}
          className="sm:col-span-2 md:col-span-3"
          contentClassName={cn(body, "justify-between px-0")}
        >
          <div className="flex items-start justify-between gap-4 px-6">
            <div>
              <p className="eyebrow">Tool stack</p>
              <h3 className="mt-2 text-lg font-semibold">From wireframe to deploy</h3>
            </div>
            <p className="hidden text-xs text-subtle sm:block">Hover to pause</p>
          </div>
          <ToolMarquee />
        </BentoCard>

        {/* 6. Location */}
        <BentoCard
          {...shared}
          className="md:row-span-2"
          contentClassName={cn(
            body,
            "flex-row items-center justify-between gap-4 md:flex-col-reverse md:items-stretch",
          )}
        >
          <Glow className="bg-[radial-gradient(circle_at_50%_35%,rgb(249_115_22/0.14),transparent_60%)]" />
          <div>
            <p className="eyebrow">Location</p>
            <h3 className="mt-2 text-lg font-semibold">Tehran, IR</h3>
            <p className="mt-1 font-mono text-[11px] text-subtle">
              <span className="whitespace-nowrap">35.6892° N</span> -{" "}
              <span className="whitespace-nowrap">51.3890° E</span>
            </p>
            <LocalTime />
          </div>
          <Radar reduceMotion={reduceMotion} />
        </BentoCard>

        {/* 7. Business logic */}
        <BentoCard
          {...shared}
          className="sm:col-span-2 md:col-span-3"
          contentClassName={cn(body, "flex-row items-center gap-6")}
        >
          <Glow className="bg-[radial-gradient(circle_at_100%_50%,rgb(16_185_129/0.14),transparent_55%)]" />
          <div className="max-w-sm shrink-0 sm:w-[44%]">
            <p className="eyebrow">Strategy</p>
            <h3 className="mt-2 text-lg font-semibold sm:text-xl">Business Logic &amp; Strategy</h3>
            <p className="mt-1.5 text-sm text-muted">
              Aligning technical constraints, dynamic pricing architectures, and multi-channel
              market strategies.
            </p>
          </div>
          <PricingSheet />
        </BentoCard>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */

function Glow({ className }: { className: string }) {
  return <span aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)} />;
}

/* ───────────────────────── 1. system graph ───────────────────────── */

const NODES = [
  { x: 160, y: 24 },
  { x: 80, y: 92 },
  { x: 240, y: 92 },
  { x: 36, y: 160 },
  { x: 124, y: 160 },
  { x: 196, y: 160 },
  { x: 284, y: 160 },
] as const;

const EDGES = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
  [4, 5],
] as const;

function edgePath(a: number, b: number) {
  const p = NODES[a];
  const q = NODES[b];
  if (p.y === q.y) return `M${p.x} ${p.y} Q${(p.x + q.x) / 2} ${p.y + 26} ${q.x} ${q.y}`;
  const midY = (p.y + q.y) / 2;
  return `M${p.x} ${p.y} C${p.x} ${midY} ${q.x} ${midY} ${q.x} ${q.y}`;
}

function SystemGraph({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 320 184"
      className="mx-auto w-full max-w-md flex-1 overflow-visible transition-transform duration-700 ease-apple group-hover:scale-[1.04]"
    >
      <defs>
        <radialGradient id="node-glow">
          <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
        </radialGradient>
      </defs>

      {EDGES.map(([a, b], i) => (
        <motion.path
          key={`e${i}`}
          d={edgePath(a, b)}
          fill="none"
          stroke="rgb(255 255 255 / 0.16)"
          strokeWidth={1}
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1, delay: 0.3 + i * 0.08, ease }}
        />
      ))}

      {/* Data packets flowing down the tree */}
      {!reduceMotion &&
        EDGES.map(([a, b], i) => (
          <circle key={`p${i}`} r={2.2} fill="#f97316">
            <animateMotion
              dur={`${2.4 + (i % 3) * 0.5}s`}
              begin={`${i * 0.35}s`}
              repeatCount="indefinite"
              path={edgePath(a, b)}
            />
          </circle>
        ))}

      {NODES.map((n, i) => (
        <g key={`n${i}`}>
          {i === 0 && <circle cx={n.x} cy={n.y} r={22} fill="url(#node-glow)" />}
          <circle
            cx={n.x}
            cy={n.y}
            r={i === 0 ? 7 : 5}
            className={cn(
              "stroke-[1.5] transition-colors duration-500",
              i === 0
                ? "fill-accent stroke-accent"
                : "fill-zinc-950 stroke-white/40 group-hover:stroke-accent",
            )}
          />
        </g>
      ))}
    </svg>
  );
}

/* ───────────────────────── 2. count-up ───────────────────────── */

function CountUp({ to, reduceMotion }: { to: number; reduceMotion: boolean }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, to]);

  return (
    <p
      ref={ref}
      aria-label={`+${to}`}
      className="text-7xl leading-none font-bold tracking-tighter text-white tabular-nums"
    >
      <span className="mr-1 inline-block text-accent transition-transform duration-500 ease-apple group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:rotate-90">
        +
      </span>
      {reduceMotion ? to : value}
    </p>
  );
}

/* ───────────────────────── 3. code mockup ───────────────────────── */

function CodeMockup({ reduceMotion }: { reduceMotion: boolean }) {
  const k = "text-[#c084fc]"; // keyword / tag
  const a = "text-[#7dd3fc]"; // attribute
  const v = "text-[#fdba74]"; // value

  return (
    <div aria-hidden className="relative mb-4 select-none">
      <div className="overflow-hidden rounded-xl border border-white/10 bg-zinc-950/80 shadow-ambient">
        <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-2 font-mono text-[10px] text-subtle">Hero.tsx</span>
        </div>
        <pre className="overflow-hidden px-3 py-3 font-mono text-[10px] leading-[1.7] whitespace-pre text-zinc-400 lg:text-[11px]">
          <span className={k}>{"<Button"}</span>
          {"\n  "}
          <span className={a}>variant</span>=<span className={v}>&quot;primary&quot;</span>
          {"\n  "}
          <span className={a}>className</span>=<span className={v}>&quot;rounded-full</span>
          {"\n    "}
          <span className={v}>bg-accent px-6&quot;</span>
          {"\n"}
          <span className={k}>{">"}</span>
          {"\n  Let's Talk"}
          <motion.span
            className="ml-px inline-block h-3 w-1.5 translate-y-0.5 bg-accent/80"
            animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
          />
          {"\n"}
          <span className={k}>{"</Button>"}</span>
        </pre>
      </div>

      {/* The rendered result, overlapping its own source */}
      <div className="absolute -right-2 -bottom-8 rotate-3 rounded-2xl border border-white/15 bg-zinc-900/90 p-3 shadow-ambient-lg backdrop-blur-md transition-transform duration-500 ease-apple group-hover:-translate-y-2 group-hover:rotate-0">
        <p className="mb-2 font-mono text-[9px] tracking-widest text-subtle uppercase">Preview</p>
        <span className="inline-flex h-8 items-center rounded-full bg-accent px-4 text-xs font-medium text-black">
          Let&apos;s Talk
        </span>
      </div>
    </div>
  );
}

/* ───────────────────────── 4. tool marquee ───────────────────────── */

const TOOLS: { name: string; icon: ReactNode }[] = [
  // Ordered along the design → deploy spectrum
  { name: "Figma", icon: <FigmaMark /> },
  { name: "FigJam", icon: <FigJamMark /> },
  { name: "Photoshop", icon: <AdobeMark label="Ps" bg="#001E36" fg="#31A8FF" /> },
  { name: "Illustrator", icon: <AdobeMark label="Ai" bg="#330000" fg="#FF9A00" /> },
  { name: "Blender", icon: <BlenderMark /> },
  { name: "Cursor", icon: <CursorMark /> },
  { name: "Python", icon: <PythonMark /> },
  { name: "Terminal", icon: <SquareTerminal className="size-4 text-emerald-400" strokeWidth={1.75} /> },
  { name: "GitHub", icon: <GitHubMark /> },
];

function ToolMarquee() {
  return (
    <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
      <p className="sr-only">{TOOLS.map((t) => t.name).join(", ")}</p>
      <ul
        aria-hidden
        className="flex w-max animate-marquee gap-3 group-hover:[animation-play-state:paused]"
      >
        {[...TOOLS, ...TOOLS].map((tool, i) => (
          <li
            key={`${tool.name}-${i}`}
            className="flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] py-2 pr-4 pl-3 text-sm text-zinc-400 grayscale transition-[color,filter,border-color,background-color] duration-300 hover:border-white/20 hover:bg-white/[0.06] hover:text-white hover:grayscale-0"
          >
            <span className="flex size-5 items-center justify-center">{tool.icon}</span>
            {tool.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────── 5. wave chart ───────────────────────── */

const TABLES = [
  { name: "products", x: 0, rows: ["id", "sku", "base_price"], key: 2 },
  { name: "pricing_rules", x: 116, rows: ["id", "product_id", "multiplier"], key: 1 },
] as const;

function SchemaDiagram({ reduceMotion }: { reduceMotion: boolean }) {
  // products.base_price ↔ pricing_rules.product_id, as an ERD relation line.
  const link = "M84 39 C 100 39, 100 29, 116 29";

  return (
    <svg
      aria-hidden
      viewBox="0 0 200 54"
      className="w-full overflow-visible transition-transform duration-700 ease-apple group-hover:scale-[1.03] md:max-lg:hidden"
    >
      {TABLES.map((t) => (
        <g key={t.name} transform={`translate(${t.x} 0)`}>
          <rect
            width="84"
            height="54"
            rx="6"
            className="fill-zinc-950/80 stroke-white/15 transition-colors duration-500 group-hover:stroke-purple-400/50"
          />
          <rect width="84" height="13" rx="6" className="fill-white/[0.06]" />
          <text x="7" y="9.5" className="fill-zinc-300 font-mono text-[7px]">
            {t.name}
          </text>
          {t.rows.map((r, i) => (
            <text
              key={r}
              x="7"
              y={23 + i * 10}
              className={cn(
                "font-mono text-[6.5px]",
                i === t.key ? "fill-purple-300" : "fill-zinc-500",
              )}
            >
              {i === 0 ? "# " : ""}
              {r}
            </text>
          ))}
        </g>
      ))}
      <motion.path
        d={link}
        fill="none"
        stroke="#c084fc"
        strokeWidth={1}
        strokeDasharray="2 2"
        initial={{ pathLength: reduceMotion ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.4, ease }}
      />
      <circle cx="84" cy="39" r="2" fill="#c084fc" />
      <circle cx="116" cy="29" r="2" fill="#c084fc" />
      {!reduceMotion && (
        <circle r="1.6" fill="#f5d0fe">
          <animateMotion dur="2.4s" repeatCount="indefinite" path={link} />
        </circle>
      )}
    </svg>
  );
}

/* ───────────────────────── 6. location ───────────────────────── */

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Tehran",
  hour: "2-digit",
  minute: "2-digit",
});

function LocalTime() {
  // Rendered after mount only, so server and client HTML always match.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(timeFormat.format(new Date()));
    const first = window.setTimeout(tick, 0);
    const id = window.setInterval(tick, 15_000);
    return () => {
      window.clearTimeout(first);
      window.clearInterval(id);
    };
  }, []);

  return (
    <p className="mt-0.5 font-mono text-[11px] whitespace-nowrap text-subtle">
      <span className="text-zinc-300 tabular-nums">{time ?? "--:--"}</span> local time
    </p>
  );
}

function Radar({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      aria-hidden
      className="relative size-28 shrink-0 rounded-full border border-white/10 bg-zinc-950/60 transition-transform duration-700 ease-apple group-hover:scale-105 md:size-36 md:self-center lg:size-44"
    >
      <span className="absolute inset-[18%] rounded-full border border-white/[0.07]" />
      <span className="absolute inset-[36%] rounded-full border border-white/[0.07]" />
      <span className="absolute inset-x-0 top-1/2 h-px bg-white/[0.06]" />
      <span className="absolute inset-y-0 left-1/2 w-px bg-white/[0.06]" />
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0deg,transparent_290deg,rgb(249_115_22/0.45)_360deg)]",
          !reduceMotion && "animate-radar",
        )}
      />
      {/* Blips */}
      <span className="absolute top-[28%] left-[64%] size-1 rounded-full bg-accent/70" />
      <span className="absolute top-[68%] left-[30%] size-1 rounded-full bg-accent/50" />
      {/* Tehran */}
      <span className="absolute top-1/2 left-1/2 flex size-2.5 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
        <span className="relative size-2.5 rounded-full bg-accent shadow-[0_0_12px_rgb(249_115_22/0.9)]" />
      </span>
    </div>
  );
}

/* ───────────────────────── 7. pricing sheet ───────────────────────── */

const SHEET = [
  ["A-01", "120", "1.15", "138.00"],
  ["A-02", "86", "0.92", "79.12"],
  ["B-07", "240", "1.30", "312.00"],
] as const;

const BARS = [38, 52, 44, 68, 60, 86] as const;

function PricingSheet() {
  return (
    <div aria-hidden className="relative hidden h-full flex-1 select-none sm:block">
      {/* Spreadsheet */}
      <div className="absolute top-0 right-0 bottom-5 left-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70 font-mono text-[10px] md:right-16">
        <div className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr] border-b border-white/10 bg-white/[0.04] text-zinc-500">
          {["sku", "base", "demand", "price"].map((h) => (
            <span key={h} className="border-r border-white/5 px-2 py-1 last:border-r-0">
              {h}
            </span>
          ))}
        </div>
        {SHEET.map((row, r) => (
          <div key={row[0]} className="grid grid-cols-[1.1fr_1fr_1fr_1.2fr] border-b border-white/5 text-zinc-400">
            {row.map((cell, c) => (
              <span
                key={c}
                className={cn(
                  "border-r border-white/5 px-2 py-1 tabular-nums last:border-r-0",
                  r === 2 &&
                    c === 3 &&
                    "text-emerald-300 outline outline-1 -outline-offset-1 outline-emerald-400/60 transition-colors duration-500 group-hover:bg-emerald-400/10",
                )}
              >
                {cell}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* Formula modal overlapping the sheet */}
      <div className="absolute -bottom-1 left-6 rounded-lg border border-white/15 bg-zinc-900/95 px-3 py-2 font-mono text-[10px] shadow-ambient-lg backdrop-blur-md transition-transform duration-500 ease-apple group-hover:-translate-y-1.5">
        <span className="mr-2 text-subtle italic">ƒx</span>
        <span className="text-zinc-300">=IF(</span>
        <span className="text-sky-300">C4</span>
        <span className="text-zinc-300">&gt;1.2, </span>
        <span className="text-sky-300">B4</span>
        <span className="text-zinc-300">*</span>
        <span className="text-sky-300">C4</span>
        <span className="text-zinc-300">, </span>
        <span className="text-sky-300">B4</span>
        <span className="text-zinc-300">)</span>
      </div>

      {/* Revenue bars + logic node */}
      <div className="absolute top-1 right-0 bottom-1 hidden w-14 flex-col items-center justify-between md:flex">
        <span className="flex size-7 rotate-45 items-center justify-center rounded-md border border-emerald-400/50 bg-emerald-400/10 shadow-[0_0_16px_rgb(16_185_129/0.35)] transition-transform duration-500 ease-apple group-hover:rotate-[405deg]">
          <span className="-rotate-45 font-mono text-[8px] text-emerald-200">if</span>
        </span>
        <span className="h-3 w-px bg-gradient-to-b from-emerald-400/60 to-transparent" />
        <div className="flex h-16 items-end gap-1">
          {BARS.map((h, i) => (
            <span
              key={i}
              style={{ height: `${h}%` }}
              className={cn(
                "w-1.5 origin-bottom rounded-sm transition-transform duration-500 ease-apple group-hover:scale-y-110",
                i === BARS.length - 1 ? "bg-emerald-400" : "bg-white/20",
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── brand marks ───────────────────────── */

function FigmaMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path d="M12 2H8.5a3.5 3.5 0 0 0 0 7H12z" fill="#F24E1E" />
      <path d="M12 2h3.5a3.5 3.5 0 0 1 0 7H12z" fill="#FF7262" />
      <path d="M12 9H8.5a3.5 3.5 0 0 0 0 7H12z" fill="#A259FF" />
      <circle cx="15.5" cy="12.5" r="3.5" fill="#1ABCFE" />
      <path d="M12 16H8.5a3.5 3.5 0 1 0 3.5 3.5z" fill="#0ACF83" />
    </svg>
  );
}

function FigJamMark() {
  // Sticky note with a folded corner
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path d="M4 3h16v12l-5 6H4z" fill="#FFC943" />
      <path d="M20 15h-5v6z" fill="#E5A800" />
      <path d="M8 8h8M8 11.5h5" stroke="#7A5800" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function AdobeMark({ label, bg, fg }: { label: string; bg: string; fg: string }) {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <rect width="24" height="24" rx="5" fill={bg} />
      <text
        x="12"
        y="16.5"
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui"
        fill={fg}
      >
        {label}
      </text>
    </svg>
  );
}

function CursorMark() {
  // Isometric cube, shaded faces
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path d="M12 2 21 7 12 12 3 7z" fill="#e4e4e7" />
      <path d="M3 7 12 12V22L3 17z" fill="#a1a1aa" />
      <path d="M21 7 12 12V22L21 17z" fill="#52525b" />
      <path d="M12 12 21 7" stroke="#09090b" strokeWidth="0.75" />
    </svg>
  );
}

function PythonMark() {
  const snake =
    "M11.9 2C7.3 2 7.6 4 7.6 4v2.1H12v.6H5.8S2.9 6.4 2.9 11s2.6 4.4 2.6 4.4H7v-2.1s-.1-2.6 2.5-2.6h4.4s2.4 0 2.4-2.4V4.4S16.7 2 11.9 2zM9.5 3.4a.8.8 0 1 1 0 1.6.8.8 0 0 1 0-1.6z";
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <path d={snake} fill="#3776AB" />
      <path d={snake} fill="#FFD43B" transform="rotate(180 12 12)" />
    </svg>
  );
}

function BlenderMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="none">
      <path d="M2.5 9.5h8M5 14l5.5-4.5" stroke="#E87D0D" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="14.5" cy="13" r="6.5" fill="#E87D0D" />
      <circle cx="14.5" cy="13" r="3.6" fill="#fff" />
      <circle cx="14.5" cy="13" r="2.1" fill="#265787" />
    </svg>
  );
}

function GitHubMark() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="currentColor">
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
    </svg>
  );
}
