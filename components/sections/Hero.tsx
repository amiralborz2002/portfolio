"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

const words = ["Systems.", "Mechanisms.", "Architectures.", "Logic."] as const;

const WORD_INTERVAL_MS = 2600;

export function Hero() {
  const reduceMotion = !!useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto flex min-h-svh w-full max-w-6xl flex-col items-center justify-center px-6 pt-24 pb-32 text-center"
    >
      <motion.div {...rise(0)}>
        <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-widest text-zinc-400 uppercase backdrop-blur-md">
          <span aria-hidden className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
          </span>
          Available for projects
        </span>
      </motion.div>

      <motion.h1
        id="hero-title"
        {...rise(0.1)}
        className="mt-8 text-[clamp(2.25rem,10vw,7.5rem)] leading-[0.95] font-bold tracking-tighter text-white"
      >
        I design complex
        <RotatingWord reduceMotion={reduceMotion} />
      </motion.h1>

      <motion.p
        {...rise(0.2)}
        className="mt-8 max-w-2xl text-lg text-balance text-zinc-400 md:text-xl"
      >
        I&apos;m Amir Alborz, a Senior UX Designer &amp; Information Architect blending
        behavioral economics, system thinking, and technical logic.
      </motion.p>

      <motion.div
        {...rise(0.3)}
        className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
      >
        <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
          Let&apos;s Talk
        </Button>
        <Button href="/work" variant="outline" size="lg" className="w-full sm:w-auto">
          View Works
        </Button>
      </motion.div>

      <ScrollIndicator reduceMotion={reduceMotion} />
    </section>
  );
}

function RotatingWord({ reduceMotion }: { reduceMotion: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (reduceMotion) return;
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % words.length),
      WORD_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, [reduceMotion]);

  const word = words[index];

  return (
    // Own line with a fixed line box, so swapping words of different
    // lengths never reflows the heading or shifts the content below.
    <span className="relative block h-[1.1em] overflow-hidden pb-[0.1em]">
      {/* Static label for assistive tech so the cycling word isn't re-announced */}
      <span className="sr-only">{words.join(" ")}</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={word}
          aria-hidden
          className="inline-block text-accent"
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: "0.4em", filter: "blur(12px)", scale: 0.96 }
          }
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, y: "-0.4em", filter: "blur(12px)", scale: 1.02 }
          }
          transition={{ duration: 0.55, ease }}
        >
          {word}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function ScrollIndicator({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <motion.a
      href="#at-a-glance"
      aria-label="Scroll to the next section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease }}
      className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-subtle hover:text-foreground"
    >
      <span className="text-eyebrow uppercase">Scroll</span>
      <span className="flex h-10 w-6 justify-center rounded-full border border-hairline/20 pt-2 transition-colors duration-300 group-hover:border-hairline/40">
        <motion.span
          aria-hidden
          className="block h-2 w-1 rounded-full bg-current"
          animate={reduceMotion ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        />
      </span>
    </motion.a>
  );
}
