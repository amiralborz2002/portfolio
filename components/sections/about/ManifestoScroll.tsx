"use client";

import {
  m,
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

// Each word fades over this many word-slots, so a few words are mid-fade at
// once and the light sweeps across the text instead of switching word by word.
const FADE_SPAN = 3;

export function ManifestoScroll() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLParagraphElement>(null);
  const reduceMotion = !!useReducedMotion();

  // 0 when the wrapper's top enters at the viewport bottom, 1 when its bottom
  // meets the viewport bottom: the moment the text unpins and the next
  // section starts arriving. The reveal ends exactly there, so there is no
  // dead scroll on a finished statement.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });

  // Where the reveal starts, as wrapper progress: the moment the text's top
  // enters the screen. The text sits partway down the wrapper (vertically
  // centred in the sticky viewport), so this is measured, not a fixed offset.
  const revealStart = useMotionValue(0.15);

  useEffect(() => {
    const section = ref.current;
    const text = textRef.current;
    if (!section || !text) return;

    const measure = () => {
      // The sticky box is the text's offsetParent, so offsetTop is the text's
      // distance below the wrapper's top before pinning. Progress 0 has the
      // wrapper's top at the viewport bottom, so the text's top enters the
      // screen once the wrapper has scrolled offsetTop past that point.
      revealStart.set(text.offsetTop / section.offsetHeight);
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
  }, [revealStart]);

  // Linear remap to 0..1 across the window, so every word gets an equal share
  // of scroll distance: 0 = text top at viewport bottom, 1 = last word lit,
  // exactly as the wrapper's bottom reaches the viewport bottom.
  const reveal = useTransform(
    [scrollYProgress, revealStart],
    ([p, start]: number[]) => Math.min(Math.max((p - start) / (1 - start), 0), 1),
  );

  // A light spring absorbs coarse mouse-wheel steps without visibly lagging.
  const progress = useSpring(reveal, { stiffness: 400, damping: 40, mass: 0.3 });

  const slot = 1 / (WORDS.length + FADE_SPAN - 1);

  return (
    // 150vh: from the text entering to the unpin is ~1.25 screens of scroll,
    // the same reading pace as before, with the pinned hold trimmed away.
    <section ref={ref} aria-label="Manifesto" className="relative h-[150vh]">
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
      <m.span className="inline-block will-change-[opacity]" style={{ opacity }}>
        {children}
      </m.span>{" "}
    </>
  );
}
