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

// Muted, desaturated palette — warm for the designer, cool for the thinker.
const WARM = "#E87A3E";
const COOL = "#94A3B8"; // slate-400
const HAIRLINE = "rgba(255,255,255,0.03)";

const FADE = "transition-all duration-500 ease-in-out";

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

  const triggerProps = (side: Side) => ({
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
      // The portrait is pinned to the bottom edge and bleeds off it. Below lg the
      // personas sit above it, so the section reserves the portrait's height.
      className="relative isolate min-h-[calc(100svh-4rem)] w-full overflow-hidden pb-[75vh] md:pb-[85vh] lg:flex lg:items-center lg:pb-0"
    >
      <h1 id="about-hero-title" className="sr-only">
        About Amir Alborz — Product Designer and System Thinker
      </h1>

      <ThemeBackdrops activeSide={activeSide} />

      <Portrait activeSide={activeSide} triggerProps={triggerProps} reduceMotion={reduceMotion} />

      {/* Personas flank the portrait: on top below lg, at face height on lg+ */}
      <div className="pointer-events-none relative z-30 mx-auto grid w-full max-w-7xl grid-cols-2 gap-x-5 px-6 pt-6 lg:-mt-[12vh] lg:grid-cols-[1fr_450px_1fr] lg:gap-x-10 lg:pt-0">
        <motion.div {...rise(0.2, reduceMotion)} className="pointer-events-auto lg:col-start-1">
          <Persona side="left" activeSide={activeSide} {...triggerProps("left")} />
        </motion.div>
        <motion.div {...rise(0.3, reduceMotion)} className="pointer-events-auto lg:col-start-3">
          <Persona side="right" activeSide={activeSide} {...triggerProps("right")} />
        </motion.div>
      </div>
    </section>
  );
}

type TriggerProps = {
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  onFocus: (event: FocusEvent<HTMLElement>) => void;
  onBlur: () => void;
  onClick: () => void;
};

function Persona({
  side,
  activeSide,
  ...handlers
}: { side: Side; activeSide: Side | null } & TriggerProps) {
  const { title, body } = PERSONAS[side];
  const isActive = activeSide === side;
  const isDimmed = activeSide !== null && !isActive;
  const isLeft = side === "left";

  return (
    <div
      tabIndex={0}
      {...handlers}
      className={cn(
        "cursor-default rounded-2xl outline-none select-none focus-visible:ring-2 focus-visible:ring-white/30 focus-visible:ring-offset-8 focus-visible:ring-offset-background motion-reduce:transform-none",
        FADE,
        // Each persona hugs its own outer edge, on mobile and desktop alike.
        isLeft ? "text-left" : "text-right",
        isDimmed && "opacity-20",
        isActive && (isLeft ? "translate-x-2" : "-translate-x-2"),
      )}
    >
      <h2 className="text-[clamp(1.75rem,9vw,3rem)] leading-[0.92] font-bold tracking-tighter text-white lg:text-[clamp(2.75rem,4.6vw,4.75rem)]">
        {title.map((line, i) => (
          <span
            key={line}
            className={cn("block", FADE)}
            style={i === 1 && isActive ? { color: WARM } : undefined}
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

/** Full-bleed thematic textures behind everything, one per half of the hero. */
function ThemeBackdrops({ activeSide }: { activeSide: Side | null }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
      {/* Designer: a Figma-style layout grid */}
      <div
        className={cn(
          "absolute inset-y-0 left-0 w-1/2",
          FADE,
          activeSide === "left" ? "opacity-100" : "opacity-0",
        )}
        style={{
          backgroundImage: `linear-gradient(${HAIRLINE} 1px, transparent 1px), linear-gradient(90deg, ${HAIRLINE} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          maskImage: "linear-gradient(to right, #000 40%, transparent)",
        }}
      />
      {/* Thinker: an abstract node pipeline */}
      <svg
        className={cn(
          "absolute inset-y-0 right-0 h-full w-1/2",
          FADE,
          activeSide === "right" ? "opacity-100" : "opacity-0",
        )}
        style={{ maskImage: "linear-gradient(to left, #000 40%, transparent)" }}
      >
        <defs>
          <pattern id="about-pipeline" width="160" height="120" patternUnits="userSpaceOnUse">
            <path
              d="M0 30h50l20 20h50l20-20h20M70 50v40h60M30 30v60h40M130 90l30 30"
              fill="none"
              stroke={HAIRLINE}
              strokeWidth="1"
            />
            {[
              [50, 30],
              [70, 50],
              [120, 50],
              [30, 90],
              [70, 90],
              [130, 90],
            ].map(([cx, cy]) => (
              <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r="3" fill="none" stroke={HAIRLINE} />
            ))}
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#about-pipeline)" />
      </svg>
    </div>
  );
}

/*
 * Landmarks are placed in photo space. Each photo is 1:2 and fills the full
 * portrait height (the slot is always taller than wide), anchored on the
 * seam — so a box the height of the portrait, square and centred on the seam,
 * holds both photos exactly. Its 400×400 viewBox maps Right.jpg to x 0–200 and
 * Left.jpg to x 200–400, independent of the viewport.
 */
const LEFT_POINTS = {
  brow: [146, 133],
  eye: [167, 146],
  mouth: [169, 206],
  jaw: [146, 222],
} as const;

const RIGHT_POINTS = {
  bridge: [200, 146],
  eye: [228, 143],
  ear: [269, 167],
  shoulder: [292, 318],
} as const;

function Portrait({
  activeSide,
  triggerProps,
  reduceMotion,
}: {
  activeSide: Side | null;
  triggerProps: (side: Side) => TriggerProps;
  reduceMotion: boolean;
}) {
  const leftOn = activeSide === "left";
  const rightOn = activeSide === "right";

  return (
    <div className="absolute bottom-0 left-1/2 z-10 h-[75vh] w-full max-w-[450px] -translate-x-1/2 md:h-[85vh]">
      <motion.div {...rise(0, reduceMotion)} className="relative h-full w-full">
        {/* Photos and their tint layers. Solid to the bottom edge, no fade.
            `isolate` keeps their z-indices below the landmark layer. */}
        <div className="absolute inset-0 isolate">
          {/* The left half runs 0.5% past centre, under the right half, so
              sub-pixel rounding can never open a seam between them. */}
          <div className="absolute top-0 left-0 z-10 h-full w-[50.5%]">
            <Image
              src="/images/about/Right.jpg"
              alt="Amir Alborz"
              fill
              preload
              sizes="(min-width: 768px) 225px, 50vw"
              className="object-cover object-right-bottom"
            />
          </div>
          <div className="absolute top-0 right-0 z-10 h-full w-[50%]">
            <Image
              src="/images/about/Left.jpg"
              alt=""
              fill
              preload
              sizes="(min-width: 768px) 225px, 50vw"
              className="object-cover object-left-bottom"
            />
          </div>

          {/* Desaturated duotone on the active half, dim on the other */}
          <div
            aria-hidden
            className={cn(
              "absolute inset-y-0 left-0 z-10 w-1/2 bg-amber-700/20 mix-blend-color",
              FADE,
              leftOn ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "absolute inset-y-0 left-1/2 z-10 w-1/2 bg-slate-500/20 mix-blend-color",
              FADE,
              rightOn ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "absolute inset-y-0 left-0 z-10 w-1/2 bg-black/50",
              FADE,
              rightOn ? "opacity-100" : "opacity-0",
            )}
          />
          <div
            aria-hidden
            className={cn(
              "absolute inset-y-0 left-1/2 z-10 w-1/2 bg-black/50",
              FADE,
              leftOn ? "opacity-100" : "opacity-0",
            )}
          />
        </div>

        {/* Face landmarks, guide lines and spec labels, in photo space */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 aspect-square h-full -translate-x-1/2"
        >
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full overflow-visible">
            <g className={cn(FADE, leftOn ? "opacity-100" : "opacity-0")}>
              <Mesh
                points={LEFT_POINTS}
                edges={[
                  ["brow", "eye"],
                  ["eye", "mouth"],
                  ["mouth", "jaw"],
                  ["jaw", "brow"],
                ]}
                color={WARM}
              />
              {/* Labels tuck closer to the face on phones so they stay on screen */}
              <g className="md:hidden">
                <Guide from={LEFT_POINTS.brow} to={[132, 122]} />
                <Guide from={LEFT_POINTS.jaw} to={[132, 238]} />
              </g>
              <g className="max-md:hidden">
                <Guide from={LEFT_POINTS.brow} to={[112, 122]} />
                <Guide from={LEFT_POINTS.jaw} to={[112, 238]} />
              </g>
            </g>
            <g className={cn(FADE, rightOn ? "opacity-100" : "opacity-0")}>
              <Mesh
                points={RIGHT_POINTS}
                edges={[
                  ["bridge", "eye"],
                  ["eye", "ear"],
                  ["ear", "shoulder"],
                ]}
                color={COOL}
              />
              <g className="md:hidden">
                <Guide from={RIGHT_POINTS.ear} to={[268, 162]} />
                <Guide from={RIGHT_POINTS.shoulder} to={[256, 352]} />
              </g>
              <g className="max-md:hidden">
                <Guide from={RIGHT_POINTS.ear} to={[288, 162]} />
                <Guide from={RIGHT_POINTS.shoulder} to={[304, 352]} />
              </g>
            </g>
          </svg>

          <div className={cn("absolute inset-0", FADE, leftOn ? "opacity-100" : "opacity-0")}>
            <Label
              className="top-[30.5%] right-[67%] md:right-[72%]"
              color={WARM}
              parts={["24px", WARM]}
              sep=", "
            />
            <Label
              className="top-[59.5%] right-[67%] md:right-[72%]"
              color={WARM}
              parts={["r16", "8pt grid"]}
            />
          </div>
          <div className={cn("absolute inset-0", FADE, rightOn ? "opacity-100" : "opacity-0")}>
            <Label
              className="top-[40.5%] left-[67%] md:left-[72%]"
              color={COOL}
              parts={["iris", "0x2F"]}
            />
            <Label
              className="top-[88%] left-[64%] md:left-[76%]"
              color={COOL}
              parts={["render()"]}
            />
          </div>
        </div>

        {/* Invisible hit areas: one per half of the face */}
        {(["left", "right"] as const).map((side) => (
          <button
            key={side}
            type="button"
            aria-label={`Focus ${PERSONAS[side].title.join(" ")}`}
            aria-pressed={activeSide === side}
            {...triggerProps(side)}
            className={cn(
              "absolute inset-y-0 z-20 w-1/2 cursor-crosshair outline-none",
              side === "left" ? "left-0" : "right-0",
            )}
          />
        ))}
      </motion.div>
    </div>
  );
}

type Point = readonly [number, number];

function Mesh<K extends string>({
  points,
  edges,
  color,
}: {
  points: Record<K, Point>;
  edges: [K, K][];
  color: string;
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
          strokeWidth="0.6"
        />
      ))}
      {(Object.values(points) as Point[]).map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="3" fill="none" stroke={color} strokeOpacity="0.5" strokeWidth="0.6" />
          <circle cx={x} cy={y} r="1.2" fill={color} />
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
      strokeWidth="0.6"
      strokeDasharray="1.5 2"
    />
  );
}

/**
 * Spec label; `className` places it (its edge facing the face, vertical centre).
 * On phones each part gets its own line so the label stays narrow and on screen.
 */
function Label({
  className,
  color,
  parts,
  sep = " · ",
}: {
  className: string;
  color: string;
  parts: string[];
  sep?: string;
}) {
  return (
    <div
      className={cn(
        "absolute -translate-y-1/2 border border-zinc-800 bg-zinc-900/80 px-2 py-1 font-mono text-xs leading-tight whitespace-nowrap md:text-sm",
        className,
      )}
      style={{ color }}
    >
      {parts.map((part, i) => (
        <span key={part} className="max-md:block">
          {i > 0 && <span className="max-md:hidden">{sep}</span>}
          {part}
        </span>
      ))}
    </div>
  );
}
