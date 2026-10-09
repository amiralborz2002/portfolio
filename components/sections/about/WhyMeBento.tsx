"use client";

import {
  m,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
  type Variants,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple
const soft = { type: "spring", stiffness: 120, damping: 20, mass: 0.8 } as const;

/*
 * Desktop: 12 columns × 220px rows. Column edges land at different points on
 * every row (7, then 4, then 8) so no gutter runs the full height.
 *
 *   ┌──────────────────────┬────────────────┐
 *   │ 1 Business logic     │ 2 Battle-      │
 *   │   (7 × 2)            │   tested (5×2) │
 *   │                      │                │
 *   ├────────────┬─────────┴────────────────┤
 *   │ 3 Psych    │ 4 Bridging the gap       │
 *   │   (4)      │   (8)                    │
 *   ├────────────┴───────────┬──────────────┤
 *   │ 5 Stakeholder synergy  │ 6 AI-        │
 *   │   (8)                  │   augmented  │
 *   └────────────────────────┴──────────────┘
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

      <m.div
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        // 250px / 220px rows; a row grows only where a narrow card would
        // otherwise clip its copy (phones, tablets).
        className="grid auto-rows-[minmax(250px,auto)] grid-cols-1 gap-6 md:auto-rows-[minmax(220px,auto)] md:grid-cols-12"
      >
        <SpotlightCard className="md:col-span-7 md:row-span-2" reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col gap-4">
              <BusinessNetwork active={active} reduceMotion={reduceMotion} />
              <CardCopy
                className="max-w-md"
                title="Business Logic & Viability"
                body="I check if an idea survives contact with the budget and the market, not just Figma."
              />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard className="md:col-span-5 md:row-span-2" reduceMotion={reduceMotion}>
          {() => <ChaosToOrder reduceMotion={reduceMotion} />}
        </SpotlightCard>

        <SpotlightCard tilt className="md:col-span-4" reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col gap-4">
              <ConvergingWaves active={active} reduceMotion={reduceMotion} />
              <CardCopy
                className="mt-auto"
                title="Psychology & Behavior"
                body="I design for why people hesitate, not just what they click or skip."
              />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard className="md:col-span-8" reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col gap-5 md:flex-row md:items-center md:gap-8">
              <CardCopy
                className="md:max-w-sm"
                title="Bridging the Gap"
                body="I dig into different tech stacks, not to write code, but to know exactly what I am asking engineers to build."
              />
              <Terminal active={active} reduceMotion={reduceMotion} />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard className="md:col-span-8" reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col-reverse gap-4 lg:flex-row lg:items-center lg:gap-8">
              <CardCopy
                className="lg:max-w-xs"
                title="Keeping Everyone Aligned"
                body="Design, engineering, and business rarely agree. I am the one who catches the conflict before it reaches production."
              />
              <VennDiagram active={active} reduceMotion={reduceMotion} />
            </div>
          )}
        </SpotlightCard>

        <SpotlightCard className="md:col-span-4 md:row-span-1" reduceMotion={reduceMotion}>
          {(active) => (
            <div className="flex h-full flex-col gap-4">
              <AiSpark active={active} reduceMotion={reduceMotion} />
              <CardCopy
                className="mt-auto"
                title="Works with AI, Not Just Around It"
                body="I use AI to test five directions before lunch, then choose the one that solves it."
              />
            </div>
          )}
        </SpotlightCard>
      </m.div>
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
  const rotateY = useSpring(useTransform(relX, [0, 1], [-10, 10]), tiltSpring);
  const rotateX = useSpring(useTransform(relY, [0, 1], [8, -8]), tiltSpring);

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
    <m.div
      variants={card}
      className={cn("relative", className)}
      style={tilting ? { perspective: 900 } : undefined}
    >
      <m.div
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
        <m.span
          aria-hidden
          style={{ background: spotlight }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4, ease }}
          className="pointer-events-none absolute inset-0 -z-10"
        />
        <div className="relative h-full p-6">{children(active)}</div>
      </m.div>
    </m.div>
  );
}

function CardCopy({ title, body, className }: { title: string; body: string; className?: string }) {
  return (
    <div className={cn("shrink-0", className)}>
      <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{body}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Business Logic & Viability: variables settle into a network      */
/* ------------------------------------------------------------------ */

const HUB = { x: 200, y: 120 };
const NET_RADIUS = 92;
const HEARTBEAT_S = 1.6; // one lub-dub per cycle

// Each variable has a loose resting spot and a balanced spot on a ring around the hub.
const VARIABLES = [
  { label: "Strategy", angle: -90, loose: { x: 236, y: 22 } },
  { label: "Execution", angle: -30, loose: { x: 318, y: 58 } },
  { label: "Market", angle: 30, loose: { x: 330, y: 186 } },
  { label: "Users", angle: 90, loose: { x: 160, y: 226 } },
  { label: "Insight", angle: 150, loose: { x: 70, y: 196 } },
  { label: "Influence", angle: 210, loose: { x: 96, y: 40 } },
].map((v) => {
  const rad = (v.angle * Math.PI) / 180;
  return {
    ...v,
    tight: {
      x: Math.round(HUB.x + NET_RADIUS * Math.cos(rad)),
      y: Math.round(HUB.y + NET_RADIUS * Math.sin(rad)),
    },
  };
});

function BusinessNetwork({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  const move = reduceMotion ? { duration: 0 } : soft;
  const at = (i: number) => (active ? VARIABLES[i].tight : VARIABLES[i].loose);

  return (
    <div aria-hidden className="relative min-h-40 flex-1">
      <svg viewBox="0 0 400 250" className="absolute inset-0 size-full overflow-visible">
        <defs>
          <radialGradient id="hub-glow">
            <stop offset="0%" stopColor="rgb(249 115 22)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Ring links: neighbouring variables connect once they are in balance */}
        {VARIABLES.map((_, i) => {
          const a = at(i);
          const b = at((i + 1) % VARIABLES.length);
          return (
            <m.line
              key={`ring-${i}`}
              initial={false}
              animate={{ x1: a.x, y1: a.y, x2: b.x, y2: b.y, opacity: active ? 0.45 : 0 }}
              transition={move}
              stroke="rgb(249 115 22)"
              strokeWidth="1"
            />
          );
        })}

        {/* Spokes: every variable stays tied to the product at the centre */}
        {VARIABLES.map((_, i) => {
          const p = at(i);
          return (
            <m.line
              key={`spoke-${i}`}
              x1={HUB.x}
              y1={HUB.y}
              initial={false}
              animate={{ x2: p.x, y2: p.y, opacity: active ? 0.6 : 0.18 }}
              transition={move}
              stroke={active ? "rgb(249 115 22)" : "white"}
              strokeWidth="1"
              strokeDasharray={active ? "0" : "3 5"}
            />
          );
        })}

        {/* Signals travelling out along the spokes while in balance */}
        {active &&
          !reduceMotion &&
          VARIABLES.map((v, i) => (
            <m.circle
              key={`pulse-${v.label}`}
              r="2.5"
              fill="rgb(253 186 116)"
              initial={{ cx: HUB.x, cy: HUB.y, opacity: 0 }}
              animate={{ cx: [HUB.x, v.tight.x], cy: [HUB.y, v.tight.y], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, delay: 0.5 + i * 0.25, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
            />
          ))}

        {VARIABLES.map((v, i) => {
          const p = at(i);
          return (
            <m.g key={v.label} initial={false} animate={{ x: p.x, y: p.y }} transition={move}>
              <circle
                r="6"
                className={cn("transition-colors duration-500", active ? "fill-accent" : "fill-zinc-600")}
              />
              <text y="-12" textAnchor="middle" className="fill-zinc-500 font-mono text-[10px]">
                {v.label}
              </text>
            </m.g>
          );
        })}

        {/* Hub: a continuous heartbeat (double beat, glow swelling with it)
            plus a ring that ripples out on every beat */}
        <circle cx={HUB.x} cy={HUB.y} r="40" fill="url(#hub-glow)" />
        {!reduceMotion && (
          <m.circle
            cx={HUB.x}
            cy={HUB.y}
            r="14"
            fill="none"
            stroke="rgb(249 115 22)"
            animate={{ scale: [1, 2], opacity: [0.55, 0] }}
            transition={{ duration: HEARTBEAT_S, repeat: Infinity, ease: "easeOut" }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          />
        )}
        <m.circle
          cx={HUB.x}
          cy={HUB.y}
          r="11"
          className="fill-accent"
          animate={
            reduceMotion
              ? undefined
              : {
                  scale: [1, 1.22, 1, 1.12, 1],
                  filter: [
                    "drop-shadow(0 0 3px rgb(249 115 22 / 0.5))",
                    "drop-shadow(0 0 14px rgb(249 115 22 / 0.95))",
                    "drop-shadow(0 0 5px rgb(249 115 22 / 0.6))",
                    "drop-shadow(0 0 10px rgb(249 115 22 / 0.8))",
                    "drop-shadow(0 0 3px rgb(249 115 22 / 0.5))",
                  ],
                }
          }
          transition={{
            duration: HEARTBEAT_S,
            times: [0, 0.14, 0.3, 0.44, 1],
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Battle-Tested by Failure: drag from Chaos to Order               */
/* ------------------------------------------------------------------ */

const COLS = 6;
const ROWS = 4;
const THUMB = 20; // px, matches the size-5 thumb below

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

  const update = (next: number) => {
    setValue(next);
    target.set(next / 100);
  };

  // Pointer drag anywhere across the 48px-tall control, not just on the thumb.
  // Mobile browsers otherwise need a precise grab of a tiny thumb and tend to
  // treat the gesture as a page scroll.
  const fromPointer = (event: PointerEvent<HTMLInputElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left - THUMB / 2) / (rect.width - THUMB);
    update(Math.round(Math.min(Math.max(ratio, 0), 1) * 100));
  };

  const track = `linear-gradient(to right, rgb(249 115 22 / 0.6) ${value}%, rgb(255 255 255 / 0.1) ${value}%)`;

  return (
    <div className="flex h-full flex-col">
      <CardCopy
        title="Battle-Tested by Failure"
        body="I built and launched my own startup. It failed, but it taught me when to stop polishing and ship, and when good enough beats perfect."
      />

      <div aria-hidden className="relative my-4 min-h-32 flex-1">
        <svg viewBox="0 0 240 150" className="absolute inset-0 size-full">
          {DOTS.map((dot, i) => (
            <Dot key={i} dot={dot} order={order} />
          ))}
        </svg>
      </div>

      <div>
        <div className="flex justify-between font-mono text-[11px] tracking-wider uppercase">
          <span className={cn("transition-colors", value < 50 ? "text-white" : "text-zinc-500")}>Chaos</span>
          <span className={cn("transition-colors", value >= 50 ? "text-accent" : "text-zinc-500")}>Order</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          aria-label="Drag from chaos to order"
          onChange={(event) => update(Number(event.target.value))}
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            fromPointer(event);
          }}
          onPointerMove={(event) => {
            if (event.currentTarget.hasPointerCapture(event.pointerId)) fromPointer(event);
          }}
          style={{ "--track": track } as CSSProperties}
          className={cn(
            // Tall, transparent hit area; the visible track is drawn by the pseudo-elements.
            "block h-12 w-full cursor-grab touch-none appearance-none bg-transparent outline-none active:cursor-grabbing",
            "rounded-full focus-visible:ring-2 focus-visible:ring-accent/60",
            "[&::-webkit-slider-runnable-track]:h-1.5 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-[image:var(--track)]",
            "[&::-webkit-slider-thumb]:-mt-[7px] [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-zinc-950 [&::-webkit-slider-thumb]:bg-accent [&::-webkit-slider-thumb]:shadow-glow",
            "[&::-moz-range-track]:h-1.5 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-white/10",
            "[&::-moz-range-progress]:h-1.5 [&::-moz-range-progress]:rounded-full [&::-moz-range-progress]:bg-accent/60",
            "[&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-zinc-950 [&::-moz-range-thumb]:bg-accent",
          )}
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
  return <m.circle cx={cx} cy={cy} r={r} style={{ fill, opacity }} />;
}

/* ------------------------------------------------------------------ */
/* 3. Psychology & Behavior: drifting waves converge and pulse          */
/* ------------------------------------------------------------------ */

const WAVELENGTH = 80;

/** A sine-like wave from quadratic half-waves; identical structure for any amp/phase, so it morphs. */
function wavePath(amp: number, phase: number, mid = 50) {
  let x = -2 * WAVELENGTH + phase;
  let d = `M ${x} ${mid}`;
  for (let i = 0; i < 12; i++) {
    const dir = i % 2 === 0 ? -1 : 1;
    d += ` Q ${x + WAVELENGTH / 4} ${mid + dir * amp * 2} ${x + WAVELENGTH / 2} ${mid}`;
    x += WAVELENGTH / 2;
  }
  return d;
}

const WAVES = [
  { rest: { amp: 16, phase: 0 }, focus: { amp: 13, phase: 0 }, stroke: "rgb(249 115 22)" },
  { rest: { amp: 9, phase: 27 }, focus: { amp: 13, phase: 4 }, stroke: "rgb(253 186 116)" },
  { rest: { amp: 21, phase: 53 }, focus: { amp: 13, phase: 8 }, stroke: "rgb(255 255 255)" },
] as const;

function ConvergingWaves({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  return (
    <div aria-hidden className="relative h-16 shrink-0 overflow-hidden">
      <svg viewBox="0 0 240 100" preserveAspectRatio="none" className="absolute inset-0 size-full">
        {/* Continuous drift by exactly one wavelength, so the loop is seamless */}
        <m.g
          animate={reduceMotion ? undefined : { x: [0, -WAVELENGTH] }}
          transition={{ duration: active ? 2.4 : 5, repeat: Infinity, ease: "linear" }}
        >
          {WAVES.map((wave, i) => {
            const shape = active ? wave.focus : wave.rest;
            return (
              <m.path
                key={i}
                initial={false}
                animate={{
                  d: wavePath(shape.amp, shape.phase),
                  strokeOpacity: active ? [0.55, 1, 0.55] : 0.3,
                }}
                transition={{
                  d: reduceMotion ? { duration: 0 } : { duration: 0.9, ease },
                  strokeOpacity: active
                    ? { duration: 1.6, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }
                    : { duration: 0.4 },
                }}
                fill="none"
                stroke={wave.stroke}
                strokeWidth="2"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </m.g>
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Bridging the Gap: a calm, collaborative terminal                  */
/* ------------------------------------------------------------------ */

const TERMINAL_LINES = [
  { prompt: ">", text: "Understanding system constraints...", tone: "text-zinc-200" },
  { prompt: ">", text: "Listening to the engineering team...", tone: "text-zinc-400" },
  { prompt: "✓", text: "Feasible architecture, built together", tone: "text-emerald-400" },
] as const;

const TOTAL_CHARS = TERMINAL_LINES.reduce((sum, line) => sum + line.text.length, 0);
// Character index at which each line starts typing.
const LINE_STARTS = TERMINAL_LINES.map((_, i) =>
  TERMINAL_LINES.slice(0, i).reduce((sum, line) => sum + line.text.length, 0),
);
const TYPE_MS = 38; // unhurried

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
    <div
      aria-hidden
      className="min-w-0 flex-1 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-zinc-950/70 font-mono text-xs leading-5"
    >
      <div className="flex gap-1.5 border-b border-white/5 px-3 py-2">
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
        <span className="size-2 rounded-full bg-white/15" />
      </div>
      <div className="h-[76px] px-3 py-2">
        {rows.map((row, i) => {
          const visible = row.shown > 0 || i === cursorRow;
          if (!visible) return null;
          return (
            <div key={i} className="flex gap-2 truncate whitespace-pre">
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
    <m.span
      className="ml-px inline-block h-3.5 w-1.5 translate-y-0.5 bg-accent"
      animate={{ opacity: [1, 1, 0, 0] }}
      transition={{ duration: 1.1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
    />
  );
}

/* ------------------------------------------------------------------ */
/* 5. Stakeholder Synergy: three circles, glowing shared centre          */
/* ------------------------------------------------------------------ */

const VENN = [
  // Labels sit in each circle's outer lobe, which stays exclusive in both states.
  { label: "Business", rest: { cx: 124, cy: 86 }, focus: { cx: 140, cy: 96 }, labelAt: { x: 104, y: 78 } },
  { label: "Tech", rest: { cx: 236, cy: 86 }, focus: { cx: 220, cy: 96 }, labelAt: { x: 259, y: 76 } },
  { label: "Design", rest: { cx: 180, cy: 180 }, focus: { cx: 180, cy: 165 }, labelAt: { x: 180, y: 226 } },
] as const;
const VENN_R = 78;
const VENN_CENTER = { x: 180, y: 119 }; // centroid of the focused circles

function VennDiagram({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  const move = reduceMotion ? { duration: 0 } : soft;

  return (
    // The viewBox leaves ~20 units of air around the circles' widest (resting)
    // extent, and the SVG letterboxes inside its box, so the diagram stays
    // centred with room to breathe at any card size.
    <div aria-hidden className="relative h-56 w-full shrink-0 lg:h-full lg:flex-1">
      <svg viewBox="26 -12 308 290" className="absolute inset-0 size-full">
        <defs>
          <radialGradient id="venn-core">
            <stop offset="0%" stopColor="rgb(255 237 213)" stopOpacity="1" />
            <stop offset="35%" stopColor="rgb(249 115 22)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="rgb(249 115 22)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Additive fills: overlaps brighten on their own, the triple overlap most */}
        <g style={{ mixBlendMode: "screen" }}>
          {VENN.map((c) => (
            <m.circle
              key={c.label}
              r={VENN_R}
              initial={false}
              animate={{
                ...(active ? c.focus : c.rest),
                fillOpacity: active ? 0.16 : 0.05,
                strokeOpacity: active ? 0.55 : 0.2,
              }}
              transition={move}
              fill="rgb(249 115 22)"
              stroke="white"
              strokeWidth="1"
            />
          ))}
        </g>

        <m.circle
          cx={VENN_CENTER.x}
          cy={VENN_CENTER.y}
          r="34"
          fill="url(#venn-core)"
          initial={false}
          animate={
            active
              ? { opacity: reduceMotion ? 1 : [0.75, 1, 0.75], scale: reduceMotion ? 1 : [1, 1.12, 1] }
              : { opacity: 0, scale: 0.6 }
          }
          transition={active ? { duration: 2, repeat: Infinity, ease: "easeInOut" } : { duration: 0.4 }}
          style={{ transformBox: "fill-box", transformOrigin: "center", filter: "blur(2px)" }}
        />

        {VENN.map((c) => (
          <text
            key={c.label}
            x={c.labelAt.x}
            y={c.labelAt.y}
            textAnchor="middle"
            className={cn(
              "font-mono text-[13px] tracking-normal uppercase transition-colors duration-500",
              active ? "fill-white" : "fill-zinc-400",
            )}
          >
            {c.label}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. AI-Augmented: pulsing spark, data radiating outward on hover      */
/* ------------------------------------------------------------------ */

const SPARK_C = { x: 160, y: 32 }; // viewBox is 320 × 64
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const rad = ((i * 30 + 15) * Math.PI) / 180;
  // Elliptical spread: the strip is wide and short.
  const at = (t: number) => ({ x: SPARK_C.x + Math.cos(rad) * 150 * t, y: SPARK_C.y + Math.sin(rad) * 40 * t });
  return { from: at(0.22), to: at(0.62), end: at(1) };
});

function AiSpark({ active, reduceMotion }: { active: boolean; reduceMotion: boolean }) {
  const radiate = active && !reduceMotion;

  return (
    <div aria-hidden className="relative h-12 shrink-0">
      <svg viewBox="0 0 320 64" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full overflow-visible">
        {RAYS.map((ray, i) => (
          <m.line
            key={`ray-${i}`}
            x1={ray.from.x}
            y1={ray.from.y}
            x2={ray.to.x}
            y2={ray.to.y}
            stroke="rgb(249 115 22)"
            strokeWidth="1"
            strokeLinecap="round"
            initial={false}
            animate={
              radiate
                ? { pathLength: [0, 1, 1], opacity: [0, 0.7, 0] }
                : { pathLength: active ? 1 : 0, opacity: active ? 0.5 : 0 }
            }
            transition={
              radiate
                ? { duration: 1.6, delay: (i % 4) * 0.2, repeat: Infinity, ease: "easeOut" }
                : { duration: 0.3 }
            }
          />
        ))}
        {radiate &&
          RAYS.map((ray, i) => (
            <m.circle
              key={`particle-${i}`}
              r="1.6"
              fill="rgb(253 186 116)"
              initial={{ cx: ray.from.x, cy: ray.from.y, opacity: 0 }}
              animate={{ cx: [ray.from.x, ray.end.x], cy: [ray.from.y, ray.end.y], opacity: [0, 1, 0] }}
              transition={{ duration: 1.8, delay: 0.3 + (i % 6) * 0.25, repeat: Infinity, ease: "easeOut" }}
            />
          ))}
      </svg>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        {/* Soft halo that breathes continuously and swells on hover */}
        <m.span
          className="absolute inset-0 -m-3 rounded-full bg-accent blur-xl"
          animate={
            reduceMotion
              ? { opacity: active ? 0.5 : 0.25 }
              : { opacity: active ? [0.45, 0.8, 0.45] : [0.18, 0.35, 0.18], scale: active ? [1, 1.25, 1] : [1, 1.1, 1] }
          }
          transition={{ duration: active ? 1.6 : 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <m.span
          className="relative flex size-9 items-center justify-center rounded-full border border-accent/40 bg-zinc-950/80"
          animate={reduceMotion ? undefined : { scale: active ? [1, 1.08, 1] : [1, 1.03, 1] }}
          transition={{ duration: active ? 1.6 : 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <Sparkles className="size-4.5 text-accent" strokeWidth={1.75} />
        </m.span>
      </div>
    </div>
  );
}
