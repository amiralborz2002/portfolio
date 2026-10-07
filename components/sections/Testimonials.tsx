"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type PanInfo,
  type TargetAndTransition,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  role: string;
  company: string;
  year: number;
};

/*
 * PLACEHOLDER CONTENT — replace each entry with a real LinkedIn
 * recommendation before publishing. Any number of entries works; newest first.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Amir turned a service catalogue of hundreds of overlapping categories into a structure our users and our database could both understand. Estimates dropped the moment the architecture docs landed.",
    name: "Recommender Name",
    role: "Product Lead",
    company: "Company",
    year: 2026,
  },
  {
    id: "t2",
    quote:
      "A rare designer who reads the business logic before opening Figma. Pricing rules, currency conversions and inventory edge cases became flows developers shipped without a single follow-up meeting.",
    name: "Recommender Name",
    role: "Engineering Manager",
    company: "Company",
    year: 2025,
  },
  {
    id: "t3",
    quote:
      "Working with Amir felt like pairing with a systems engineer and a UX lead at once: hard questions asked early, every decision documented, and a shared language left behind for the whole team.",
    name: "Recommender Name",
    role: "Senior Product Designer",
    company: "Company",
    year: 2024,
  },
  {
    id: "t4",
    quote:
      "The information architecture work reshaped how we onboard technicians. Profiles, skills and service areas finally map to how the business actually operates, and support tickets fell noticeably.",
    name: "Recommender Name",
    role: "Operations Director",
    company: "Company",
    year: 2023,
  },
  {
    id: "t5",
    quote:
      "Complex engineering mechanisms explained so clearly that our non-technical stakeholders could make decisions on them. That kind of visual storytelling is incredibly hard to find.",
    name: "Recommender Name",
    role: "Technical Program Manager",
    company: "Company",
    year: 2022,
  },
  {
    id: "t6",
    quote:
      "Thorough, curious and calm under ambiguity. Research, data and constraints were always on the table before a single screen was drawn, which saved us weeks of rework.",
    name: "Recommender Name",
    role: "UX Research Lead",
    company: "Company",
    year: 2022,
  },
];

const VISIBLE = 3; // cards drawn in the stack; the rest wait invisibly behind
const SWIPE_THRESHOLD = 90; // px of horizontal drag that counts as "next"

// Visual state for a card by its position in the deck (0 = front). The
// alternating tilt makes the stack read as a loose physical deck, so it
// looks swipeable without any instructions.
function stackPose(position: number): TargetAndTransition {
  const poses = [
    { scale: 1, opacity: 1, y: 0, rotate: 0, zIndex: 50 },
    { scale: 0.95, opacity: 0.6, y: 20, rotate: -3, zIndex: 40 },
    { scale: 0.9, opacity: 0.3, y: 40, rotate: 3, zIndex: 30 },
  ];
  return { x: 0, ...poses[Math.min(position, poses.length - 1)] };
}

export function Testimonials() {
  const reduceMotion = !!useReducedMotion();
  // `order` is the deck: ids front to back. Cycling rotates this array.
  const [order, setOrder] = useState(() => TESTIMONIALS.map((t) => t.id));
  // 1 = moved forward (front card dealt away), -1 = moved back.
  const [direction, setDirection] = useState<1 | -1>(1);

  const byId = new Map(TESTIMONIALS.map((t) => [t.id, t]));
  const activeIndex = TESTIMONIALS.findIndex((t) => t.id === order[0]);
  const total = TESTIMONIALS.length;

  const next = () => {
    setDirection(1);
    setOrder(([first, ...rest]) => [...rest, first]);
  };

  const prev = () => {
    setDirection(-1);
    setOrder((deck) => [deck[deck.length - 1], ...deck.slice(0, -1)]);
  };

  const goTo = (index: number) => {
    const id = TESTIMONIALS[index].id;
    if (id === order[0]) return;
    setDirection(index > activeIndex ? 1 : -1);
    setOrder((deck) => {
      const at = deck.indexOf(id);
      return [...deck.slice(at), ...deck.slice(0, at)];
    });
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      next();
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      prev();
    }
  };

  // A drag must never also count as a click on the card.
  const dragged = useRef(false);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > SWIPE_THRESHOLD || Math.abs(info.velocity.x) > 600) next();
  };

  // framer-motion's tap also fires for Enter on the focused card.
  const onTap = () => {
    if (dragged.current) return;
    next();
  };

  // Entering / leaving animations depend on direction (passed via `custom`).
  const variants = {
    enter: (dir: 1 | -1): TargetAndTransition =>
      reduceMotion
        ? { opacity: 0 }
        : dir > 0
          ? { opacity: 0, scale: 0.85, y: 60, x: 0, rotate: 6, zIndex: 20 }
          : { opacity: 0, scale: 1, y: 0, x: -180, rotate: -8, zIndex: 60 },
    exit: (dir: 1 | -1): TargetAndTransition =>
      reduceMotion
        ? { opacity: 0, transition: { duration: 0.2 } }
        : dir > 0
          ? { opacity: 0, x: 220, y: -10, rotate: 10, zIndex: 60, transition: { duration: 0.45, ease } }
          : { opacity: 0, scale: 0.85, y: 60, zIndex: 20, transition: { duration: 0.35, ease } },
  };

  const visible = order.slice(0, VISIBLE);

  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      // Swiped/exiting cards fly up to 220px sideways; clip so they never widen the page.
      className="mx-auto w-full max-w-6xl overflow-x-clip px-6"
    >
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
          What others say
        </p>
        <h2 id="testimonials-title" className="mt-3 mb-12 text-3xl font-bold text-white md:text-5xl">
          Trusted by teams I&apos;ve worked with.
        </h2>
      </div>

      <div
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        onKeyDown={onKeyDown}
        className="mx-auto max-w-2xl"
      >
        {/* The deck */}
        <div className="relative h-[460px] sm:h-[400px]">
          {/* Soft halo under the deck */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-10 top-10 bottom-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.10),transparent)] blur-2xl"
          />
          <AnimatePresence initial={false} custom={direction}>
            {visible.map((id, position) => {
              const t = byId.get(id)!;
              const front = position === 0;
              return (
                <motion.div
                  key={id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate={stackPose(position)}
                  exit="exit"
                  transition={{ duration: reduceMotion ? 0.2 : 0.55, ease }}
                  whileHover={front && !reduceMotion ? { y: -6 } : undefined}
                  drag={front && !reduceMotion ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.6}
                  onPointerDown={() => (dragged.current = false)}
                  onDragStart={() => (dragged.current = true)}
                  onDragEnd={front ? onDragEnd : undefined}
                  onTap={front ? onTap : undefined}
                  onKeyDown={
                    front
                      ? (e) => {
                          // Enter comes through onTap; Space is the other button key.
                          if (e.key === " ") {
                            e.preventDefault();
                            next();
                          }
                        }
                      : undefined
                  }
                  role={front ? "button" : undefined}
                  tabIndex={front ? 0 : -1}
                  aria-hidden={!front}
                  aria-label={front ? "Show next testimonial" : undefined}
                  className={cn(
                    // Solid base under the glass so stacked cards never show through each other;
                    // origin-bottom so scaled-down cards peek out below the front one.
                    "absolute inset-x-0 top-0 origin-bottom touch-pan-y rounded-3xl bg-background",
                    front ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
                  )}
                >
                  <TestimonialCard testimonial={t} front={front} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Controls */}
        <div className="mt-2 flex items-center justify-between gap-6">
          <ControlButton label="Previous testimonial" onClick={prev}>
            <ChevronLeft className="size-5" strokeWidth={1.75} />
          </ControlButton>

          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-1.5">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Show testimonial ${i + 1} of ${total}`}
                  aria-current={i === activeIndex ? "true" : undefined}
                  className="group flex h-6 items-center"
                >
                  <span
                    className={cn(
                      "block h-1 rounded-full transition-all duration-500 ease-apple",
                      i === activeIndex
                        ? "w-6 bg-accent"
                        : "w-2 bg-white/15 group-hover:bg-white/35",
                    )}
                  />
                </button>
              ))}
            </div>
            <p aria-live="polite" className="font-mono text-xs text-subtle tabular-nums">
              <span className="text-zinc-300">{String(activeIndex + 1).padStart(2, "0")}</span>
              {" / "}
              {String(total).padStart(2, "0")}
              <span className="sr-only">
                : {byId.get(order[0])!.role}, {byId.get(order[0])!.company}
              </span>
            </p>
          </div>

          <ControlButton label="Next testimonial" onClick={next}>
            <ChevronRight className="size-5" strokeWidth={1.75} />
          </ControlButton>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────── card ───────────────────────── */

function TestimonialCard({
  testimonial: { quote, name, role, company, year },
  front,
}: {
  testimonial: Testimonial;
  front: boolean;
}) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure
      className={cn(
        "group flex h-[380px] flex-col rounded-3xl border bg-white/5 p-8 backdrop-blur-md select-none sm:h-[320px]",
        "shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] transition-[border-color,box-shadow] duration-500 ease-apple",
        front
          ? "border-white/10 hover:border-accent/40 hover:shadow-[0_30px_70px_-30px_rgb(249_115_22/0.45)]"
          : "border-white/10",
      )}
    >
      <div className="flex items-start justify-between">
        <Quote
          aria-hidden
          className="size-8 text-white/10 transition-colors duration-300 group-hover:text-accent/40"
          strokeWidth={1.5}
          fill="currentColor"
        />
        <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 font-mono text-[11px] text-zinc-400 tabular-nums">
          {year}
        </span>
      </div>

      <blockquote className="mt-5 mb-8 text-base leading-relaxed text-zinc-300 sm:text-lg">
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-5">
        <span
          aria-hidden
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-400/70 to-rose-500/40 text-xs font-semibold text-white/80 ring-1 ring-white/10"
        >
          {initials}
        </span>
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="truncate text-sm text-zinc-500">
            {role} · {company}
          </p>
        </div>
      </figcaption>
    </figure>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {children}
    </motion.button>
  );
}
