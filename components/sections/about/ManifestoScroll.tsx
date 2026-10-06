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
  "Most see interfaces. I see underlying mechanisms and behavioral loops. Over the last 5 years, from architecting complex platforms to navigating startup lessons, I have learned that a polished screen cannot save a broken system. True product design requires mapping deep business logic, and translating technical constraints into seamless, human-centric flows.";

const WORDS = MANIFESTO.split(" ");

const DIM = 0.15; // matches text-white/15

// Portion of the wrapper's scroll used for the reveal. Starting a little late
// lets the text settle into place first; ending early holds the finished
// statement on screen before it unpins.
const REVEAL_START = 0.05;
const REVEAL_END = 0.85;

// Each word fades over this many word-slots, so several words are mid-fade at
// once and the light sweeps across the text instead of switching word by word.
const FADE_SPAN = 4;

export function ManifestoScroll() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = !!useReducedMotion();

  // 0 when the wrapper's top meets the viewport top, 1 when its bottom meets
  // the viewport bottom: exactly the stretch where the inner block is pinned.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  // A light spring absorbs coarse mouse-wheel steps without visibly lagging.
  const progress = useSpring(scrollYProgress, { stiffness: 200, damping: 30, mass: 0.4 });

  const slot = (REVEAL_END - REVEAL_START) / (WORDS.length + FADE_SPAN - 1);

  return (
    <section ref={ref} aria-label="Manifesto" className="relative h-[250vh]">
      {/* pt-16 clears the sticky header so the copy centres in the visible area */}
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden pt-16">
        <p className="max-w-4xl px-6 text-center text-2xl leading-snug font-bold tracking-tight text-white md:text-4xl lg:text-[min(3rem,6svh)]">
          {/* Screen readers get the sentence once, not fifty-odd fragments */}
          <span className="sr-only">{MANIFESTO}</span>
          <span aria-hidden>
            {WORDS.map((word, i) => {
              if (reduceMotion) return <span key={i}>{word} </span>;
              const start = REVEAL_START + i * slot;
              return (
                <Word key={i} progress={progress} range={[start, start + FADE_SPAN * slot]}>
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
};

function Word({ children, progress, range }: WordProps) {
  // Scroll-linked, so scrolling back up dims the word again.
  const opacity = useTransform(progress, range, [DIM, 1]);

  return (
    <>
      {/* Opacity only, so the browser composites it without layout or paint */}
      <motion.span className="inline-block will-change-[opacity]" style={{ opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}
