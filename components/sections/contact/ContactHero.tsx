"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Mail, Phone, type LucideIcon } from "lucide-react";
import { useEffect, useRef, type PointerEvent as ReactPointerEvent } from "react";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

// Diameter of the cursor spotlight, in px.
const SPOTLIGHT_SIZE = 720;
// Max card tilt, in degrees.
const MAX_TILT = 10;
// Seconds between radar pulses; RADAR_RINGS rings share one cycle.
const RADAR_PERIOD = 3.6;
const RADAR_RINGS = 3;

const ACTIONS = [
  {
    href: "mailto:amiralborz2002@gmail.com",
    label: "Email",
    value: "amiralborz2002@gmail.com",
    badge: "Say Hello",
    icon: Mail,
  },
  {
    href: "tel:+989388163359",
    label: "Phone",
    value: "+98 938 816 3359",
    badge: "Call Now",
    icon: Phone,
  },
] as const satisfies readonly {
  href: string;
  label: string;
  value: string;
  badge: string;
  icon: LucideIcon;
}[];

/** Shared entrance: fade + rise, or fade only when motion is reduced. */
function rise(delay: number, reduceMotion: boolean) {
  return {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.9, delay, ease },
  };
}

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
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* Blueprint grid, drifting one cell diagonally on a loop and faded out at the edges. */}
      <motion.div
        aria-hidden
        animate={reduceMotion ? undefined : { backgroundPosition: ["0px 0px", "24px 24px"] }}
        transition={{ duration: 4, ease: "linear", repeat: Infinity }}
        className="pointer-events-none absolute inset-0 -z-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_40%,transparent_100%)]"
      />

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

      <motion.p
        {...rise(0, reduceMotion)}
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-xs uppercase tracking-[0.14em] text-zinc-400 backdrop-blur-md"
      >
        <span className="relative flex size-2">
          {!reduceMotion && (
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-75" />
          )}
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        Direct line open
      </motion.p>

      <motion.h1
        id="contact-title"
        {...rise(0.1, reduceMotion)}
        className="mb-4 text-center text-5xl font-bold tracking-tight text-balance text-white md:text-7xl"
      >
        Let&apos;s build{" "}
        <span className="bg-gradient-to-r from-orange-300 via-orange-500 to-amber-400 bg-clip-text text-transparent">
          systems
        </span>{" "}
        that work.
      </motion.h1>

      <motion.p {...rise(0.25, reduceMotion)} className="mb-16 text-center text-xl text-zinc-400">
        Skip the forms. Reach out directly.
      </motion.p>

      <motion.div
        {...rise(0.4, reduceMotion)}
        className="relative flex w-full max-w-lg flex-col gap-6 lg:w-auto lg:max-w-none lg:flex-row"
      >
        <Radar reduceMotion={reduceMotion} />
        {ACTIONS.map((action) => (
          <TiltCard key={action.href} {...action} reduceMotion={reduceMotion} />
        ))}
      </motion.div>
    </section>
  );
}

/** Concentric orange rings pulsing out from behind the cards. */
function Radar({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 size-64 -translate-x-1/2 -translate-y-1/2 md:size-80"
    >
      <div className="absolute inset-0 rounded-full bg-accent/10 blur-3xl" />
      {!reduceMotion &&
        Array.from({ length: RADAR_RINGS }, (_, i) => (
          <motion.span
            key={i}
            className="absolute inset-0 rounded-full border border-accent/60 shadow-[0_0_24px_rgb(249_115_22/0.35)_inset]"
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 2, 2], opacity: [0.5, 0, 0] }}
            transition={{
              duration: RADAR_PERIOD,
              times: [0, 0.75, 1],
              ease: "easeOut",
              repeat: Infinity,
              delay: (i * RADAR_PERIOD) / RADAR_RINGS,
            }}
          />
        ))}
    </div>
  );
}

function TiltCard({
  href,
  label,
  value,
  badge,
  icon: Icon,
  reduceMotion,
}: (typeof ACTIONS)[number] & { reduceMotion: boolean }) {
  // Pointer position inside the card: -0.5 … 0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 260, damping: 22, mass: 0.5 };
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), spring);

  // Glare that follows the pointer across the glass.
  const glareX = useTransform(px, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(py, [-0.5, 0.5], [0, 100]);
  const glare = useMotionTemplate`radial-gradient(360px circle at ${glareX}% ${glareY}%, rgb(249 115 22 / 0.16), transparent 70%)`;

  const onPointerMove = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    if (reduceMotion || event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.a
      href={href}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduceMotion ? undefined : { rotateX, rotateY, transformPerspective: 900 }}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className="group relative flex min-w-0 flex-col gap-6 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 hover:border-orange-500/50 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgb(249_115_22/0.25),0_0_48px_-8px_rgb(249_115_22/0.55)] focus-visible:border-orange-500/50 focus-visible:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 sm:p-8 md:px-12 md:py-8"
    >
      {/* Pointer glare */}
      <motion.span
        aria-hidden
        style={{ background: glare }}
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />

      <div className="relative flex items-center justify-between gap-3 sm:gap-6">
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors duration-300 group-hover:border-orange-500/40 group-hover:text-accent">
            <Icon className="size-[18px]" aria-hidden />
          </span>
          <span className="hidden text-eyebrow uppercase text-zinc-500 min-[360px]:inline">{label}</span>
        </span>

        <span className="inline-flex items-center gap-2">
          <span className="whitespace-nowrap rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent transition-all duration-300 ease-apple pointer-fine:translate-y-1 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-focus-visible:translate-y-0 pointer-fine:group-focus-visible:opacity-100">
            {badge}
          </span>
          <ShootingArrow />
        </span>
      </div>

      <span className="relative block truncate whitespace-nowrap font-mono text-base font-semibold tracking-tight text-white sm:text-lg md:text-2xl lg:text-3xl">
        {value}
      </span>
    </motion.a>
  );
}

/**
 * On hover the arrow fires off to the top-right while a fresh one slides in
 * from the bottom-left — a looped "send" gesture.
 */
function ShootingArrow() {
  return (
    <span
      aria-hidden
      className="relative inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors duration-300 group-hover:border-orange-500/50 group-hover:bg-accent group-hover:text-accent-foreground"
    >
      <ArrowUpRight className="size-4 transition-transform duration-500 ease-apple group-hover:translate-x-6 group-hover:-translate-y-6" />
      <ArrowUpRight className="absolute size-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-apple group-hover:translate-x-0 group-hover:translate-y-0" />
    </span>
  );
}
