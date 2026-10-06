"use client";

import Link from "next/link";
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { Calculator, ChevronRight, Cog, Network, type LucideIcon } from "lucide-react";
import { useRef, type Ref } from "react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

type Milestone = {
  slug: string;
  title: string;
  tag: string;
  description: string;
  Icon: LucideIcon;
};

// Most recent first.
const MILESTONES: Milestone[] = [
  {
    slug: "karo-platform",
    title: "Karo Platform",
    tag: "Information Architecture",
    description:
      "Structured complex databases, categorized service trees, and designed technician profile logic for a seamless home appliance repair ecosystem.",
    Icon: Network,
  },
  {
    slug: "retail-architecture",
    title: "Retail Architecture",
    tag: "System Design & Business Logic",
    description:
      "Engineered a dynamic architecture for dynamic pricing, automated currency conversions, and multi-channel inventory calculations.",
    Icon: Calculator,
  },
  {
    slug: "physical-systems-analysis",
    title: "Physical Systems Analysis",
    tag: "Technical Storytelling",
    description:
      "Analyzed and visually broke down complex engineering mechanisms and infrastructure logic into digestible, user-centric flows.",
    Icon: Cog,
  },
];

/*
 * The orange fill and each node's "lit" state share one trigger line at 60% of
 * the viewport height, so a node lights up exactly as the fill reaches it, and
 * dims again when scrolling back up. The huge top margin keeps nodes that have
 * scrolled off the top counted as "passed" (lit).
 */
const TRIGGER = "100000px 0px -40% 0px";

export function ExperienceJourney() {
  const reduceMotion = !!useReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);

  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 60%", "end 60%"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const fill = reduceMotion ? scrollYProgress : smooth;

  return (
    <section
      id="journey"
      aria-labelledby="journey-title"
      className="mx-auto w-full max-w-6xl px-6"
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="eyebrow">Experience journey</p>
        <h2 id="journey-title" className="mt-3 text-display-lg">
          Selected work, from recent to roots.
        </h2>
        <p className="mt-4 text-base text-muted sm:text-lg">
          Each stop is a system untangled: data, logic and mechanics turned into flows people
          can actually use.
        </p>
      </div>

      <div className="relative mt-16 md:mt-20">
        <TimelineLine progress={fill} />

        <ol ref={listRef} className="relative flex flex-col gap-10 md:gap-16">
          {MILESTONES.map((m, i) => (
            <MilestoneRow
              key={m.slug}
              milestone={m}
              index={i}
              total={MILESTONES.length}
              reduceMotion={reduceMotion}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────────────── line ───────────────────────── */

// Mobile: line sits in the centre of the 2.5rem node column. Desktop: page centre.
const lineX = "left-5 md:left-1/2 -translate-x-1/2";

function TimelineLine({ progress }: { progress: MotionValue<number> }) {
  return (
    <div aria-hidden className={cn("pointer-events-none absolute inset-y-0 w-px", lineX)}>
      <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/10 to-white/0" />
      <motion.div
        style={{ scaleY: progress }}
        className="absolute inset-0 origin-top bg-gradient-to-b from-accent via-accent to-accent/0 shadow-[0_0_12px_rgb(249_115_22/0.6)]"
      />
    </div>
  );
}

/* ───────────────────────── row ───────────────────────── */

function MilestoneRow({
  milestone,
  index,
  total,
  reduceMotion,
}: {
  milestone: Milestone;
  index: number;
  total: number;
  reduceMotion: boolean;
}) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const active = useInView(nodeRef, { margin: TRIGGER });
  const left = index % 2 === 0; // desktop side
  const step = String(index + 1).padStart(2, "0");

  return (
    <li className="relative grid grid-cols-[2.5rem_1fr] gap-x-4 md:grid-cols-[1fr_3.5rem_1fr] md:gap-x-6">
      {/* Node */}
      <div className="col-start-1 row-start-1 flex justify-center pt-7 md:col-start-2">
        <Node ref={nodeRef} active={active} step={step} reduceMotion={reduceMotion} />
      </div>

      {/* Card */}
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: left ? -32 : 32, y: 16 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.8, ease }}
        className={cn(
          "col-start-2 row-start-1",
          left ? "md:col-start-1" : "md:col-start-3",
        )}
      >
        <MilestoneCard
          milestone={milestone}
          active={active}
          step={step}
          total={total}
          side={left ? "left" : "right"}
          reduceMotion={reduceMotion}
        />
      </motion.div>
    </li>
  );
}

/* ───────────────────────── node ───────────────────────── */

function Node({
  ref,
  active,
  step,
  reduceMotion,
}: {
  ref: Ref<HTMLSpanElement>;
  active: boolean;
  step: string;
  reduceMotion: boolean;
}) {
  return (
    <span ref={ref} aria-hidden className="relative flex size-10 items-center justify-center">
      {active && !reduceMotion && (
        <motion.span
          className="absolute inset-0 rounded-full border border-accent"
          initial={{ scale: 0.8, opacity: 0.8 }}
          animate={{ scale: 1.9, opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
        />
      )}
      <motion.span
        className="relative flex size-10 items-center justify-center rounded-full border font-mono text-[11px] font-medium"
        animate={
          active
            ? {
                backgroundColor: "rgb(249 115 22)",
                borderColor: "rgb(249 115 22)",
                color: "rgb(9 9 11)",
                boxShadow: "0 0 0 6px rgb(249 115 22 / 0.15), 0 0 24px rgb(249 115 22 / 0.55)",
                scale: 1,
              }
            : {
                backgroundColor: "rgb(9 9 11)",
                borderColor: "rgb(255 255 255 / 0.15)",
                color: "rgb(113 113 122)",
                boxShadow: "0 0 0 0px rgb(249 115 22 / 0), 0 0 0px rgb(249 115 22 / 0)",
                scale: reduceMotion ? 1 : 0.85,
              }
        }
        transition={{ duration: 0.5, ease }}
      >
        {step}
      </motion.span>
    </span>
  );
}

/* ───────────────────────── card ───────────────────────── */

function MilestoneCard({
  milestone: { slug, title, tag, description, Icon },
  active,
  step,
  total,
  side,
  reduceMotion,
}: {
  milestone: Milestone;
  active: boolean;
  step: string;
  total: number;
  side: "left" | "right";
  reduceMotion: boolean;
}) {
  return (
    <motion.article
      whileHover={reduceMotion ? undefined : { scale: 1.015, y: -2 }}
      transition={{ type: "spring", stiffness: 260, damping: 26 }}
      className={cn(
        "group relative isolate rounded-3xl border bg-white/5 p-6 backdrop-blur-md sm:p-8",
        "transition-[border-color,box-shadow] duration-500 ease-apple",
        active
          ? "border-accent/25 shadow-[0_20px_50px_-36px_rgb(249_115_22/0.35)]"
          : "border-white/10",
        "hover:border-accent/40 hover:shadow-[0_28px_64px_-32px_rgb(249_115_22/0.55)]",
      )}
    >
      {/* Connector from the node to the card edge (desktop: whichever side faces the line) */}
      <span
        aria-hidden
        className={cn(
          "absolute top-[2.9rem] h-px w-4 transition-colors duration-500 md:w-6",
          "-left-4 md:left-auto",
          side === "left" ? "md:-right-6" : "md:-left-6",
          active ? "bg-accent/60" : "bg-white/10",
        )}
      />

      {/* Hover glow */}
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 -z-10 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100",
          "bg-[radial-gradient(120%_80%_at_0%_0%,rgb(249_115_22/0.12),transparent_60%)]",
        )}
      />

      <div className="flex items-start justify-between gap-4">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition-colors duration-500",
            active
              ? "border-accent/30 bg-accent/10 text-accent"
              : "border-white/10 bg-white/5 text-zinc-400",
          )}
        >
          <Icon className="size-3.5" strokeWidth={1.75} aria-hidden />
          {tag}
        </span>
        <span className="shrink-0 pt-1 font-mono text-xs whitespace-nowrap text-subtle tabular-nums">
          {step} / {String(total).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-5 text-title">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{description}</p>

      <div className="mt-6 flex items-center justify-between border-t border-white/5 pt-5">
        <Link
          href={`/work/${slug}`}
          className="inline-flex items-center gap-1.5 rounded-full px-1 text-sm font-medium text-zinc-300 hover:text-white"
        >
          View Details
          <span className="sr-only">: {title}</span>
          <ChevronRight
            aria-hidden
            className="size-4 transition-transform duration-300 ease-apple group-hover:translate-x-1"
          />
        </Link>
        <ProgressPips filled={Number(step)} total={total} />
      </div>
    </motion.article>
  );
}

/** Tiny "level" meter: how far along the journey this stop is. */
function ProgressPips({ filled, total }: { filled: number; total: number }) {
  return (
    <span aria-hidden className="flex gap-1">
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 w-4 rounded-full transition-colors duration-500",
            i < filled ? "bg-accent/70 group-hover:bg-accent" : "bg-white/10",
          )}
        />
      ))}
    </span>
  );
}
