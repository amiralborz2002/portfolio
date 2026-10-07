"use client";

import { motion, useReducedMotion } from "framer-motion";

import { Button } from "../ui/Button";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

// TODO: replace with the real address (also used in components/layout/Footer.tsx)
const EMAIL = "your@email.com";

export function FinalCTA() {
  const reduceMotion = !!useReducedMotion();

  const rise = (delay: number) => ({
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { duration: 0.9, delay, ease },
  });

  return (
    <section
      id="contact"
      aria-labelledby="final-cta-title"
      className="relative isolate flex min-h-[70vh] w-full flex-col items-center justify-center overflow-hidden px-6 py-24 text-center"
    >
      {/* Cinematic focal glow: wide soft halo + tighter warm core, slowly breathing */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[720px] w-[min(1200px,160vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.10),transparent)] blur-2xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.06, 1], opacity: [0.85, 1, 0.85] }}
        transition={{ duration: 8, ease: "easeInOut", repeat: Infinity }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(249_115_22/0.08),transparent)] blur-xl"
      />
      {/* Hairline fade at the top so the section doesn't start with a hard edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 mx-auto h-px max-w-4xl bg-gradient-to-r from-transparent via-white/15 to-transparent"
      />

      <motion.h2
        id="final-cta-title"
        {...rise(0)}
        className="max-w-5xl text-6xl font-bold tracking-tight text-balance text-white md:text-8xl"
      >
        Ready to untangle complex systems?
      </motion.h2>

      <motion.p {...rise(0.12)} className="mt-6 max-w-2xl text-xl text-balance text-zinc-400">
        Let&apos;s build digital products that make sense. From underlying logic to the final
        pixel.
      </motion.p>

      <motion.div
        {...rise(0.24)}
        className="mt-10 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
      >
        <Button href={`mailto:${EMAIL}`} variant="primary" size="lg" className="w-full sm:w-auto">
          Book a Strategy Call
        </Button>
        <Button href={`mailto:${EMAIL}`} variant="secondary" size="lg" className="w-full sm:w-auto">
          Send an Email
        </Button>
      </motion.div>
    </section>
  );
}
