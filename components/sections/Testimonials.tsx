"use client";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
  type PanInfo,
  type TargetAndTransition,
} from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import Image from "next/image";
import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";

import { testimonials, type Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

interface Props {
  /** Show only the first `limit` testimonials; omit to show them all. */
  limit?: number;
}

export function Testimonials({ limit }: Props) {
  const displayData = limit ? testimonials.slice(0, limit) : testimonials;
  return (
    <>
      <ParallaxColumns items={displayData} />
      <MobileDeck items={displayData} />
    </>
  );
}

/* ------------------------------------------------------------------ */
/* Desktop: three columns, only the centre one drifts                   */
/* ------------------------------------------------------------------ */

// The centre column drifts from DRIFT px below its resting spot to DRIFT px
// above it over the whole scroll: slow enough to read while it moves.
const DRIFT = 48;

function ParallaxColumns({ items }: { items: Testimonial[] }) {
  // Columns are consecutive slices of the data: left, centre, right.
  const perColumn = Math.ceil(items.length / 3);
  const left = items.slice(0, perColumn);
  const center = items.slice(perColumn, perColumn * 2);
  const right = items.slice(perColumn * 2);

  const reduceMotion = !!useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  // 0 as the grid's top enters at the bottom of the viewport, 1 as its bottom
  // reaches the bottom. That end point is always reachable, even this close
  // to the foot of the page, so the full drift always plays out.
  const { scrollYProgress } = useScroll({ target: gridRef, offset: ["start end", "end end"] });
  // A light spring keeps wheel steps from making the column judder.
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const centerY = useTransform(progress, [0, 1], [DRIFT, -DRIFT]);

  return (
    <div ref={gridRef} className="hidden items-start gap-6 md:grid md:grid-cols-3">
      <Column items={left} />

      {/*
        The centre column alone is masked, so the static side columns stay
        crisp. The wrapper reaches 96px past the grid at both ends: the column
        drifts into that margin and fades as it nears the edge instead of
        being clipped.
      */}
      <div
        className="-my-24 self-stretch overflow-hidden py-24"
        style={{
          maskImage: "linear-gradient(to bottom, transparent, #000 96px, #000 calc(100% - 96px), transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, #000 96px, #000 calc(100% - 96px), transparent)",
        }}
      >
        <Column items={center} y={reduceMotion ? undefined : centerY} />
      </div>

      <Column items={right} />
    </div>
  );
}

function Column({ items, y }: { items: Testimonial[]; y?: MotionValue<number> }) {
  return (
    <motion.div style={{ y }} className={cn("flex flex-col gap-6", y && "will-change-transform")}>
      {items.map((t) => (
        <TestimonialCard key={t.id} testimonial={t} />
      ))}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile: swipeable stacked deck (no scroll-jacking)                   */
/* ------------------------------------------------------------------ */

const VISIBLE = 4; // cards drawn in the stack; the rest wait invisibly behind
const SWIPE_THRESHOLD = 80; // px of horizontal drag that counts as "next"

// Visual state by position in the deck (0 = front). Alternating tilt makes
// the stack read as a loose physical deck, so it looks swipeable.
function stackPose(position: number): TargetAndTransition {
  const poses = [
    { scale: 1, opacity: 1, y: 0, rotate: 0, zIndex: 50 },
    { scale: 0.95, opacity: 0.7, y: 16, rotate: -2.5, zIndex: 40 },
    { scale: 0.9, opacity: 0.45, y: 32, rotate: 2.5, zIndex: 30 },
    { scale: 0.85, opacity: 0.2, y: 48, rotate: -1.5, zIndex: 20 },
  ];
  return { x: 0, ...poses[Math.min(position, poses.length - 1)] };
}

function MobileDeck({ items }: { items: Testimonial[] }) {
  const reduceMotion = !!useReducedMotion();
  // The deck, front to back; cycling rotates this array.
  const [order, setOrder] = useState(() => items.map((t) => t.id));
  const [direction, setDirection] = useState<1 | -1>(1);

  const byId = new Map(items.map((t) => [t.id, t]));
  const activeIndex = items.findIndex((t) => t.id === order[0]);
  const total = items.length;

  const next = () => {
    setDirection(1);
    setOrder(([first, ...rest]) => [...rest, first]);
  };

  const prev = () => {
    setDirection(-1);
    setOrder((deck) => [deck[deck.length - 1], ...deck.slice(0, -1)]);
  };

  const goTo = (index: number) => {
    const id = items[index].id;
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

  // A drag must never also count as a tap on the card.
  const dragged = useRef(false);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -SWIPE_THRESHOLD || info.velocity.x < -500) next();
    else if (info.offset.x > SWIPE_THRESHOLD || info.velocity.x > 500) prev();
  };

  const variants = {
    enter: (dir: 1 | -1): TargetAndTransition =>
      reduceMotion
        ? { opacity: 0 }
        : dir > 0
          ? { opacity: 0, scale: 0.8, y: 64, x: 0, rotate: 4, zIndex: 10 }
          : { opacity: 0, scale: 1, y: 0, x: 220, rotate: 8, zIndex: 60 },
    exit: (dir: 1 | -1): TargetAndTransition =>
      reduceMotion
        ? { opacity: 0, transition: { duration: 0.2 } }
        : dir > 0
          ? { opacity: 0, x: -240, y: -8, rotate: -10, zIndex: 60, transition: { duration: 0.4, ease } }
          : { opacity: 0, scale: 0.8, y: 64, zIndex: 10, transition: { duration: 0.35, ease } },
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onKeyDown={onKeyDown}
      // overflow-anchor: none stops the browser's scroll anchoring from picking a
      // card that is mid-transition and nudging the page to compensate.
      className="flex flex-col [overflow-anchor:none] md:hidden"
    >
      {/* Fixed height: cards are absolutely positioned, so the deck's footprint
          never changes while they enter, exit and restack. */}
      <div className="relative h-[490px] shrink-0">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-6 top-10 bottom-0 -z-10 rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.10),transparent)] blur-2xl"
        />
        <AnimatePresence initial={false} custom={direction}>
          {order.slice(0, VISIBLE).map((id, position) => {
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
                transition={{ duration: reduceMotion ? 0.2 : 0.5, ease }}
                drag={front && !reduceMotion ? "x" : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.7}
                onPointerDown={(e) => {
                  dragged.current = false;
                  // Mouse/touch presses must not focus the card: mobile browsers
                  // scroll a newly focused element into view, which made the page
                  // jump mid-transition. Keyboard focus (Tab) is unaffected.
                  e.preventDefault();
                }}
                onDragStart={() => (dragged.current = true)}
                onDragEnd={front ? onDragEnd : undefined}
                onTap={
                  front
                    ? (e) => {
                        e.preventDefault();
                        if (!dragged.current) next();
                      }
                    : undefined
                }
                onKeyDown={
                  front
                    ? (e) => {
                        // Enter arrives via onTap; Space is the other button key.
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
                  // Solid base so stacked glass cards never show through each other;
                  // touch-pan-y keeps vertical page scrolling free while x is dragged.
                  "absolute inset-x-0 top-0 origin-bottom touch-pan-y rounded-3xl bg-background",
                  front ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
                )}
              >
                <TestimonialCard testimonial={t} className="h-[420px] select-none" clamp />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <div className="flex items-center justify-between gap-4">
        <ControlButton label="Previous testimonial" onClick={prev}>
          <ChevronLeft className="size-5" strokeWidth={1.75} />
        </ControlButton>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1">
            {items.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  goTo(i);
                }}
                aria-label={`Show testimonial ${i + 1} of ${total}`}
                aria-current={i === activeIndex ? "true" : undefined}
                className="group flex h-6 items-center px-0.5"
              >
                <span
                  className={cn(
                    "block h-1 rounded-full transition-all duration-500 ease-apple",
                    i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-white/15",
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
              : {byId.get(order[0])!.name}, {byId.get(order[0])!.role}
            </span>
          </p>
        </div>

        <ControlButton label="Next testimonial" onClick={next}>
          <ChevronRight className="size-5" strokeWidth={1.75} />
        </ControlButton>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared card                                                          */
/* ------------------------------------------------------------------ */

function TestimonialCard({
  testimonial: { content, name, role, avatar },
  className,
  clamp = false,
}: {
  testimonial: Testimonial;
  className?: string;
  /** Fixed-height deck cards cap the quote so long copy never overflows. */
  clamp?: boolean;
}) {
  return (
    <figure
      className={cn(
        "group flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md",
        "shadow-[0_30px_60px_-30px_rgb(0_0_0/0.8)] transition-colors duration-500 ease-apple hover:border-white/20",
        className,
      )}
    >
      <Quote
        aria-hidden
        className="size-7 shrink-0 text-white/10 transition-colors duration-300 group-hover:text-accent/40"
        strokeWidth={1.5}
        fill="currentColor"
      />
      <blockquote
        className={cn("mt-5 mb-8 text-base leading-relaxed text-zinc-300", clamp && "line-clamp-8")}
      >
        <p>&ldquo;{content}&rdquo;</p>
      </blockquote>
      <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-5">
        <Avatar src={avatar} name={name} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white">{name}</p>
          <p className="truncate text-sm text-zinc-500">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}

// Falls back to the person's initials on a dark disc when the photo is
// missing or fails to load.
function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      aria-hidden
      className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-zinc-800 text-xs font-semibold text-zinc-300 ring-1 ring-white/10"
    >
      {initials}
      {!failed && (
        <Image
          src={src}
          alt=""
          width={40}
          height={40}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
    </span>
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
      onClick={(e) => {
        e.preventDefault();
        onClick();
      }}
      aria-label={label}
      whileTap={{ scale: 0.92 }}
      className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {children}
    </motion.button>
  );
}
