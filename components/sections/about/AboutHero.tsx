"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

type PersonaId = "designer" | "thinker";

const PERSONAS = {
  designer: {
    title: ["Product", "Designer"],
    body: "Crafting intuitive, user-centric interfaces and seamless digital experiences.",
  },
  thinker: {
    title: ["System", "Thinker"],
    body: "Architecting scalable logic, bridging business goals with technical constraints.",
  },
} as const satisfies Record<PersonaId, { title: readonly string[]; body: string }>;

/** Shared entrance: fade + rise, or fade only when motion is reduced. */
function rise(delay: number, reduceMotion: boolean) {
  return {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  };
}

// Feathers the portrait into the page background on every edge.
const PORTRAIT_MASK = "radial-gradient(ellipse closest-side at 50% 45%, #000 55%, transparent 100%)";

export function AboutHero() {
  const reduceMotion = !!useReducedMotion();
  const [active, setActive] = useState<PersonaId | null>(null);

  return (
    <section
      aria-labelledby="about-hero-title"
      className="relative mx-auto flex min-h-[calc(100svh-4rem)] w-full max-w-6xl flex-col items-center justify-center gap-10 px-6 pt-8 pb-20 lg:grid lg:min-h-[90vh] lg:grid-cols-3 lg:gap-8 lg:py-16"
    >
      <h1 id="about-hero-title" className="sr-only">
        About Amir Alborz — Product Designer and System Thinker
      </h1>

      <Persona
        id="designer"
        align="left"
        active={active}
        onActivate={setActive}
        reduceMotion={reduceMotion}
        delay={0.2}
      />

      <motion.div
        {...rise(0, reduceMotion)}
        // Image leads on mobile; sits in the middle column on desktop.
        className="relative order-first w-full max-w-sm lg:order-none lg:max-w-none"
      >
        {/* Accent glow drifts toward whichever persona is in focus */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-x-[10%] top-[15%] bottom-[20%] -z-10 rounded-full bg-accent/15 blur-[90px]"
          animate={{
            x: reduceMotion || !active ? 0 : active === "designer" ? "-12%" : "12%",
            opacity: active ? 1 : 0.6,
          }}
          transition={{ duration: 0.8, ease }}
        />
        <Portrait />
      </motion.div>

      <Persona
        id="thinker"
        align="right"
        active={active}
        onActivate={setActive}
        reduceMotion={reduceMotion}
        delay={0.3}
      />
    </section>
  );
}

function Portrait() {
  const [failed, setFailed] = useState(false);

  return (
    <div
      className="relative aspect-[4/5] w-full"
      style={{ maskImage: PORTRAIT_MASK, WebkitMaskImage: PORTRAIT_MASK }}
    >
      {/* Fallback shown until /public/about-me.jpg exists */}
      <div
        aria-hidden
        className="absolute inset-0 flex items-center justify-center bg-gradient-to-b from-surface-raised via-surface to-background"
      >
        <span className="text-display-xl text-white/10">AA</span>
      </div>

      {!failed && (
        <Image
          src="/about-me.jpg"
          alt="Amir Alborz"
          fill
          preload
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 24rem, 90vw"
          className="object-cover object-top grayscale-[15%]"
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}

type PersonaProps = {
  id: PersonaId;
  align: "left" | "right";
  active: PersonaId | null;
  onActivate: (id: PersonaId | null) => void;
  reduceMotion: boolean;
  delay: number;
};

function Persona({ id, align, active, onActivate, reduceMotion, delay }: PersonaProps) {
  const { title, body } = PERSONAS[id];
  const isActive = active === id;
  const isDimmed = active !== null && !isActive;
  const shift = align === "left" ? 8 : -8;

  // Touch taps would leave a sticky "hover"; only real pointers drive the effect.
  const handleEnter = (event: PointerEvent) => {
    if (event.pointerType === "mouse" || event.pointerType === "pen") onActivate(id);
  };

  return (
    // Outer layer runs the entrance; inner layer reacts to the active persona.
    <motion.div {...rise(delay, reduceMotion)} className="w-full">
      <motion.div
        tabIndex={0}
        onPointerEnter={handleEnter}
        onPointerLeave={() => onActivate(null)}
        onFocus={() => onActivate(id)}
        onBlur={() => onActivate(null)}
        animate={{
          opacity: isDimmed ? 0.3 : 1,
          x: isActive && !reduceMotion ? shift : 0,
        }}
        transition={{ duration: 0.5, ease }}
        className={cn(
          "rounded-2xl text-center outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-8 focus-visible:ring-offset-background",
          align === "left" ? "lg:text-left" : "lg:text-right",
        )}
      >
        <h2 className="text-[clamp(2.75rem,12vw,4.5rem)] leading-[0.92] font-bold tracking-tighter text-white lg:text-[clamp(2.75rem,4.6vw,4.75rem)]">
          {title.map((line, i) => (
            <span
              key={line}
              className={cn("block", i === 1 && isActive && "text-accent transition-colors")}
            >
              {line}
            </span>
          ))}
        </h2>
        <p
          className={cn(
            "mx-auto mt-5 max-w-xs text-base text-balance text-zinc-400 md:text-lg lg:mt-6",
            align === "left" ? "lg:mx-0" : "lg:ml-auto lg:mr-0",
          )}
        >
          {body}
        </p>
      </motion.div>
    </motion.div>
  );
}
