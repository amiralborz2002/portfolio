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
      <div className="relative mx-auto h-[400px] w-full max-w-2xl">
        {cards.map((card, index) => (
          <StackCard
            key={card.id}
            card={card}
            index={index}
            total={cards.length}
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
  total,
  leaving,
  onSwipe,
  onFlyComplete,
}: {
  card: Testimonial;
  index: number;
  total: number;
  leaving: Direction | null;
  onSwipe: (direction: Direction) => void;
  onFlyComplete: () => void;
}) {
  const reduceMotion = !!useReducedMotion();
  const isFront = index === 0;

  // Dragging tilts the card like it's pinned at the bottom.
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-12, 0, 12]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > SWIPE_THRESHOLD) onSwipe("right");
    else if (info.offset.x < -SWIPE_THRESHOLD) onSwipe("left");
    // Otherwise dragConstraints snaps the card back to the centre.
  };

  let target: TargetAndTransition;
  if (leaving) {
    target = {
      x: leaving === "right" ? FLY_DISTANCE : -FLY_DISTANCE,
      opacity: 0,
      transition: { duration: reduceMotion ? 0 : 0.4, ease },
    };
  } else if (index < 3) {
    target = {
      x: 0,
      scale: 1 - index * 0.05,
      y: index * 20,
      opacity: 1 - index * 0.2,
      transition: { duration: reduceMotion ? 0 : 0.5, ease },
    };
  } else {
    // Hidden at the back. Snap there instantly, so a card that just flew off
    // never visibly slides back across the stack.
    target = {
      x: 0,
      scale: 1 - 2 * 0.05,
      y: 2 * 20,
      opacity: 0,
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
        rotate,
        zIndex: total - index,
        transformOrigin: "bottom center",
      }}
      className={cn(
        "absolute top-0 flex min-h-[300px] w-full touch-pan-y flex-col justify-between overflow-hidden rounded-2xl border border-zinc-800 bg-[#111113] p-6 shadow-2xl select-none md:p-8",
        isFront ? "cursor-grab active:cursor-grabbing" : "pointer-events-none",
      )}
    >
      <Quote
        aria-hidden
        className="pointer-events-none absolute -top-2 right-4 size-28 text-white/[0.03]"
        strokeWidth={1}
        fill="currentColor"
      />
      {/* Back cards show only their edges; their content would bleed into the peek. */}
      <div
        className={cn(
          "flex flex-1 flex-col justify-between transition-opacity duration-500 ease-apple",
          !isFront && "opacity-0",
        )}
      >
        <blockquote className="relative">
          <p className="line-clamp-4 font-serif text-lg leading-relaxed text-zinc-300">
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
