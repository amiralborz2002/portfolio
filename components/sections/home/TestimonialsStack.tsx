"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useTransform,
  type PanInfo,
  type TargetAndTransition,
} from "framer-motion";
import { ArrowLeft, ArrowRight, Quote } from "lucide-react";
import { useState, type KeyboardEvent, type ReactNode } from "react";

import { TestimonialAvatar } from "@/components/ui/TestimonialAvatar";
import { testimonials, type Testimonial } from "@/data/testimonials";
import { cn } from "@/lib/utils";

type Direction = "left" | "right";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple
const SWIPE_THRESHOLD = 100; // px of horizontal drag that throws the card
const FLY_DISTANCE = 900; // px the thrown card travels: far enough to leave any screen
const spring = { type: "spring", stiffness: 300, damping: 20 } as const;

// Resting pose by position: back cards tilt alternately so their corners
// peek out, shrinking and fading with depth. Cards past the third are hidden
// in the third card's spot.
const POSES = [
  { rotate: 0, scale: 1, y: 0, opacity: 1, zIndex: 30 },
  { rotate: -3, scale: 0.94, y: 15, opacity: 0.4, zIndex: 20 },
  { rotate: 3, scale: 0.88, y: 30, opacity: 0.15, zIndex: 10 },
] as const;

export function TestimonialsStack() {
  const [cards, setCards] = useState(() => testimonials.slice(0, 6));
  // The front card while it flies off-screen; it moves to the back once it lands.
  const [leaving, setLeaving] = useState<Direction | null>(null);

  const moveCardToBack = (direction: Direction) => {
    if (leaving) return; // one throw at a time
    setLeaving(direction);
  };

  const onFlyComplete = () => {
    setCards(([first, ...rest]) => [...rest, first]);
    setLeaving(null);
  };

  const onKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      moveCardToBack(event.key === "ArrowLeft" ? "left" : "right");
    }
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Testimonials"
      onKeyDown={onKeyDown}
    >
      <div className="relative mx-auto h-[480px] w-full max-w-2xl md:h-[400px]">
        {cards.map((card, index) => (
          <StackCard
            key={card.id}
            card={card}
            index={index}
            leaving={index === 0 ? leaving : null}
            onSwipe={moveCardToBack}
            onFlyComplete={onFlyComplete}
          />
        ))}
      </div>

      <div className="mt-12 flex items-center justify-center gap-6">
        <ControlButton
          label="Swipe left"
          onClick={() => moveCardToBack("left")}
        >
          <ArrowLeft className="size-5" strokeWidth={1.75} />
        </ControlButton>
        <span className="font-mono text-xs text-zinc-500">Swipe or Click</span>
        <ControlButton
          label="Swipe right"
          onClick={() => moveCardToBack("right")}
        >
          <ArrowRight className="size-5" strokeWidth={1.75} />
        </ControlButton>
      </div>
      <p aria-live="polite" className="sr-only">
        Testimonial from {cards[0].name}, {cards[0].role}
      </p>
    </div>
  );
}

function StackCard({
  card,
  index,
  leaving,
  onSwipe,
  onFlyComplete,
}: {
  card: Testimonial;
  index: number;
  leaving: Direction | null;
  onSwipe: (direction: Direction) => void;
  onFlyComplete: () => void;
}) {
  const reduceMotion = !!useReducedMotion();
  const isFront = index === 0;

  // Dragging tilts the card like it's pinned at the bottom. This drives
  // rotateZ, leaving `rotate` free for the resting stack tilt.
  const x = useMotionValue(0);
  const dragTilt = useTransform(x, [-300, 0, 300], [-12, 0, 12]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right");
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left");
    // Otherwise dragConstraints snaps the card back to the centre.
  };

  const pose = POSES[Math.min(index, POSES.length - 1)];
  let target: TargetAndTransition;
  if (leaving) {
    target = {
      x: leaving === "right" ? FLY_DISTANCE : -FLY_DISTANCE,
      opacity: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease },
    };
  } else if (index < POSES.length) {
    target = {
      ...pose,
      x: 0,
      transition: reduceMotion ? { duration: 0 } : spring,
    };
  } else {
    // Hidden at the back. Snap there instantly, so a card that just flew off
    // never visibly slides back across the stack.
    target = {
      ...pose,
      x: 0,
      opacity: 0,
      zIndex: 0,
      transition: { duration: 0 },
    };
  }

  return (
    <motion.div
      initial={false}
      animate={target}
      onAnimationComplete={(definition) => {
        // Only the fly-off counts: an earlier settle animation can still
        // finish while the card is already leaving.
        const flewOff =
          typeof definition === "object" &&
          "x" in definition &&
          Math.abs(Number(definition.x)) === FLY_DISTANCE;
        if (leaving && flewOff) onFlyComplete();
      }}
      drag={isFront && !leaving ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.7}
      onDragEnd={isFront ? onDragEnd : undefined}
      aria-hidden={!isFront}
      style={{
        x,
        rotateZ: dragTilt,
        transformOrigin: "bottom center",
      }}
      className={cn(
        "absolute top-0 flex h-[420px] w-full touch-pan-y flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] p-6 shadow-2xl select-none md:h-[340px] md:p-8",
        isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
      )}
    >
      <Quote
        aria-hidden
        className="pointer-events-none absolute -top-2 right-4 size-28 text-white/[0.03]"
        strokeWidth={1}
        fill="currentColor"
      />
      <blockquote className="relative">
        <p className="line-clamp-8 font-serif text-lg leading-relaxed text-zinc-300 md:line-clamp-6">
          &ldquo;{card.content}&rdquo;
        </p>
      </blockquote>

      <div>
        <hr className="my-6 border-zinc-800" />
        <div className="flex items-center gap-4">
          <TestimonialAvatar src={card.avatar} name={card.name} size={48} />
          <div className="min-w-0">
            <h4 className="font-medium text-white">{card.name}</h4>
            <p className="truncate text-sm text-zinc-500">{card.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
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
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border border-zinc-800 bg-[#111113] text-zinc-300 transition-colors duration-300 hover:border-zinc-600 hover:text-white"
    >
      {children}
    </button>
  );
}
