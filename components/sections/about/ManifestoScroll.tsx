"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";

const MANIFESTO =
  "Most see interfaces. I see underlying mechanisms and behavioral loops. Over the last 5 years, from architecting complex platforms to navigating startup lessons, I have learned that a polished screen cannot save a broken system. True product design requires mapping deep business logic, and translating technical constraints into seamless, human-centric flows.";

const WORDS = MANIFESTO.split(" ");

const DIM = 0.15; // matches text-white/15

export function ManifestoScroll() {
  const reduceMotion = !!useReducedMotion();

  return (
    // Bottom padding lets the last line travel up to mid-viewport before the page ends.
    <section aria-label="Manifesto" className="relative pt-[10vh] pb-[25vh]">
      <p className="mx-auto max-w-5xl px-6 text-center text-3xl leading-snug font-bold tracking-tight text-white md:text-5xl lg:text-7xl">
        {/* Screen readers get the sentence once, not fifty-odd fragments */}
        <span className="sr-only">{MANIFESTO}</span>
        <span aria-hidden>
          {WORDS.map((word, i) =>
            reduceMotion ? (
              <span key={i}>{word} </span>
            ) : (
              <Word key={i}>{word}</Word>
            ),
          )}
        </span>
      </p>
    </section>
  );
}

function Word({ children }: { children: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  // Each word tracks its own position: it starts lighting up when its top
  // enters the lower third of the viewport and is fully lit by the middle.
  // Scroll-linked, so scrolling back up dims it again.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.7", "start 0.5"] });

  // The spring absorbs coarse mouse-wheel steps so the fade never jumps.
  const opacity = useSpring(useTransform(scrollYProgress, [0, 1], [DIM, 1]), {
    stiffness: 200,
    damping: 30,
    mass: 0.4,
  });

  return (
    <>
      {/* Opacity only, so the browser composites it without layout or paint */}
      <motion.span ref={ref} className="inline-block will-change-[opacity]" style={{ opacity }}>
        {children}
      </motion.span>{" "}
    </>
  );
}
