"use client";

import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple
const snappy = { type: "spring", stiffness: 260, damping: 26 } as const;

/*
 * Desktop (3 cols × 220px rows), every cell filled:
 *
 *   ┌───────────────────┬─────────┐
 *   │ 1 Business logic  │ 2       │
 *   ├─────────┬─────────┤ Failure │
 *   │ 3 BE    │ 4 Dev   │ (tall)  │
 *   ├─────────┴─────────┼─────────┤
 *   │ 5 Storytelling    │ 6 Align │
 *   └───────────────────┴─────────┘
 */
export function WhyMeBento() {
  const reduceMotion = !!useReducedMotion();

  const grid: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  };

  return (
    <section aria-labelledby="why-me-title">
      <div className="mb-10 md:mb-12">
        <p className="eyebrow">Why me</p>
        <h2 id="why-me-title" className="mt-3 text-display-lg text-white">
          The Differentiators
        </h2>
      </div>

      <motion.div
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        // 220px rows; a row only grows where narrow cards wrap their copy
        // (tablets, small laptops) instead of clipping it.
        className="grid auto-rows-[minmax(220px,auto)] grid-cols-1 gap-4 md:grid-cols-3 md:gap-5"
      >
        <SpotlightCard className="md:col-span-2" reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col gap-6 md:flex-row md:items-end">
              <CardCopy
                className="md:max-w-xs"
                title="Business Logic First"
                body="I don't just design screens; I map out dynamic pricing, inventory calculations, and multi-channel flows."
              />
              <GrowthGraph active={active} reduceMotion={reduceMotion} />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard className="md:row-span-2" reduceMotion={reduceMotion}>
          {() => <ChaosToOrder reduceMotion={reduceMotion} />}
        </SpotlightCard>

        <SpotlightCard tilt reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col">
              <DecoyTiers active={active} />
              <CardCopy
                className="mt-auto"
                title="Behavioral Economics"
                body="Designing for actual human psychology, irrationalities, and behavioral loops."
              />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col">
              <Terminal active={active} reduceMotion={reduceMotion} />
              <CardCopy
                className="mt-auto pt-3"
                title="Fluent in Developer"
                body="From Python to Next.js constraints, I speak the language of your engineering team."
              />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard className="md:col-span-2" reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col gap-4 md:flex-row md:items-end">
              <CardCopy
                className="md:max-w-xs"
                title="Technical Storytelling"
                body="Translating complex physical and digital mechanisms into intuitive, scannable visual narratives."
              />
              <AssemblingCube active={active} reduceMotion={reduceMotion} />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col">
              <AlignmentNodes active={active} reduceMotion={reduceMotion} />
              <CardCopy
                className="mt-auto"
                title="Stakeholder Alignment"
                body="Getting founders, PMs, and engineers to agree on one plan, and keeping it that way."
              />
            </div>
          )}
        </SpotlightCard>
      </motion.div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Card shell: glass, cursor spotlight, optional 3D tilt               */
/* ------------------------------------------------------------------ */

/** Touch screens never hover, so their cards animate when scrolled into view instead. */
function useCanHover() {
  const [canHover, setCanHover] = useState(true);
  useEffect(() => {
    const query = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return canHover;
}

const follow = { stiffness: 300, damping: 30, mass: 0.5 };
const tiltSpring = { stiffness: 200, damping: 20, mass: 0.6 };

type SpotlightCardProps = {
  className?: string;
  tilt?: boolean;
  reduceMotion: boolean;
  children: (active: boolean) => ReactNode;
};

function SpotlightCard({ className, tilt = false, reduceMotion, children }: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const canHover = useCanHover();
  const inView = useInView(ref, { amount: 0.6 });
  const [hovered, setHovered] = useState(false);
  const active = canHover ? hovered : inView;

  // Cursor position in px, sprung so the glow glides rather than snaps.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const glowX = useSpring(mouseX, follow);
  const glowY = useSpring(mouseY, follow);
  const spotlight = useMotionTemplate`radial-gradient(380px circle at ${glowX}px ${glowY}px, rgb(249 115 22 / 0.16), transparent 65%)`;

  // Cursor position as 0..1 across the card, driving the optional tilt.
  const relX = useMotionValue(0.5);
  const relY = useMotionValue(0.5);
  const rotateY = useSpring(useTransform(relX, [0, 1], [-12, 12]), tiltSpring);
  const rotateX = useSpring(useTransform(relY, [0, 1], [10, -10]), tiltSpring);

  const track = (event: PointerEvent<HTMLDivElement>, jump = false) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (jump) {
      // Start the glow under the cursor instead of sweeping in from the last spot.
      glowX.jump(x);
      glowY.jump(y);
    }
    mouseX.set(x);
    mouseY.set(y);
    relX.set(x / rect.width);
    relY.set(y / rect.height);
  };

  const card: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.97 },
    show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease } },
  };

  const tilting = tilt && !reduceMotion;

  return (
    <motion.div
      variants={card}
      className={cn("relative", className)}
      style={tilting ? { perspective: 900 } : undefined}
    >
      <motion.div
        ref={ref}
        onPointerEnter={(event) => {
          if (event.pointerType === "touch") return;
          track(event, true);
          setHovered(true);
        }}
        onPointerMove={(event) => event.pointerType !== "touch" && track(event)}
        onPointerLeave={() => {
          setHovered(false);
          relX.set(0.5);
          relY.set(0.5);
        }}
        style={tilting ? { rotateX, rotateY, transformStyle: "preserve-3d" } : undefined}
        className={cn(
          "group relative isolate h-full overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-md",
          "transition-[border-color,background-color] duration-500 ease-apple hover:border-white/20 hover:bg-white/[0.07]",
        )}
      >
        {/* Lit top edge of the glass */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
        />
        <motion.span
          aria-hidden
          style={{ background: spotlight }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease }}
          className="pointer-events-none absolute inset-0 -z-10"
        />
        <div className="relative h-full p-6">{children(active)}</div>
      </motion.div>
    </motion.div>
  );
}

function CardCopy({ title, body, className }: { title: string; body: string; className?: string }) {
  return (
    <div className={className}>
      <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Business Logic First: flat line grows into an upward curve       */
/* ------------------------------------------------------------------ */

// Same command structure in both paths so Framer Motion can morph between them.
const FLAT = "M0 118 C 60 118, 100 118, 160 118 C 220 118, 260 118, 320 118 C 350 118, 380 118, 400 118";
const RISE = "M0 128 C 60 126, 100 110, 160 94 C 220 78, 260 58, 320 34 C 350 22, 380 14, 400 10";
const area = (line: string) => `${line} L400 160 L0 160 Z`;

function GrowthGraph({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  const transition = reduceMotion ? { duration: 0 } : { duration: 0.9, ease };

  return (
    <div aria-hidden className="relative h-28 min-w-0 flex-1 md:h-full">
      <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id="why-graph-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[40, 80, 120].map((y) => (
          <line
            key={y}
            x1="0"
            x2="400"
            y1={y}
            y2={y}
            stroke="white"
            strokeOpacity="0.06"
            strokeDasharray="4 6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <motion.path
          initial={false}
          animate={{ d: area(active ? RISE : FLAT), opacity: active ? 1 : 0.25 }}
          transition={transition}
          fill="url(#why-graph-fill)"
        />
        <motion.path
          initial={false}
          animate={{ d: active ? RISE : FLAT }}
          transition={transition}
          fill="none"
          stroke={active ? "rgb(249 115 22)" : "rgb(255 255 255 / 0.35)"}
          strokeWidth="2"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
          className="transition-[stroke] duration-500"
        />
      </svg>
      <motion.span
        initial={false}
        animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
        transition={{ duration: 0.5, delay: active ? 0.5 : 0, ease }}
        className="absolute top-0 left-0 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 font-mono text-[11px] text-accent"
      >
        margin ↑
      </motion.span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Battle-Tested by Failure: drag from Chaos to Order               */
/* ------------------------------------------------------------------ */

const COLS = 6;
const ROWS = 4;

// Deterministic scatter (same on server and client, so no hydration mismatch).
function seeded(seed: number) {
  const x = Math.sin(seed * 9301 + 49297) * 233280;
  return x - Math.floor(x);
}

const DOTS = Array.from({ length: COLS * ROWS }, (_, i) => ({
  chaos: { x: 14 + seeded(i + 1) * 212, y: 12 + seeded(i + 101) * 126, r: 2 + seeded(i + 201) * 3 },
  order: { x: 30 + (i % COLS) * 36, y: 22 + Math.floor(i / COLS) * 35 },
}));

function ChaosToOrder({ reduceMotion }: { reduceMotion: boolean }) {
  const [value, setValue] = useState(0);
  const target = useMotionValue(0);
  const order = useSpring(target, reduceMotion ? { stiffness: 1000, damping: 100 } : { stiffness: 120, damping: 18 });

  return (
    <div className="flex h-full flex-col">
      <CardCopy
        title="Battle-Tested by Failure"
        body="Real business acumen isn't learned in courses. Building and pivoting my own startups taught me how to balance pixel-perfection with time-to-market and harsh market realities."
      />

      <div aria-hidden className="relative my-4 min-h-0 flex-1">
        <svg viewBox="0 0 240 150" className="absolute inset-0 size-full">
          {DOTS.map((dot, i) => (
            <Dot key={i} dot={dot} order={order} />
          ))}
        </svg>
      </div>

      <div>
        <div className="mb-2 flex justify-between font-mono text-[11px] tracking-wider uppercase">
          <span className={cn("transition-colors", value < 50 ? "text-white" : "text-zinc-500")}>Chaos</span>
          <span className={cn("transition-colors", value >= 50 ? "text-accent" : "text-zinc-500")}>Order</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label="Drag from chaos to order"
          onChange={(event) => {
            const next = Number(event.target.value);
            setValue(next);
            target.set(next / 100);
          }}
          className={cn(
            "h-1.5 w-full cursor-grab appearance-none rounded-full bg-white/10 outline-none active:cursor-grabbing",
            "focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-zinc-950",
            "[&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-950 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-glow",
            "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-950 [&::-moz-range-thumb]:bg-accent",
          )}
          style={{
            background: `linear-gradient(to right, rgb(249 115 22 / 0.6) ${value}%, rgb(255 255 255 / 0.1) ${value}%)`,
          }}
        />
      </div>
    </div>
  );
}

function Dot({ dot, order }: { dot: (typeof DOTS)[number]; order: MotionValue<number> }) {
  const cx = useTransform(order, [0, 1], [dot.chaos.x, dot.order.x]);
  const cy = useTransform(order, [0, 1], [dot.chaos.y, dot.order.y]);
  const r = useTransform(order, [0, 1], [dot.chaos.r, 3.5]);
  const fill = useTransform(order, [0, 1], ["rgb(161 161 170)", "rgb(249 115 22)"]);
  const opacity = useTransform(order, [0, 1], [0.45, 1]);
  return <motion.circle cx={cx} cy={cy} r={r} style={{ fill, opacity }} />;
}

/* ------------------------------------------------------------------ */
/* 3. Behavioral Economics: decoy pricing tiers (card tilts in 3D)      */
/* ------------------------------------------------------------------ */

function DecoyTiers({ active }: { active: boolean }) {
  const tiers = [
    { label: "Basic", h: "h-8" },
    { label: "Pro", h: "h-14", pick: true },
    { label: "Max", h: "h-11" },
  ];

  return (
    // Lifted toward the viewer so it parallaxes against the tilting card.
    <div aria-hidden className="flex items-end gap-2" style={{ transform: "translateZ(40px)" }}>
      {tiers.map((tier) => (
        <div key={tier.label} className="flex flex-col items-center gap-1.5">
          <motion.div
            animate={tier.pick && active ? { y: -6 } : { y: 0 }}
            transition={snappy}
            className={cn(
              "w-10 rounded-lg border",
              tier.h,
              tier.pick
                ? "border-accent/50 bg-accent/20 shadow-glow"
                : "border-white/10 bg-white/[0.04]",
            )}
          />
          <span className={cn("font-mono text-[10px]", tier.pick ? "text-accent" : "text-zinc-500")}>
            {tier.label}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Fluent in Developer: terminal types a snippet on hover            */
/* ------------------------------------------------------------------ */

const TERMINAL_LINES = [
  { prompt: "$", text: "python pricing.py --channels 3", tone: "text-zinc-200" },
  { prompt: "$", text: "next build", tone: "text-zinc-200" },
  { prompt: "✓", text: "compiled · 0 errors", tone: "text-emerald-400" },
] as const;

const TOTAL_CHARS = TERMINAL_LINES.reduce((sum, line) => sum + line.text.length, 0);
// Character index at which each line starts typing.
const LINE_STARTS = TERMINAL_LINES.map((_, i) =>
  TERMINAL_LINES.slice(0, i).reduce((sum, line) => sum + line.text.length, 0),
);
const TYPE_MS = 28;

function Terminal({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  const [ticks, setTicks] = useState(0);

  useEffect(() => {
    if (!active || reduceMotion) return;
    const id = window.setInterval(() => {
      setTicks((n) => {
        if (n >= TOTAL_CHARS) window.clearInterval(id);
        return Math.min(n + 1, TOTAL_CHARS);
      });
    }, TYPE_MS);
    return () => {
      window.clearInterval(id);
      setTicks(0); // next hover types from scratch
    };
  }, [active, reduceMotion]);

  const typed = !active ? 0 : reduceMotion ? TOTAL_CHARS : ticks;

  // Reveal lines in order: each shows whatever part of the budget reaches it.
  const rows = TERMINAL_LINES.map((line, i) => ({
    ...line,
    shown: Math.max(0, Math.min(line.text.length, typed - LINE_STARTS[i])),
  }));
  // The cursor sits on the line currently being typed (or the first, when idle).
  const cursorRow = Math.max(0, rows.findIndex((row) => row.shown < row.text.length));
  const done = typed >= TOTAL_CHARS;

  return (
    <div aria-hidden className="shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70 font-mono text-[11px] leading-4">
      <div className="flex gap-1.5 border-b border-white/5 px-3 py-1.5">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
      </div>
      <div className="h-14 px-3 py-1">
        {rows.map((row, i) => {
          const visible = row.shown > 0 || i === cursorRow;
          if (!visible) return null;
          return (
            <div key={i} className="flex gap-2 whitespace-pre">
              <span className={row.prompt === "✓" ? "text-emerald-400" : "text-accent"}>{row.prompt}</span>
              <span className={row.tone}>
                {row.text.slice(0, row.shown)}
                {i === (done ? rows.length - 1 : cursorRow) && <Caret />}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Caret() {
  return (
    <motion.span
      className="ml-px inline-block h-3 w-1.5 translate-y-0.5 bg-accent"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 5. Technical Storytelling: scattered faces assemble into a cube      */
/* ------------------------------------------------------------------ */

const FACES = [
  {
    // top
    points: "100,50 143,75 100,100 57,75",
    fill: "rgb(249 115 22 / 0.85)",
    apart: { x: -78, y: -18, rotate: -28 },
  },
  {
    // left
    points: "57,75 100,100 100,150 57,125",
    fill: "rgb(249 115 22 / 0.35)",
    apart: { x: -34, y: 30, rotate: 18 },
  },
  {
    // right
    points: "143,75 100,100 100,150 143,125",
    fill: "rgb(255 255 255 / 0.12)",
    apart: { x: 70, y: 8, rotate: 34 },
  },
] as const;

function AssemblingCube({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  return (
    <div aria-hidden className="relative h-36 min-w-0 flex-1 md:h-full">
      <svg viewBox="0 0 200 180" className="absolute inset-0 size-full overflow-visible">
        <motion.ellipse
          cx="100"
          cy="160"
          rx="48"
          ry="8"
          fill="rgb(249 115 22)"
          initial={false}
          animate={{ opacity: active ? 0.25 : 0, scale: active ? 1 : 0.6 }}
          transition={{ duration: 0.6, ease }}
          style={{ filter: "blur(8px)" }}
        />
        {FACES.map((face, i) => (
          <motion.polygon
            key={face.points}
            points={face.points}
            fill={face.fill}
            stroke="rgb(255 255 255 / 0.25)"
            strokeWidth="1"
            strokeLinejoin="round"
            initial={false}
            animate={active ? { x: 0, y: 0, rotate: 0 } : face.apart}
            transition={reduceMotion ? { duration: 0 } : { ...snappy, delay: active ? i * 0.06 : 0 }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Stakeholder Alignment: misaligned nodes snap onto one line        */
/* ------------------------------------------------------------------ */

const NODES = [
  { x: 36, apart: -22, label: "Biz" },
  { x: 100, apart: 20, label: "Design" },
  { x: 164, apart: -8, label: "Eng" },
] as const;

function AlignmentNodes({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  const transition = reduceMotion ? { duration: 0 } : snappy;

  return (
    <svg aria-hidden viewBox="0 0 200 80" className="h-20 w-full max-w-[220px] overflow-visible">
      <motion.line
        x1="36"
        x2="164"
        y1="34"
        y2="34"
        stroke="rgb(249 115 22)"
        strokeWidth="1.5"
        initial={false}
        animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
        transition={reduceMotion ? { duration: 0 } : { duration: 0.5, delay: active ? 0.2 : 0, ease }}
      />
      {NODES.map((node) => (
        <motion.g
          key={node.label}
          initial={false}
          animate={{ y: active ? 0 : node.apart }}
          transition={transition}
        >
          <circle
            cx={node.x}
            cy="34"
            r="7"
            className={cn("transition-colors duration-500", active ? "fill-accent" : "fill-zinc-600")}
          />
          <text
            x={node.x}
            y="58"
            textAnchor="middle"
            className="fill-zinc-500 font-mono text-[10px]"
          >
            {node.label}
          </text>
        </motion.g>
      ))}
    </svg>
  );
}
