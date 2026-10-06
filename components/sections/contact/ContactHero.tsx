"use client";

import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Copy, Mail, Phone, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState, type PointerEvent } from "react";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

// Magnetic feel: how far a card leans toward the cursor.
const MAX_SHIFT = 6; // px
const MAX_TILT = 4; // deg
const COPIED_MS = 1800;

const CHANNELS = [
  {
    id: "email",
    title: "Email",
    caption: "Project inquiries & consulting",
    value: "amiralborz2002@gmail.com",
    copy: "amiralborz2002@gmail.com",
    href: "mailto:amiralborz2002@gmail.com",
    openLabel: "Open Mail",
    icon: Mail,
  },
  {
    id: "phone",
    title: "Phone",
    caption: "Quick calls & virtual coffee",
    value: "+98 938 816 3359",
    copy: "+989388163359",
    href: "tel:+989388163359",
    openLabel: "Call Now",
    icon: Phone,
  },
] as const satisfies readonly {
  id: string;
  title: string;
  caption: string;
  value: string;
  copy: string;
  href: string;
  openLabel: string;
  icon: LucideIcon;
}[];

/** Shared entrance: fade + rise, or fade only when motion is reduced. */
function rise(delay: number, reduceMotion: boolean) {
  return {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  };
}

export function ContactHero() {
  const reduceMotion = !!useReducedMotion();

  return (
    <section
      aria-labelledby="contact-title"
      // Fills exactly the space between the sticky header (4rem + hairline) and
      // the footer (sm+: 6.5rem + hairline; below sm it stacks to ~9.25rem).
      className="flex min-h-[calc(100dvh-4rem-1px-9.25rem-1px)] items-center py-6 sm:min-h-[calc(100dvh-4rem-1px-6.5rem-1px)] sm:py-10"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-6 sm:gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <motion.h1
            id="contact-title"
            {...rise(0, reduceMotion)}
            className="mb-4 text-4xl font-bold tracking-tight text-balance text-white sm:mb-6 sm:text-5xl md:text-6xl"
          >
            Let&apos;s build systems that work.
          </motion.h1>
          <motion.p
            {...rise(0.1, reduceMotion)}
            className="max-w-md text-base text-pretty text-zinc-400 sm:text-lg"
          >
            Skip the forms. Reach out directly for project inquiries, system architecture
            consulting, or just a virtual coffee.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
          {CHANNELS.map((channel, i) => (
            <motion.div key={channel.id} {...rise(0.2 + i * 0.08, reduceMotion)} className="flex">
              <ContactCard {...channel} reduceMotion={reduceMotion} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
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
  title,
  caption,
  value,
  copy,
  href,
  openLabel,
  icon: Icon,
  reduceMotion,
}: (typeof CHANNELS)[number] & { reduceMotion: boolean }) {
  // Pointer position inside the card, -0.5 … 0.5 on each axis.
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 200, damping: 20, mass: 0.6 };
  const x = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_SHIFT, MAX_SHIFT]), spring);
  const y = useSpring(useTransform(py, [-0.5, 0.5], [-MAX_SHIFT, MAX_SHIFT]), spring);
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [MAX_TILT, -MAX_TILT]), spring);
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-MAX_TILT, MAX_TILT]), spring);

  // Soft accent light that follows the pointer across the glass.
  const lightX = useTransform(px, [-0.5, 0.5], [0, 100]);
  const lightY = useTransform(py, [-0.5, 0.5], [0, 100]);
  const light = useMotionTemplate`radial-gradient(420px circle at ${lightX}% ${lightY}%, color-mix(in oklab, var(--color-accent) 12%, transparent), transparent 70%)`;

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    px.set((event.clientX - rect.left) / rect.width - 0.5);
    py.set((event.clientY - rect.top) / rect.height - 0.5);
  };

  const onPointerLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.article
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={reduceMotion ? undefined : { x, y, rotateX, rotateY, transformPerspective: 1000 }}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className="group @container relative isolate flex w-full min-w-0 flex-col justify-between gap-3 overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-ambient backdrop-blur-xl transition-[border-color,background-color,box-shadow] duration-500 ease-apple hover:border-white/20 hover:bg-white/[0.07] hover:shadow-ambient-lg has-[:focus-visible]:border-white/20 sm:min-h-[280px] sm:gap-6 sm:p-8"
    >
      {/* Lit top edge of the glass */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />
      <motion.span
        aria-hidden
        style={{ background: light }}
        className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-apple group-hover:opacity-100"
      />

      {/* Top: icon + title */}
      <header className="flex items-center gap-3">
        <span className="inline-flex size-10 items-center justify-center rounded-2xl sm:size-11 border border-white/10 bg-white/5 text-zinc-300 transition-colors duration-500 ease-apple group-hover:border-accent/40 group-hover:text-accent">
          <Icon className="size-5" strokeWidth={1.75} aria-hidden />
        </span>
        <div>
          <h2 className="text-sm font-medium text-white">{title}</h2>
          <p className="hidden text-xs text-zinc-500 sm:block">{caption}</p>
        </div>
      </header>

      {/* Middle: the value — sized to the card's own width so it never wraps */}
      <p className="truncate text-[clamp(0.875rem,6.2cqi,1.75rem)] font-semibold tracking-tight text-white">
        {value}
      </p>

      {/* Bottom: dual action */}
      <div className="flex items-center gap-2 transition-[opacity,transform] duration-500 ease-apple pointer-fine:translate-y-1 pointer-fine:opacity-70 pointer-fine:group-hover:translate-y-0 pointer-fine:group-hover:opacity-100 pointer-fine:group-has-[:focus-visible]:translate-y-0 pointer-fine:group-has-[:focus-visible]:opacity-100">
        <CopyButton text={copy} label={title} reduceMotion={reduceMotion} />
        <a
          href={href}
          className="group/open inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium whitespace-nowrap text-zinc-300 transition-colors duration-300 hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {openLabel}
          <span aria-hidden className="relative inline-flex size-4 overflow-hidden">
            {/* The arrow fires off top-right while a fresh one slides in. */}
            <ArrowUpRight className="size-4 transition-transform duration-500 ease-apple group-hover/open:-translate-y-4 group-hover/open:translate-x-4" />
            <ArrowUpRight className="absolute inset-0 size-4 -translate-x-4 translate-y-4 text-accent transition-transform duration-500 ease-apple group-hover/open:translate-x-0 group-hover/open:translate-y-0" />
          </span>
        </a>
      </div>
    </motion.article>
  );
}

/** Copy pill: fills orange from the left, pops, and swaps to a drawn-in check. */
function CopyButton({
  text,
  label,
  reduceMotion,
}: {
  text: string;
  label: string;
  reduceMotion: boolean;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onClick = async () => {
    if (!(await copyToClipboard(text))) return;
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), COPIED_MS);
  };

  return (
    <>
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        animate={copied && !reduceMotion ? { scale: [1, 1.06, 1] } : { scale: 1 }}
        transition={{ duration: 0.35, ease }}
        aria-label={copied ? `${label} copied` : `Copy ${label.toLowerCase()} to clipboard`}
        className={`relative isolate inline-flex h-10 items-center gap-2 overflow-hidden rounded-full border px-4 text-sm font-medium whitespace-nowrap transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
          copied
            ? "border-accent text-accent-foreground"
            : "border-white/10 bg-white/5 text-white hover:border-white/20 hover:bg-white/10"
        }`}
      >
        {/* Orange fill that sweeps in from the left on copy. */}
        <motion.span
          aria-hidden
          initial={false}
          animate={{ clipPath: copied ? "inset(0 0% 0 0)" : "inset(0 100% 0 0)" }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease }}
          className="absolute inset-0 -z-10 bg-accent"
        />

        <span className="relative inline-flex size-4 items-center justify-center">
          <AnimatePresence mode="popLayout" initial={false}>
            {copied ? (
              <motion.svg
                key="check"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
              >
                <motion.path
                  d="M20 6 9 17l-5-5"
                  initial={{ pathLength: reduceMotion ? 1 : 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.35, delay: 0.1, ease }}
                />
              </motion.svg>
            ) : (
              <motion.span
                key="copy"
                className="inline-flex"
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.6, opacity: 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 24 }}
              >
                <Copy className="size-4" aria-hidden />
              </motion.span>
            )}
          </AnimatePresence>
        </span>

        {/* Fixed-width label slot so the pill doesn't jump between states. */}
        <span className="relative grid">
          <span aria-hidden className="invisible col-start-1 row-start-1">
            Copied!
          </span>
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={copied ? "copied" : "copy"}
              aria-hidden
              className="col-start-1 row-start-1"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease }}
            >
              {copied ? "Copied!" : "Copy"}
            </motion.span>
          </AnimatePresence>
        </span>
      </motion.button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? `${label} copied to clipboard` : ""}
      </span>
    </>
  );
}
