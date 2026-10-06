"use client";

import Link from "next/link";
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from "framer-motion";
import { ArrowUpRight, Mail } from "lucide-react";
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
 *   │           │ BE  │     │
 *   ├───────────┴─────┼─────┤
 *   │ Tool stack      │ Loc │
 *   ├─────────────────┤     │
 *   │ Availability    │     │
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

        {/* 5. Philosophy */}
        <BentoCard {...shared} contentClassName={body}>
          <Glow className="bg-[radial-gradient(circle_at_80%_100%,rgb(168_85_247/0.22),transparent_60%)]" />
          <p className="eyebrow">Philosophy</p>
          <h3 className="mt-2 text-base font-semibold">Behavioral Economics</h3>
          <WaveChart reduceMotion={reduceMotion} />
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
            <h3 className="mt-2 text-lg font-semibold">Haarlem, NL</h3>
            <p className="mt-1 font-mono text-[11px] whitespace-nowrap text-subtle">52.38° N · 4.64° E</p>
            <LocalTime />
          </div>
          <Radar reduceMotion={reduceMotion} />
        </BentoCard>

        {/* 7. Availability */}
        <BentoCard
          {...shared}
          className="sm:col-span-2 md:col-span-3"
          contentClassName={cn(body, "justify-center")}
        >
          <Glow className="bg-[radial-gradient(circle_at_0%_50%,rgb(16_185_129/0.16),transparent_55%)]" />
          <Link
            href="/contact"
            className="absolute inset-0 z-10 rounded-3xl"
            aria-label="Open for new challenges — let's connect"
          />
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <PulseDot animate={!reduceMotion} />
              <div>
                <h3 className="text-lg font-semibold sm:text-xl">Open for new challenges</h3>
                <p className="mt-1 text-sm text-muted">
                  Freelance, contract &amp; full-time product design roles.
                </p>
              </div>
            </div>
            <ConnectPill />
          </div>
        </BentoCard>
      </motion.div>
    </section>
  );
}

/* ───────────────────────── shared bits ───────────────────────── */

function Glow({ className }: { className: string }) {
  return <span aria-hidden className={cn("pointer-events-none absolute inset-0 -z-10", className)} />;
}

function PulseDot({ animate: on }: { animate: boolean }) {
  return (
    <span aria-hidden className="relative flex size-3 shrink-0">
      {on && (
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-400"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.8, opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
        />
      )}
      <span className="relative size-3 rounded-full bg-emerald-500 shadow-[0_0_14px_rgb(16_185_129/0.7)]" />
    </span>
  );
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
      aria-label={`${to}+`}
      className="text-7xl leading-none font-bold tracking-tighter text-white tabular-nums"
    >
      {reduceMotion ? to : value}
      <span className="inline-block text-accent transition-transform duration-500 ease-apple group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:rotate-90">
        +
      </span>
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
  { name: "Figma", icon: <FigmaMark /> },
  { name: "Framer", icon: <FramerMark /> },
  { name: "React", icon: <ReactMark /> },
  { name: "Next.js", icon: <NextMark /> },
  { name: "GitHub", icon: <GitHubMark /> },
  { name: "Tailwind CSS", icon: <TailwindMark /> },
  { name: "TypeScript", icon: <TypeScriptMark /> },
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

const WAVE = "M0 62 C 24 62, 34 26, 58 32 S 98 70, 124 48 S 166 12, 200 16";

function WaveChart({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div aria-hidden className="relative mt-auto h-16 w-full">
      <svg viewBox="0 0 200 80" preserveAspectRatio="none" className="size-full overflow-visible">
        <defs>
          <linearGradient id="wave-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60].map((y) => (
          <line
            key={y}
            x1="0"
            x2="200"
            y1={y}
            y2={y}
            stroke="rgb(255 255 255 / 0.05)"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <path d={`${WAVE} L200 80 L0 80 Z`} fill="url(#wave-fill)" />
        <motion.path
          d={WAVE}
          fill="none"
          stroke="#c084fc"
          strokeWidth={2}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          initial={{ pathLength: reduceMotion ? 1 : 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
          className="transition-[filter] duration-500 group-hover:drop-shadow-[0_0_6px_rgb(192_132_252/0.8)]"
        />
      </svg>
      {/* End point lives outside the stretched SVG so it stays a circle (y = 16/80) */}
      <span className="absolute top-[20%] right-0 flex size-2 translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-ping rounded-full bg-purple-400/70" />
        <span className="relative size-2 rounded-full bg-fuchsia-100 shadow-[0_0_10px_rgb(192_132_252/0.9)]" />
      </span>
    </div>
  );
}

/* ───────────────────────── 6. location ───────────────────────── */

const timeFormat = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Europe/Amsterdam",
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
      {/* Haarlem */}
      <span className="absolute top-1/2 left-1/2 flex size-2.5 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute inset-0 animate-ping rounded-full bg-accent/70" />
        <span className="relative size-2.5 rounded-full bg-accent shadow-[0_0_12px_rgb(249_115_22/0.9)]" />
      </span>
    </div>
  );
}

/* ───────────────────────── 7. connect pill ───────────────────────── */

function ConnectPill() {
  return (
    <span
      aria-hidden
      className="relative flex h-11 shrink-0 items-center gap-3 rounded-full border border-white/10 bg-white/5 p-1.5 text-sm font-medium text-white transition-[background-color,border-color,color,box-shadow] duration-500 ease-apple group-hover:border-accent group-hover:bg-accent group-hover:text-black group-hover:shadow-glow sm:pl-5"
    >
      <span className="hidden whitespace-nowrap sm:inline">Let&apos;s Connect</span>
      {/* Icon swap: mail slides out, arrow slides in */}
      <span className="relative flex size-8 items-center justify-center overflow-hidden rounded-full bg-white/10 transition-colors duration-500 group-hover:bg-black/15">
        <Mail
          className="size-4 transition-transform duration-500 ease-apple group-hover:translate-x-6 group-hover:-translate-y-6"
          strokeWidth={1.75}
        />
        <ArrowUpRight
          className="absolute size-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-apple group-hover:translate-x-0 group-hover:translate-y-0"
          strokeWidth={2}
        />
      </span>
    </span>
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

function FramerMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
      <path d="M5 1h14v7.33h-7z M5 8.33h7l7 7.34H5z M5 15.67h7V23z" />
    </svg>
  );
}

function ReactMark() {
  return (
    <svg viewBox="-12 -12 24 24" className="size-5" fill="none" stroke="#61DAFB" strokeWidth="1">
      <circle r="2" fill="#61DAFB" stroke="none" />
      <ellipse rx="10" ry="4" />
      <ellipse rx="10" ry="4" transform="rotate(60)" />
      <ellipse rx="10" ry="4" transform="rotate(120)" />
    </svg>
  );
}

function NextMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <circle cx="12" cy="12" r="11" fill="#fff" />
      <path d="M9 16.5V7.5l7.5 10M15 7.5v5.5" stroke="#000" strokeWidth="1.6" fill="none" />
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

function TailwindMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="#38BDF8">
      <path d="M12 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.31.74 1.91 1.35.98 1 2.12 2.15 4.59 2.15 2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C15.61 7.15 14.47 6 12 6zm-5 6c-2.67 0-4.33 1.33-5 4 1-1.33 2.17-1.83 3.5-1.5.76.19 1.3.74 1.91 1.35C8.39 16.85 9.53 18 12 18c2.67 0 4.33-1.33 5-4-1 1.33-2.17 1.83-3.5 1.5-.76-.19-1.3-.74-1.91-1.35C10.61 13.15 9.47 12 7 12z" />
    </svg>
  );
}

function TypeScriptMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4">
      <rect width="24" height="24" rx="3" fill="#3178C6" />
      <text
        x="20.5"
        y="20"
        textAnchor="end"
        fontSize="11"
        fontWeight="700"
        fontFamily="ui-sans-serif, system-ui"
        fill="#fff"
      >
        TS
      </text>
    </svg>
  );
}
