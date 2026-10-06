"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef } from "react";

const MANIFESTO =
  "Most see interfaces. I see underlying mechanisms and behavioral loops. Over the last 5 years—from architecting complex platforms to navigating my own startup failures—I've learned that a polished screen cannot save a broken system. True product design requires mapping the deep business logic, and translating technical constraints into seamless, human-centric flows.";

const WORDS = MANIFESTO.split(" ");

// Words finish lighting up before the section ends, so the full statement
// holds on screen for the last stretch of scroll before it unpins.
const REVEAL_END = 0.85;
const DIM = 0.1; // matches text-white/10

export function ManifestoScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = !!useReducedMotion();

  // 0 when the section's top hits the viewport top, 1 when its bottom hits the bottom —
  // i.e. exactly the span during which the sticky child is pinned.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // A light spring smooths out coarse wheel steps without noticeably lagging the scroll.
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  return (
    <section ref={ref} aria-label="Manifesto" className="relative h-[250vh]">
      {/* pt-16 clears the sticky header so the copy centres in the visible area */}
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden pt-16">
        <p className="max-w-5xl px-6 text-center text-[min(1.875rem,3.2svh)] leading-snug font-bold tracking-tight text-white md:text-[min(3rem,4.2svh)] lg:text-[min(4.5rem,5svh)]">
          {/* Screen readers get the sentence once, not fifty-odd fragments */}
          <span className="sr-only">{MANIFESTO}</span>
          <span aria-hidden>
            {WORDS.map((word, i) => {
              const start = (i / WORDS.length) * REVEAL_END;
              const end = ((i + 1) / WORDS.length) * REVEAL_END;
              return (
                <Word key={i} progress={progress} range={[start, end]} static={reduceMotion}>
                  {word}
                </Word>
              );
            })}
          </span>
        </p>
      </div>
    </section>
  );
}

type WordProps = {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
  static: boolean;
};

function Word({ children, progress, range, static: isStatic }: WordProps) {
  // Opacity only — composited on the GPU, so no layout or paint per frame.
  const opacity = useTransform(progress, range, [DIM, 1]);

  return (
    <>
      <motion.span
        className="inline-block will-change-[opacity]"
        style={{ opacity: isStatic ? 1 : opacity }}
      >
        {children}
      </motion.span>{" "}
    </>
  );
}
