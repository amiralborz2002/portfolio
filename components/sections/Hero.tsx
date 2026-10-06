"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { MapPin, Workflow } from "lucide-react";

import BentoCard from "../ui/BentoCard";
import Button from "../ui/Button";

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.05,
      },
    },
  };

  const item: Variants = {
    hidden: reduceMotion
      ? { opacity: 0 }
      : { opacity: 0, y: 24, scale: 0.97 },
    show: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-8 sm:px-6 md:pt-12 lg:pb-24">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4 lg:grid lg:grid-cols-3 lg:grid-rows-3 lg:gap-5"
      >
        {/* 1. Main introductory card */}
        <motion.div
          variants={item}
          className="lg:col-span-2 lg:row-span-3"
        >
          <BentoCard className="flex h-full flex-col justify-between gap-12 p-8 sm:p-10 lg:p-14">
            <div className="flex flex-col gap-6">
              <span className="eyebrow">Senior UX Designer</span>

              <h1 className="text-display-lg max-w-2xl text-balance">
                Designing systems, not just screens.
              </h1>

              <p className="text-muted max-w-xl text-base leading-relaxed sm:text-lg">
                With ~5 years of product design experience, I translate complex
                business logic into seamless user experiences. Bridging system
                thinking, technical constraints, and product strategy.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/contact" variant="primary">
                Let&apos;s Talk
              </Button>
              <Button href="/work" variant="outline">
                View Works
              </Button>
            </div>
          </BentoCard>
        </motion.div>

        {/* 2. Location card */}
        <motion.div variants={item} className="lg:col-start-3">
          <BentoCard className="flex h-full flex-col justify-between gap-6 p-6 sm:p-7">
            <MapPin
              className="h-5 w-5 text-accent"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <p className="text-sm font-medium sm:text-base">
              Based in Tehran, Iran
            </p>
          </BentoCard>
        </motion.div>

        {/* 3. Availability card */}
        <motion.div variants={item} className="lg:col-start-3">
          <BentoCard className="flex h-full flex-col justify-between gap-6 p-6 sm:p-7">
            <span className="relative flex h-3 w-3" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:animate-none" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <p className="text-sm font-medium sm:text-base">
              Available for new projects
            </p>
          </BentoCard>
        </motion.div>

        {/* 4. Mindset card */}
        <motion.div variants={item} className="lg:col-start-3">
          <BentoCard className="flex h-full flex-col justify-between gap-6 p-6 sm:p-7">
            <Workflow
              className="h-5 w-5 text-accent"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <div className="flex flex-col gap-1.5">
              <h2 className="text-sm font-semibold sm:text-base">
                System Thinker
              </h2>
              <p className="text-muted text-sm leading-relaxed">
                Exploring mechanisms, behavioral economics &amp; code.
              </p>
            </div>
          </BentoCard>
        </motion.div>
      </motion.div>
    </section>
  );
}