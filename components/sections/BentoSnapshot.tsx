"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MapPin, Workflow } from "lucide-react";
import type { ReactNode } from "react";

import { BentoCard } from "../ui/BentoCard";
import { Button } from "../ui/Button";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

export function BentoSnapshot() {
  const reduceMotion = useReducedMotion();

  const grid: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const card: Variants = {
    hidden: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.7, ease },
    },
  };

  return (
    <section aria-labelledby="hero-title" className="mx-auto w-full max-w-6xl px-6 pt-10 pb-section sm:pt-16">
      <motion.div
        variants={grid}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:grid-rows-3 lg:gap-5"
      >
        {/* 1. Main introductory card */}
        <BentoCard
          variants={card}
          padding="lg"
          className="lg:col-span-2 lg:row-span-3"
          contentClassName="flex flex-col justify-between gap-12 lg:p-14"
        >
          <div className="flex flex-col gap-6">
            <span className="eyebrow">Senior UX Designer</span>

            <h1 id="hero-title" className="text-display-lg max-w-2xl">
              Designing systems, not just screens.
            </h1>

            <p className="max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              With ~5 years of product design experience, I translate complex business logic into
              seamless user experiences. Bridging system thinking, technical constraints, and
              product strategy.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Button href="/contact" variant="primary" size="lg">
              Let&apos;s Talk
            </Button>
            <Button href="/work" variant="outline" size="lg">
              View Works
            </Button>
          </div>
        </BentoCard>

        {/* 2. Location card */}
        <BentoCard
          variants={card}
          padding="md"
          radius="2xl"
          interactive
          className="lg:col-start-3"
          contentClassName="flex flex-col justify-between gap-6"
        >
          <IconBadge>
            <MapPin className="size-5" strokeWidth={1.5} aria-hidden />
          </IconBadge>
          <p className="text-base font-medium text-foreground">
            Based in Haarlem, Netherlands
          </p>
        </BentoCard>

        {/* 3. Availability card */}
        <BentoCard
          variants={card}
          padding="md"
          radius="2xl"
          interactive
          className="lg:col-start-3"
          contentClassName="flex flex-col justify-between gap-6"
        >
          <div className="flex size-10 items-center justify-center">
            <PulseDot animate={!reduceMotion} />
          </div>
          <p className="text-base font-medium text-foreground">Available for new projects</p>
        </BentoCard>

        {/* 4. Mindset card */}
        <BentoCard
          variants={card}
          padding="md"
          radius="2xl"
          interactive
          className="lg:col-start-3"
          contentClassName="flex flex-col justify-between gap-6"
        >
          <IconBadge>
            <Workflow className="size-5" strokeWidth={1.5} aria-hidden />
          </IconBadge>
          <div className="flex flex-col gap-1.5">
            <h2 className="text-base font-semibold">System Thinker</h2>
            <p className="text-sm leading-relaxed text-muted">
              Exploring mechanisms, behavioral economics &amp; code.
            </p>
          </div>
        </BentoCard>
      </motion.div>
    </section>
  );
}

function IconBadge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex size-10 items-center justify-center rounded-full border border-hairline/10 bg-hairline/5 text-accent">
      {children}
    </span>
  );
}

function PulseDot({ animate }: { animate: boolean }) {
  return (
    <span aria-hidden className="relative flex size-3">
      {animate && (
        <motion.span
          className="absolute inset-0 rounded-full bg-emerald-400"
          initial={{ scale: 1, opacity: 0.6 }}
          animate={{ scale: 2.6, opacity: 0 }}
          transition={{ duration: 1.8, ease: "easeOut", repeat: Infinity }}
        />
      )}
      <span className="relative size-3 rounded-full bg-emerald-500 shadow-[0_0_12px_rgb(16_185_129/0.6)]" />
    </span>
  );
}
