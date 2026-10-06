"use client";

import {
  AnimatePresence,
  motion,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { ArrowUpRight, Check, Copy, Mail, Phone, type LucideIcon } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState, type RefObject } from "react";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

// Radius of the blueprint flashlight, in px.
const FLASHLIGHT_RADIUS = 280;
// Diameter of the soft orange glow that rides with the flashlight, in px.
const GLOW_SIZE = 720;
// Max card tilt, in degrees.
const MAX_TILT = 6;
// Cards start pulling toward the cursor within this many px of their edge…
const MAGNET_RANGE = 120;
// …and never travel further than this many px.
const MAGNET_MAX = 14;
// Seconds between radar pulses; RADAR_RINGS rings share one cycle.
const RADAR_PERIOD = 3.6;
const RADAR_RINGS = 3;
// Cipher decode timing.
const SCRAMBLE_MS = 300;
const SCRAMBLE_CHARS = "!X@#$8&%*?/<>=+01ABCDEFZ";
const COPIED_MS = 1600;

const ACTIONS = [
  {
    kind: "email",
    label: "Email",
    value: "amiralborz2002@gmail.com",
    copy: "amiralborz2002@gmail.com",
    href: "mailto:amiralborz2002@gmail.com",
    openLabel: "Write an email",
    icon: Mail,
  },
  {
    kind: "phone",
    label: "Phone",
    value: "+98 938 816 3359",
    copy: "+989388163359",
    href: "tel:+989388163359",
    openLabel: "Call now",
    icon: Phone,
  },
] as const satisfies readonly {
  kind: string;
  label: string;
  value: string;
  copy: string;
  href: string;
  openLabel: string;
  icon: LucideIcon;
}[];

const HEADLINE = ["Let's", "build", "systems", "that", "work."] as const;
const ACCENT_WORD = "systems";

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

  // Pointer position relative to the section, smoothed so the light trails
  // the cursor instead of snapping to it.
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const x = useSpring(mouseX, { stiffness: 140, damping: 24, mass: 0.6 });
  const y = useSpring(mouseY, { stiffness: 140, damping: 24, mass: 0.6 });

  // Until a mouse shows up (touch, pen, or no movement yet) the flashlight
  // sweeps a slow figure-eight on its own so the blueprint is still discovered.
  const hasMouse = useRef(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    for (const v of [mouseX, x]) v.jump(rect.width / 2);
    for (const v of [mouseY, y]) v.jump(rect.height / 2);

    if (reduceMotion) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      hasMouse.current = true;
      const bounds = section.getBoundingClientRect();
      mouseX.set(event.clientX - bounds.left);
      mouseY.set(event.clientY - bounds.top);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => window.removeEventListener("pointermove", onPointerMove);
  }, [reduceMotion, mouseX, mouseY, x, y]);

  useAnimationFrame((time) => {
    const section = sectionRef.current;
    if (reduceMotion || hasMouse.current || !section) return;
    const { width, height } = section.getBoundingClientRect();
    const t = time / 1000;
    mouseX.set(width / 2 + Math.sin(t * 0.45) * width * 0.32);
    mouseY.set(height * 0.55 + Math.sin(t * 0.9) * height * 0.22);
  });

  const mask = useMotionTemplate`radial-gradient(circle ${FLASHLIGHT_RADIUS}px at ${x}px ${y}px, #000 0%, rgb(0 0 0 / 0.55) 45%, transparent 100%)`;

  return (
    <section
      ref={sectionRef}
      aria-labelledby="contact-title"
      className="relative isolate flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-24"
    >
      {/* Blueprint — only visible inside the flashlight. */}
      <motion.div
        aria-hidden
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <Blueprint reduceMotion={reduceMotion} />
      </motion.div>

      {/* Warm glow riding with the flashlight — transform-only, stays on the compositor. */}
      <motion.div
        aria-hidden
        style={{
          x,
          y,
          width: GLOW_SIZE,
          height: GLOW_SIZE,
          marginLeft: -GLOW_SIZE / 2,
          marginTop: -GLOW_SIZE / 2,
        }}
        className="pointer-events-none absolute left-0 top-0 -z-10 rounded-full bg-[radial-gradient(circle_at_center,rgb(249_115_22/0.14),transparent_65%)] blur-3xl will-change-transform"
      />

      {!reduceMotion && <CursorReadout x={x} y={y} />}

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

      <Headline reduceMotion={reduceMotion} />

      <motion.p {...rise(0.35, reduceMotion)} className="mb-16 text-center text-xl text-zinc-400">
        Skip the forms. Reach out directly.
      </motion.p>

      <motion.div
        {...rise(0.5, reduceMotion)}
        className="relative flex w-full max-w-lg flex-col gap-6 lg:w-auto lg:max-w-none lg:flex-row"
      >
        <Radar reduceMotion={reduceMotion} />
        {ACTIONS.map((action) => (
          <ContactCard key={action.kind} {...action} reduceMotion={reduceMotion} />
        ))}
      </motion.div>
    </section>
  );
}

/* ───────────────────────────── Background ───────────────────────────── */

/** Dense dot grid + circuit traces + a slowly turning mechanism at the centre. */
function Blueprint({ reduceMotion }: { reduceMotion: boolean }) {
  const id = useId();
  const circuit = `${id}-circuit`;

  return (
    <>
      <div className="absolute inset-0 bg-[radial-gradient(rgb(255_255_255/0.22)_1px,transparent_1px)] bg-[size:14px_14px]" />

      <svg className="absolute inset-0 size-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id={circuit} width="168" height="168" patternUnits="userSpaceOnUse">
            <g fill="none" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              {/* Traces */}
              <path d="M0 28h42l14 14h56l14-14h42" stroke="rgb(249 115 22 / 0.55)" />
              <path d="M28 0v56l14 14v42l-14 14v42" stroke="rgb(255 255 255 / 0.28)" />
              <path d="M98 168v-42l14-14h28l14-14V56" stroke="rgb(249 115 22 / 0.4)" />
              <path d="M0 140h56l14-14h28" stroke="rgb(255 255 255 / 0.22)" />
              <path d="M126 0v14l-14 14" stroke="rgb(255 255 255 / 0.22)" />
              {/* Chip */}
              <rect x="70" y="70" width="28" height="28" rx="3" stroke="rgb(249 115 22 / 0.6)" />
              <path
                d="M76 70v-5m8 5v-5m8 5v-5M76 98v5m8-5v5m8-5v5M70 76h-5m5 8h-5m5 8h-5M98 76h5m-5 8h5m-5 8h5"
                stroke="rgb(249 115 22 / 0.45)"
              />
            </g>
            {/* Nodes / vias */}
            <g fill="#09090b" strokeWidth="1">
              <circle cx="42" cy="28" r="3" stroke="rgb(249 115 22 / 0.8)" />
              <circle cx="126" cy="28" r="3" stroke="rgb(249 115 22 / 0.8)" />
              <circle cx="28" cy="56" r="2.5" stroke="rgb(255 255 255 / 0.5)" />
              <circle cx="28" cy="126" r="2.5" stroke="rgb(255 255 255 / 0.5)" />
              <circle cx="154" cy="56" r="3" stroke="rgb(249 115 22 / 0.7)" />
              <circle cx="98" cy="126" r="2.5" stroke="rgb(255 255 255 / 0.5)" />
              <circle cx="56" cy="140" r="2.5" stroke="rgb(255 255 255 / 0.5)" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${circuit})`} />
      </svg>

      {/* Mechanism: dashed concentric rings and a crosshair. */}
      <div className="absolute left-1/2 top-1/2 size-[min(120vw,960px)] -translate-x-1/2 -translate-y-1/2">
        <svg viewBox="0 0 400 400" className="absolute inset-0 size-full" fill="none">
          <path d="M0 200h400M200 0v400" stroke="rgb(255 255 255 / 0.12)" strokeDasharray="2 6" />
          <circle cx="200" cy="200" r="110" stroke="rgb(255 255 255 / 0.18)" />
          <circle cx="200" cy="200" r="190" stroke="rgb(255 255 255 / 0.1)" />
        </svg>
        <svg
          viewBox="0 0 400 400"
          fill="none"
          className={`absolute inset-0 size-full ${reduceMotion ? "" : "animate-[spin_80s_linear_infinite]"}`}
        >
          <circle cx="200" cy="200" r="150" stroke="rgb(249 115 22 / 0.45)" strokeDasharray="1 7" strokeWidth="3" />
          <circle cx="200" cy="200" r="72" stroke="rgb(249 115 22 / 0.35)" strokeDasharray="18 10" />
        </svg>
      </div>
    </>
  );
}

/** Tiny HUD that trails the cursor with its coordinates (mouse users only). */
function CursorReadout({ x, y }: { x: MotionValue<number>; y: MotionValue<number> }) {
  const xText = useTransform(x, (v) => `X ${String(Math.max(0, Math.round(v))).padStart(4, "0")}`);
  const yText = useTransform(y, (v) => `Y ${String(Math.max(0, Math.round(v))).padStart(4, "0")}`);

  return (
    <motion.div
      aria-hidden
      style={{ x, y }}
      className="pointer-events-none absolute left-0 top-0 -z-10 hidden translate-x-6 translate-y-6 gap-2 font-mono text-[10px] tracking-[0.14em] text-accent/70 pointer-fine:flex"
    >
      <motion.span>{xText}</motion.span>
      <motion.span>{yText}</motion.span>
    </motion.div>
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

/* ───────────────────────────── Headline ───────────────────────────── */

/** Words rise in, then ride a slow wave; "systems" carries a moving gradient. */
function Headline({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <h1
      id="contact-title"
      className="mb-4 text-center text-5xl font-bold tracking-tight text-balance text-white md:text-7xl"
    >
      {HEADLINE.map((word, i) => {
        const accent = word === ACCENT_WORD;
        return (
          <span key={word}>
            <motion.span
              className="inline-block"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 32, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.9, delay: 0.1 + i * 0.08, ease }}
            >
              <motion.span
                className={
                  accent
                    ? "inline-block bg-[linear-gradient(90deg,#fdba74,#f97316,#fbbf24,#f97316,#fdba74)] bg-[length:200%_100%] bg-clip-text pb-1 text-transparent"
                    : "inline-block"
                }
                animate={
                  reduceMotion
                    ? undefined
                    : {
                        y: [0, -6, 0],
                        ...(accent && { backgroundPosition: ["0% 50%", "200% 50%"] }),
                      }
                }
                transition={
                  reduceMotion
                    ? undefined
                    : {
                        y: {
                          duration: 2.4,
                          ease: "easeInOut",
                          repeat: Infinity,
                          repeatDelay: 2.4,
                          delay: 1.4 + i * 0.16,
                        },
                        backgroundPosition: { duration: 6, ease: "linear", repeat: Infinity },
                      }
                }
              >
                {word}
              </motion.span>
            </motion.span>
            {i < HEADLINE.length - 1 && " "}
          </span>
        );
      })}
    </h1>
  );
}

/* ───────────────────────────── Cards ───────────────────────────── */

/** Scrambles `text` through random glyphs, resolving left to right over SCRAMBLE_MS. */
function useScramble(text: string, enabled: boolean) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);

  const run = useCallback(() => {
    if (!enabled) return;
    cancelAnimationFrame(frame.current);
    const start = performance.now();
    let last = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / SCRAMBLE_MS, 1);
      if (progress === 1) {
        setDisplay(text);
        return;
      }
      // ~30 fps is plenty for glyph flicker and keeps renders cheap.
      if (now - last > 32) {
        last = now;
        const locked = Math.floor(progress * text.length);
        setDisplay(
          Array.from(text, (char, i) =>
            i < locked || char === " "
              ? char
              : SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)],
          ).join(""),
        );
      }
      frame.current = requestAnimationFrame(tick);
    };

    frame.current = requestAnimationFrame(tick);
  }, [enabled, text]);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  return [display, run] as const;
}

/** Card magnetism toward a nearby cursor, plus a gentle tilt while over it. */
function useMagnet(ref: RefObject<HTMLElement | null>, enabled: boolean) {
  const spring = { stiffness: 220, damping: 20, mass: 0.6 };
  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const x = useSpring(tx, spring);
  const y = useSpring(ty, spring);
  const rotateX = useSpring(rx, spring);
  const rotateY = useSpring(ry, spring);

  useEffect(() => {
    const el = ref.current;
    if (!el || !enabled) return;

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      // Measure the untransformed layout box so the pull doesn't feed back on itself.
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2 - x.get();
      const cy = rect.top + rect.height / 2 - y.get();
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const outsideX = Math.max(0, Math.abs(dx) - rect.width / 2);
      const outsideY = Math.max(0, Math.abs(dy) - rect.height / 2);
      const gap = Math.hypot(outsideX, outsideY);

      if (gap > MAGNET_RANGE) {
        tx.set(0);
        ty.set(0);
        rx.set(0);
        ry.set(0);
        return;
      }

      const strength = 1 - gap / MAGNET_RANGE;
      const clamp = (v: number) => Math.max(-MAGNET_MAX, Math.min(MAGNET_MAX, v));
      tx.set(clamp(dx * 0.08 * strength));
      ty.set(clamp(dy * 0.12 * strength));

      const inside = gap === 0;
      rx.set(inside ? (-dy / (rect.height / 2)) * MAX_TILT : 0);
      ry.set(inside ? (dx / (rect.width / 2)) * MAX_TILT : 0);
    };

    const reset = () => {
      tx.set(0);
      ty.set(0);
      rx.set(0);
      ry.set(0);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", reset);
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      document.documentElement.removeEventListener("pointerleave", reset);
    };
  }, [ref, enabled, tx, ty, rx, ry, x, y]);

  return { x, y, rotateX, rotateY };
}

async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Older browsers / insecure contexts: fall back to a hidden textarea.
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    area.remove();
    return ok;
  }
}

function ContactCard({
  label,
  value,
  copy,
  href,
  openLabel,
  icon: Icon,
  reduceMotion,
}: (typeof ACTIONS)[number] & { reduceMotion: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const magnet = useMagnet(cardRef, !reduceMotion);
  const [display, scramble] = useScramble(value, !reduceMotion);
  const [copied, setCopied] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(copiedTimer.current), []);

  const onCopy = async () => {
    const ok = await copyToClipboard(copy);
    if (!ok) {
      // Clipboard unavailable entirely — the direct action is the next best thing.
      window.location.href = href;
      return;
    }
    scramble();
    setCopied(true);
    clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <motion.div
      ref={cardRef}
      onPointerEnter={(e) => e.pointerType === "mouse" && scramble()}
      style={reduceMotion ? undefined : { ...magnet, transformPerspective: 900 }}
      whileHover={reduceMotion ? undefined : { scale: 1.02 }}
      whileTap={reduceMotion ? undefined : { scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 28 }}
      className={`group relative flex min-w-0 flex-col gap-6 overflow-hidden rounded-3xl border bg-white/5 p-5 backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-300 hover:border-orange-500/50 hover:bg-white/10 hover:shadow-[0_0_0_1px_rgb(249_115_22/0.25),0_0_48px_-8px_rgb(249_115_22/0.55)] has-[:focus-visible]:border-orange-500/50 has-[:focus-visible]:bg-white/10 sm:p-8 md:px-12 md:py-8 ${
        copied ? "border-orange-500/60" : "border-white/10"
      }`}
    >
      {/* The whole card copies; it sits under the content so the open link stays clickable. */}
      <button
        type="button"
        onClick={onCopy}
        onFocus={scramble}
        aria-label={`Copy ${label.toLowerCase()}: ${value}`}
        className="absolute inset-0 z-0 cursor-copy rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent/60"
      />

      <div className="pointer-events-none relative flex items-center justify-between gap-3 sm:gap-6">
        <span className="inline-flex items-center gap-3">
          <span className="inline-flex size-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-zinc-300 transition-colors duration-300 group-hover:border-orange-500/40 group-hover:text-accent">
            <Icon className="size-[18px]" aria-hidden />
          </span>
          <span className="hidden text-eyebrow uppercase text-zinc-500 min-[360px]:inline">
            {label}
          </span>
        </span>

        <span className="inline-flex items-center gap-2">
          <CopyBadge copied={copied} />
          <OpenLink href={href} label={openLabel} />
        </span>
      </div>

      <span
        aria-hidden
        className="pointer-events-none relative block overflow-hidden text-ellipsis whitespace-nowrap font-mono text-base font-semibold tracking-tight text-white min-[360px]:text-lg md:text-2xl lg:text-3xl"
      >
        {display}
      </span>

      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </motion.div>
  );
}

/** The ↗ sub-button: opens the mail client / dialer directly. */
function OpenLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="pointer-events-auto relative z-10 inline-flex size-9 items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 text-zinc-300 transition-colors duration-300 group-hover:border-orange-500/50 group-hover:text-accent hover:border-orange-500! hover:bg-accent hover:text-accent-foreground! focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
    >
      {/* On card hover the arrow fires off top-right while a fresh one slides in. */}
      <ArrowUpRight
        aria-hidden
        className="size-4 transition-transform duration-500 ease-apple group-hover:-translate-y-6 group-hover:translate-x-6"
      />
      <ArrowUpRight
        aria-hidden
        className="absolute size-4 -translate-x-6 translate-y-6 transition-transform duration-500 ease-apple group-hover:translate-x-0 group-hover:translate-y-0"
      />
    </a>
  );
}

/** "Click to copy" hint (revealed on hover for mouse users) that flips to an orange "Copied!". */
function CopyBadge({ copied }: { copied: boolean }) {
  return (
    <span className="relative inline-flex">
      <AnimatePresence mode="popLayout" initial={false}>
        {copied ? (
          <motion.span
            key="copied"
            initial={{ opacity: 0, y: 10, scale: 0.85, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -10, scale: 0.9, filter: "blur(4px)" }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-orange-500/50 bg-accent/15 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.1em] text-accent shadow-glow"
          >
            <motion.span
              initial={{ scale: 0, rotate: -45 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 600, damping: 18, delay: 0.05 }}
              className="inline-flex"
            >
              <Check className="size-3" strokeWidth={3} aria-hidden />
            </motion.span>
            Copied!
          </motion.span>
        ) : (
          <motion.span
            key="hint"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease }}
            className="inline-flex"
          >
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-white/10 bg-white/5 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.1em] text-zinc-400 transition-all duration-300 ease-apple pointer-fine:translate-y-1 pointer-fine:opacity-0 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-has-[:focus-visible]:translate-y-0 pointer-fine:group-has-[:focus-visible]:opacity-100">
              <Copy className="size-3" aria-hidden />
              <span className="pointer-fine:hidden">Tap</span>
              <span className="hidden pointer-fine:inline">Click</span> to copy
            </span>
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
