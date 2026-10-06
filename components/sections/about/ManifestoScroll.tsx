"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useRef } from "react";

const MANIFESTO =
  "Most see interfaces. I see underlying mechanisms and behavioral loops. Over the last 5 years, from architecting complex platforms to navigating startup lessons, I have learned that a polished screen cannot save a broken system. True product design requires mapping deep business logic, and translating technical constraints into seamless, human-centric flows.";

const WORDS = MANIFESTO.split(" ");

const DIM = 0.15; // matches text-white/15

// How far the reader scrolls, in viewport heights, from the moment the text's
// top enters at the bottom of the screen until the last word is lit. At 1.3
// the first line is fully lit by the time the block is about a quarter of the
// way up the screen, and the rest lights at an even, comfortable reading pace.
const REVEAL_LENGTH_VH = 1.3;

// Each word fades over this many word-slots, so a few words are mid-fade at
// once and the light sweeps across the text instead of switching word by word.
const FADE_SPAN = 3;

export function ManifestoScroll() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = !!useReducedMotion();

  // 0 when the wrapper's top enters at the viewport bottom, 1 when its bottom
  // meets the viewport bottom (the moment the text unpins). Starting this
  // early covers the stretch where the text is still scrolling up into place.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  // The reveal window, as wrapper progress. The text sits partway down the
  // wrapper (it is vertically centred in the sticky viewport), so the window
  // is measured from the real layout rather than written as a fixed offset.
  const revealStart = useMotionValue(0.1);
  const revealEnd = useMotionValue(0.7);

  useEffect(() => {
    const section = ref.current;
    const text = textRef.current;
    if (!section || !text) return;

    const measure = () => {
      // The sticky box is the text's offsetParent, so offsetTop is the text's
      // distance below the wrapper's top before pinning. Progress 0 has the
      // wrapper's top at the viewport bottom, so the text's top enters the
      // screen once the wrapper has scrolled offsetTop past that point.
      const total = section.offsetHeight;
      const start = text.offsetTop / total;
      const end = (text.offsetTop + REVEAL_LENGTH_VH * window.innerHeight) / total;
      revealStart.set(start);
      revealEnd.set(Math.min(end, 1));
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(text);
    window.addEventListener("resize", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [revealStart, revealEnd]);

  // Linear remap to 0..1 across the window, so every word gets an equal share
  // of scroll distance: 0 = text top at viewport bottom, 1 = last word lit.
  const reveal = useTransform(
    [scrollYProgress, revealStart, revealEnd],
    ([p, start, end]: number[]) => Math.min(Math.max((p - start) / (end - start), 0), 1),
  );

  // A light spring absorbs coarse mouse-wheel steps without visibly lagging.
  const progress = useSpring(reveal, { stiffness: 400, damping: 40, mass: 0.3 });

  const slot = 1 / (WORDS.length + FADE_SPAN - 1);

  return (
    <section ref={ref} aria-label="Manifesto" className="relative h-[250vh]">
      {/* pt-16 clears the sticky header so the copy centres in the visible area */}
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden pt-16">
        <p ref={textRef} className="max-w-4xl px-6 text-center text-2xl leading-snug font-bold tracking-tight text-white md:text-4xl lg:text-[min(3rem,6svh)]">
          {/* Screen readers get the sentence once, not fifty-odd fragments */}
          <span className="sr-only">{MANIFESTO}</span>
          <span aria-hidden>
            {WORDS.map((word, i) => {
              if (reduceMotion) return <span key={i}>{word} </span>;
              const start = i * slot;
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
