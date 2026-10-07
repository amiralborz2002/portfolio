"use client";

import { AnimatePresence, motion, useReducedMotion, type TargetAndTransition } from "framer-motion";
import { Quote } from "lucide-react";
import { useState } from "react";

import { TestimonialAvatar } from "@/components/ui/TestimonialAvatar";
import { testimonials as allTestimonials } from "@/data/testimonials";
import { cn } from "@/lib/utils";

const testimonials = allTestimonials.slice(0, 6);
const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

// Pose by distance from the front card; only the front card and the two
// behind it are visible.
function pose(offset: number): TargetAndTransition {
  if (offset === 0) return { zIndex: 30, scale: 1, y: 0, opacity: 1 };
  if (offset === 1) return { zIndex: 20, scale: 0.95, y: 20, opacity: 0.8 };
  if (offset === 2) return { zIndex: 10, scale: 0.9, y: 40, opacity: 0.5 };
  return { zIndex: 0, scale: 0.8, y: 40, opacity: 0 };
}

export function TestimonialsStack() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const reduceMotion = !!useReducedMotion();

  const next = () => setCurrentIndex((prev) => (prev + 1) % testimonials.length);

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Testimonials">
      <div className="relative mx-auto flex h-[400px] w-full max-w-2xl items-center justify-center md:h-[350px]">
        <AnimatePresence initial={false}>
          {testimonials.map(({ id, content, name, role, avatar }, index) => {
            const isFront = index === currentIndex;
            const offset = (index - currentIndex + testimonials.length) % testimonials.length;
            const isVisible = offset >= 0 && offset < 3;

            return (
              <motion.div
                key={id}
                initial={false}
                animate={pose(offset)}
                transition={{ duration: reduceMotion ? 0 : 0.5, ease }}
                // Scale from the bottom edge so the cards behind peek out below.
                style={{ transformOrigin: "bottom center" }}
                onClick={next}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    next();
                  }
                }}
                role={isFront ? "button" : undefined}
                tabIndex={isFront ? 0 : -1}
                aria-hidden={!isFront}
                aria-label={isFront ? `Testimonial from ${name}. Show next testimonial` : undefined}
                className={cn(
                  "absolute top-0 flex h-[330px] w-full cursor-pointer flex-col rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl select-none md:h-[290px] md:p-8",
                  !isVisible && "pointer-events-none",
                )}
              >
                <div className="flex items-center gap-3">
                  <TestimonialAvatar src={avatar} name={name} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="truncate text-sm text-zinc-500">{role}</p>
                  </div>
                  <Quote aria-hidden className="size-6 shrink-0 text-zinc-700" strokeWidth={1.5} fill="currentColor" />
                </div>
                <p className="mt-5 line-clamp-6 text-base leading-relaxed text-zinc-300">
                  &ldquo;{content}&rdquo;
                </p>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <p aria-live="polite" className="mt-2 text-center text-xs text-zinc-500">
        <span className="font-mono tabular-nums text-zinc-400">
          {String(currentIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
        </span>
        <span aria-hidden> · </span>
        Click card to cycle
      </p>
    </div>
  );
}
