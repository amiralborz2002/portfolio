"use client";

import { m, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { Button } from "../ui/Button";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

const words = ["Systems.", "Mechanisms.", "Architectures.", "Logic."] as const;

const TYPE_MS = 90; // per character typed
const DELETE_MS = 45; // per character erased
const HOLD_MS = 4000; // fully typed word stays visible
const GAP_MS = 400; // pause on the empty line before the next word

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
      className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col items-center justify-center px-6 pt-8 pb-24 text-center md:pt-16 md:pb-32"
    >
      {/* Sits above true center so the scroll indicator always has room below */}
      <div className="mb-10 flex w-full flex-col items-center md:mb-[8svh]">
        <m.div {...rise(0)}>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 text-xs font-medium tracking-widest text-zinc-400 uppercase backdrop-blur-md">
            <span aria-hidden className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
            </span>
            Available for projects
          </span>
        </m.div>

        <m.h1
          id="hero-title"
          {...rise(0.1)}
          className="mt-6 text-[clamp(2.25rem,min(10vw,12svh),7.5rem)] leading-[0.95] font-bold tracking-tighter text-white md:mt-8"
        >
          I design complex
          <RotatingWord reduceMotion={reduceMotion} />
        </m.h1>

        <m.p
          {...rise(0.2)}
          className="mt-6 max-w-2xl text-lg text-balance text-zinc-400 md:mt-8 md:text-xl"
        >
          I&apos;m Amir Alborz, a Senior UX Designer &amp; Information Architect blending
          behavioral economics, system thinking, and technical logic.
        </m.p>

        <m.div
          {...rise(0.3)}
          className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row md:mt-10"
        >
          <Button href="/contact" variant="primary" size="lg" className="w-full sm:w-auto">
            Let&apos;s Talk
          </Button>
          <Button href="/work" variant="secondary" size="lg" className="w-full sm:w-auto">
            View Works
          </Button>
        </m.div>
      </div>

      <ScrollIndicator reduceMotion={reduceMotion} />
    </section>
  );
}

function RotatingWord({ reduceMotion }: { reduceMotion: boolean }) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const word = words[index];

  useEffect(() => {
    // Reduced motion: skip the per-character animation, just swap whole words.
    if (reduceMotion) {
      const id = window.setTimeout(() => setIndex((i) => (i + 1) % words.length), HOLD_MS);
      return () => window.clearTimeout(id);
    }

    let next: () => void;
    let delay: number;

    if (!deleting && length < word.length) {
      next = () => setLength((l) => l + 1);
      delay = TYPE_MS;
    } else if (!deleting) {
      next = () => setDeleting(true);
      delay = HOLD_MS;
    } else if (length > 0) {
      next = () => setLength((l) => l - 1);
      delay = DELETE_MS;
    } else {
      next = () => {
        setDeleting(false);
        setIndex((i) => (i + 1) % words.length);
      };
      delay = GAP_MS;
    }

    const id = window.setTimeout(next, delay);
    return () => window.clearTimeout(id);
  }, [reduceMotion, deleting, length, word]);

  const visible = reduceMotion ? word : word.slice(0, length);

  return (
    // Own line with a fixed line box, so the heading height never changes
    // while characters are typed or erased.
    <span className="relative block h-[1.1em] pb-[0.1em]">
      {/* Static label for assistive tech so every keystroke isn't re-announced */}
      <span className="sr-only">{words.join(" ")}</span>
      <span aria-hidden className="inline-flex items-center text-accent">
        <span className="whitespace-pre">{visible}</span>
        <m.span
          className="ml-[0.06em] inline-block h-[0.8em] w-[0.06em] translate-y-[0.04em] rounded-full bg-accent"
          animate={reduceMotion ? undefined : { opacity: [1, 1, 0, 0] }}
          transition={{ duration: 1, times: [0, 0.5, 0.5, 1], repeat: Infinity, ease: "linear" }}
        />
      </span>
    </span>
  );
}

function ScrollIndicator({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <m.a
      href="#at-a-glance"
      aria-label="Scroll to the next section"
      onClick={(event) => {
        const target = document.getElementById("at-a-glance");
        if (!target) return;
        event.preventDefault();
        target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.2, duration: 0.8, ease }}
      className="group absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-subtle hover:text-foreground"
    >
      <span className="text-eyebrow uppercase">Scroll</span>
      <span className="flex h-10 w-6 justify-center rounded-full border border-hairline/20 pt-2 transition-colors duration-300 group-hover:border-hairline/40">
        <m.span
          aria-hidden
          className="block h-2 w-1 rounded-full bg-current"
          animate={reduceMotion ? undefined : { y: [0, 10, 0], opacity: [1, 0.2, 1] }}
          transition={{ duration: 1.8, ease: "easeInOut", repeat: Infinity }}
        />
      </span>
    </m.a>
  );
}
