"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect, useRef } from "react";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

// Diameter of the cursor spotlight, in px.
const SPOTLIGHT_SIZE = 720;

const ACTIONS = [
  {
    href: "mailto:amiralborz2002@gmail.com",
    label: "Email",
    value: "amiralborz2002@gmail.com",
    badge: "Say Hello",
  },
  {
    href: "tel:+989388163359",
    label: "Phone",
    value: "+98 938 816 3359",
    badge: "Call Now",
  },
] as const;

export function ContactHero() {
  const reduceMotion = !!useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);

  // Raw pointer position (relative to the section), smoothed by a spring so the
  // glow trails the cursor instead of snapping to it.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 120, damping: 24, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 120, damping: 24, mass: 0.6 });

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Start centred so touch devices (no pointermove) still get the glow.
    const rect = section.getBoundingClientRect();
    mouseX.jump(rect.width / 2);
    mouseY.jump(rect.height / 2);
    x.jump(rect.width / 2);
    y.jump(rect.height / 2);

    if (reduceMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      const bounds = section.getBoundingClientRect();
      mouseX.set(event.clientX - bounds.left);
      mouseY.set(event.clientY - bounds.top);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reduceMotion, mouseX, mouseY, x, y]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Cursor spotlight — transform-only, so it stays on the compositor. */}
      <motion.div
        aria-hidden
        style={{
          x,
          y,
          width: SPOTLIGHT_SIZE,
          height: SPOTLIGHT_SIZE,
          marginLeft: -SPOTLIGHT_SIZE / 2,
          marginTop: -SPOTLIGHT_SIZE / 2,
        }}
        className="pointer-events-none absolute left-0 top-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgb(249_115_22/0.18),transparent_65%)] blur-3xl will-change-transform"
      />

      <motion.h1
        id="contact-title"
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.1, ease }}
        className="mb-4 text-center text-5xl font-bold tracking-tight text-balance text-white md:text-7xl"
      >
        Let&apos;s build systems that work.
      </motion.h1>

      <motion.p
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.25, ease }}
        className="mb-16 text-center text-xl text-zinc-400"
      >
        Skip the forms. Reach out directly.
      </motion.p>

      <motion.div
        initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease }}
        className="flex w-full max-w-md flex-col gap-6 md:w-auto md:max-w-none md:flex-row"
      >
        {ACTIONS.map((action) => (
          <ActionCard key={action.href} {...action} reduceMotion={reduceMotion} />
        ))}
      </motion.div>
    </section>
  );
}

function ActionCard({
  href,
  label,
  value,
  badge,
  reduceMotion,
}: (typeof ACTIONS)[number] & { reduceMotion: boolean }) {
  return (
    <motion.a
      href={href}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group relative flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/10 focus-visible:border-white/20 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 md:px-12 md:py-8"
    >
      <div className="flex items-center justify-between gap-6">
        <span className="text-eyebrow uppercase text-zinc-500">{label}</span>
        <span className="inline-flex items-center gap-1 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-all duration-300 ease-apple md:translate-y-1 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:group-focus-visible:translate-y-0 md:group-focus-visible:opacity-100">
          {badge}
          <span
            aria-hidden
            className="inline-block transition-transform duration-300 ease-apple group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          >
            ↗
          </span>
        </span>
      </div>
      <span className="text-xl font-semibold tracking-tight break-all text-white sm:text-2xl md:text-3xl">
        {value}
      </span>
    </motion.a>
  );
}
