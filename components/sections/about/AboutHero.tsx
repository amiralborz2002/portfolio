"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState, type FocusEvent } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

type Side = "left" | "right";

const PERSONAS = {
  left: {
    title: ["Product", "Designer"],
    body: "Crafting intuitive, user-centric interfaces and seamless digital experiences.",
  },
  right: {
    title: ["System", "Thinker"],
    body: "Architecting scalable logic, bridging business goals with technical constraints.",
  },
} as const satisfies Record<Side, { title: readonly string[]; body: string }>;

// Mobile intro: left → right → rest, once, when the hero first scrolls into view.
const DEMO_STEP_MS = 800;

/** Shared entrance: fade + rise, or fade only when motion is reduced. */
function rise(delay: number, reduceMotion: boolean) {
  return {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  };
}

/** Touch-first devices get tap-to-toggle; hover-capable ones use enter/leave. */
function canHover() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
}

export function AboutHero() {
  const reduceMotion = !!useReducedMotion();
  const [activeSide, setActiveSide] = useState<Side | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const demoTimers = useRef<number[]>([]);

  const stopDemo = () => {
    demoTimers.current.forEach(window.clearTimeout);
    demoTimers.current = [];
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || canHover()) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setActiveSide("left");
        demoTimers.current = [
          window.setTimeout(() => setActiveSide("right"), DEMO_STEP_MS),
          window.setTimeout(() => setActiveSide(null), DEMO_STEP_MS * 2),
        ];
      },
      { threshold: 0.5 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      stopDemo();
    };
  }, []);

  const activate = (side: Side | null) => {
    stopDemo();
    setActiveSide(side);
  };

  const toggle = (side: Side) => {
    if (canHover()) return; // hover already handles it; a click must not undo it
    activate(activeSide === side ? null : side);
  };

  const personaProps = (side: Side) => ({
    side,
    activeSide,
    onMouseEnter: () => activate(side),
    onMouseLeave: () => activate(null),
    // Taps also focus; only keyboard focus should drive the effect.
    onFocus: (event: FocusEvent<HTMLElement>) => {
      if (event.currentTarget.matches(":focus-visible")) activate(side);
    },
    onBlur: () => activate(null),
    onClick: () => toggle(side),
  });

  return (
    <section
      ref={sectionRef}
      aria-labelledby="about-hero-title"
      // Below lg: both personas side by side on top, portrait centred beneath,
      // so the whole split persona reads in one screen. lg+: the 3-column stage.
      className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-6xl grid-cols-2 content-center items-start gap-x-5 gap-y-10 px-6 pt-6 pb-12 lg:min-h-[90vh] lg:grid-cols-[1fr_auto_1fr] lg:content-normal lg:items-center lg:gap-16 lg:py-16"
    >
      <h1 id="about-hero-title" className="sr-only">
        About Amir Alborz — Product Designer and System Thinker
      </h1>

      <motion.div {...rise(0.2, reduceMotion)} className="col-start-1 row-start-1">
        <Persona {...personaProps("left")} />
      </motion.div>

      <motion.div
        {...rise(0, reduceMotion)}
        className="col-span-2 row-start-2 justify-self-center lg:col-span-1 lg:col-start-2 lg:row-start-1"
      >
        <Portrait activeSide={activeSide} onToggle={toggle} />
      </motion.div>

      <motion.div {...rise(0.3, reduceMotion)} className="col-start-2 row-start-1 lg:col-start-3">
        <Persona {...personaProps("right")} />
      </motion.div>
    </section>
  );
}

type PersonaProps = {
  side: Side;
  activeSide: Side | null;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: () => void;
  onClick: () => void;
};

function Persona({ side, activeSide, ...handlers }: PersonaProps) {
  const { title, body } = PERSONAS[side];
  const isActive = activeSide === side;
  const isDimmed = activeSide !== null && !isActive;
  const isLeft = side === "left";

  return (
    <div
      tabIndex={0}
      {...handlers}
      className={cn(
        "cursor-default rounded-2xl outline-none transition-[opacity,transform] duration-500 ease-apple select-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-8 focus-visible:ring-offset-background motion-reduce:transform-none",
        // Each persona hugs its own outer edge, on mobile and desktop alike.
        isLeft ? "text-left" : "text-right",
        isDimmed && "opacity-30",
        isActive && (isLeft ? "translate-x-2" : "-translate-x-2"),
      )}
    >
      <h2 className="text-[clamp(1.75rem,9vw,3rem)] leading-[0.92] font-bold tracking-tighter text-white lg:text-[clamp(2.75rem,4.6vw,4.75rem)]">
        {title.map((line, i) => (
          <span
            key={line}
            className={cn(
              "block transition-colors duration-500",
              i === 1 && isActive && (isLeft ? "text-amber-400" : "text-slate-300"),
            )}
          >
            {line}
          </span>
        ))}
      </h2>
      <p
        className={cn(
          "mt-3 max-w-xs text-sm text-balance text-zinc-400 sm:text-base lg:mt-6 lg:text-lg",
          isLeft ? "mr-auto" : "ml-auto",
        )}
      >
        {body}
      </p>
    </div>
  );
}

/*
 * Landmarks live in a 320×400 viewBox — the portrait's md size. The container
 * is always 4:5, so the same coordinates line up at every breakpoint.
 * Each photo half is 1:2 and `object-cover`ed into a 2:5 slot anchored on the
 * seam, so a photo point at (fx, fy) lands at x = 160 ∓ 200·(1 − fx), y = 400·fy.
 */
const LEFT_POINTS = {
  brow: [106, 133],
  eye: [127, 146],
  mouth: [129, 206],
  jaw: [106, 222],
} as const;

const RIGHT_POINTS = {
  bridge: [160, 146],
  eye: [188, 143],
  ear: [229, 167],
  shoulder: [288, 300],
} as const;

const LANDMARK_FADE = "transition-opacity duration-500 ease-apple";

function Portrait({
  activeSide,
  onToggle,
}: {
  activeSide: Side | null;
  onToggle: (side: Side) => void;
}) {
  const leftOn = activeSide === "left";
  const rightOn = activeSide === "right";

  return (
    // Outer frame is unclipped so guide lines and labels can reach past the photo.
    <div className="relative h-80 w-64 md:h-[400px] md:w-80">
      <div className="group relative mx-auto flex h-full w-full overflow-hidden rounded-2xl bg-black shadow-ambient-lg">
        {/* Base photos — each half keeps the face seam at the centre line */}
        <button
          type="button"
          aria-label="Focus Product Designer"
          aria-pressed={leftOn}
          onClick={() => onToggle("left")}
          className="relative h-full w-1/2 cursor-default"
        >
          <Image
            src="/images/about/Right.jpg"
            alt=""
            fill
            preload
            sizes="(min-width: 768px) 160px, 128px"
            className="object-cover object-right"
          />
        </button>
        <button
          type="button"
          aria-label="Focus System Thinker"
          aria-pressed={rightOn}
          onClick={() => onToggle("right")}
          className="relative h-full w-1/2 cursor-default"
        >
          <Image
            src="/images/about/Left.jpg"
            alt=""
            fill
            preload
            sizes="(min-width: 768px) 160px, 128px"
            className="object-cover object-left"
          />
        </button>
        <span className="sr-only">Portrait of Amir Alborz</span>

        {/* Layer 1 — background motifs, screened onto the dark backdrop and
            masked away from the face so it always stays clean */}
        <DotGrid
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/2 mix-blend-screen",
            LANDMARK_FADE,
            leftOn ? "opacity-60" : "opacity-10",
          )}
        />
        <CircuitNodes
          className={cn(
            "pointer-events-none absolute inset-y-0 right-0 w-1/2 mix-blend-screen",
            LANDMARK_FADE,
            rightOn ? "opacity-60" : "opacity-10",
          )}
        />

        {/* Layer 2 — duotone tint on the active half, dim on the other */}
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-amber-500/25 mix-blend-color",
            LANDMARK_FADE,
            leftOn ? "opacity-100" : "opacity-20",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-1/2 w-1/2 bg-slate-400/20 mix-blend-color",
            LANDMARK_FADE,
            rightOn ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-black/50",
            LANDMARK_FADE,
            rightOn ? "opacity-100" : "opacity-0",
          )}
        />
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-y-0 left-1/2 w-1/2 bg-black/50",
            LANDMARK_FADE,
            leftOn ? "opacity-100" : "opacity-0",
          )}
        />
      </div>

      {/* Layer 3 — face landmarks, guide lines and spec labels */}
      <svg
        aria-hidden
        viewBox="0 0 320 400"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
      >
        <g className={cn(LANDMARK_FADE, leftOn ? "opacity-100" : "opacity-0")}>
          <Mesh
            points={LEFT_POINTS}
            edges={[
              ["brow", "eye"],
              ["eye", "mouth"],
              ["mouth", "jaw"],
              ["jaw", "brow"],
            ]}
            dot="#fbbf24"
          />
          <Guide from={LEFT_POINTS.brow} to={[-2, 128]} />
          <Guide from={LEFT_POINTS.jaw} to={[-2, 240]} />
        </g>
        <g className={cn(LANDMARK_FADE, rightOn ? "opacity-100" : "opacity-0")}>
          <Mesh
            points={RIGHT_POINTS}
            edges={[
              ["bridge", "eye"],
              ["eye", "ear"],
              ["ear", "shoulder"],
            ]}
            dot="#cbd5e1"
          />
          <Guide from={RIGHT_POINTS.ear} to={[322, 168]} />
          <Guide from={RIGHT_POINTS.shoulder} to={[322, 352]} />
        </g>
      </svg>

      <div aria-hidden className={cn("pointer-events-none absolute inset-0 z-20", LANDMARK_FADE, leftOn ? "opacity-100" : "opacity-0")}>
        <Label className="top-[30%] -left-8 text-amber-400">24px, #F59E0B</Label>
        <Label className="top-[58%] -left-8 text-amber-400">r16 · 8pt grid</Label>
      </div>
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 z-20", LANDMARK_FADE, rightOn ? "opacity-100" : "opacity-0")}>
        <Label className="top-[40%] -right-8 text-slate-300">iris · 0x2F</Label>
        <Label className="top-[86%] -right-8 text-slate-300">render()</Label>
      </div>
    </div>
  );
}

type Point = readonly [number, number];

function Mesh<K extends string>({
  points,
  edges,
  dot,
}: {
  points: Record<K, Point>;
  edges: [K, K][];
  dot: string;
}) {
  return (
    <>
      {edges.map(([a, b]) => (
        <line
          key={`${a}-${b}`}
          x1={points[a][0]}
          y1={points[a][1]}
          x2={points[b][0]}
          y2={points[b][1]}
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
        />
      ))}
      {(Object.values(points) as Point[]).map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="5" fill="none" stroke={dot} strokeOpacity="0.5" strokeWidth="1" />
          <circle cx={x} cy={y} r="2" fill={dot} />
        </g>
      ))}
    </>
  );
}

function Guide({ from, to }: { from: Point; to: Point }) {
  return (
    <line
      x1={from[0]}
      y1={from[1]}
      x2={to[0]}
      y2={to[1]}
      stroke="rgba(255,255,255,0.4)"
      strokeWidth="1"
      strokeDasharray="2 3"
    />
  );
}

function Label({ className, children }: { className: string; children: string }) {
  return (
    <div
      className={cn(
        "absolute border border-zinc-800 bg-zinc-900/80 px-1 font-mono text-[10px] leading-4 whitespace-nowrap",
        className,
      )}
    >
      {children}
    </div>
  );
}

function DotGrid({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      style={{ maskImage: "linear-gradient(to right, #000 15%, transparent 70%)" }}
    >
      <defs>
        <pattern id="about-dot-grid" width="12" height="12" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="1" fill="#fbbf24" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#about-dot-grid)" />
    </svg>
  );
}

function CircuitNodes({ className }: { className: string }) {
  return (
    <svg
      aria-hidden
      className={className}
      style={{ maskImage: "linear-gradient(to left, #000 15%, transparent 70%)" }}
    >
      <defs>
        <pattern id="about-circuit" width="48" height="48" patternUnits="userSpaceOnUse">
          <path
            d="M0 12h16l8 8v28M24 20h24M36 0v8l-6 6M8 36h10"
            fill="none"
            stroke="#cbd5e1"
            strokeWidth="0.75"
          />
          <circle cx="16" cy="12" r="1.75" fill="#cbd5e1" />
          <circle cx="24" cy="20" r="1.75" fill="#cbd5e1" />
          <circle cx="30" cy="14" r="1.75" fill="#cbd5e1" />
          <circle cx="18" cy="36" r="1.75" fill="#cbd5e1" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#about-circuit)" />
    </svg>
  );
}
