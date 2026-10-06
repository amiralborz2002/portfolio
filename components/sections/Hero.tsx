"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

const greetings = [
  { text: "Hello.", lang: "en", dir: "ltr" },
  { text: "Hallo.", lang: "nl", dir: "ltr" },
  { text: "سلام.", lang: "fa", dir: "rtl" },
] as const;

const GREETING_INTERVAL_MS = 2600;

export function Hero() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="hero-title"
      className="relative mx-auto flex min-h-[85vh] w-full max-w-6xl flex-col justify-center px-6 pt-16 pb-28"
    >
      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease }}
        className="flex flex-col items-start"
      >
        <RotatingGreeting reduceMotion={!!reduceMotion} />

        <h1
          id="hero-title"
          className="mt-4 max-w-5xl text-6xl font-bold tracking-tight text-white md:text-8xl"
        >
          I design complex systems and digital products.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-zinc-400 md:text-xl">
          I&apos;m Amir Alborz, a Senior UX Designer &amp; Information Architect blending
          behavioral economics, system thinking, and technical logic.
        </p>
      </motion.div>

      <ScrollIndicator reduceMotion={!!reduceMotion} />
    </section>
  );
}

function RotatingGreeting({ reduceMotion }: { reduceMotion: boolean }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(
      () => setIndex((i) => (i + 1) % greetings.length),
      GREETING_INTERVAL_MS,
    );
    return () => window.clearInterval(id);
  }, []);

  const greeting = greetings[index];
  const offset = reduceMotion ? 0 : 12;

  return (
    <p className="relative h-10 text-2xl font-medium text-accent md:h-12 md:text-4xl">
      {/* Static label for assistive tech so the cycling text isn't re-announced */}
      <span className="sr-only">Hello.</span>
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={greeting.text}
          aria-hidden
          lang={greeting.lang}
          dir={greeting.dir}
          className="inline-block"
          initial={{ opacity: 0, y: offset }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -offset }}
          transition={{ duration: 0.5, ease }}
        >
          {greeting.text}
        </motion.span>
      </AnimatePresence>
    </p>
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
