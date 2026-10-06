"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Fragment, useState, useSyncExternalStore, type ReactNode } from "react";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

const EMAIL = "amiralborz2002@gmail.com";
const PHONE_DISPLAY = "+98 938 816 3359";
const PHONE_HREF = "tel:+989388163359";

/** Shared entrance: fade + rise, or fade only when motion is reduced. */
function rise(delay: number, reduceMotion: boolean) {
  return {
    initial: reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease },
  };
}

// True on devices with a real hover (mouse / trackpad). Server snapshot assumes
// hover so the preview starts hidden and never flashes on desktop.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";
function subscribeHover(onChange: () => void) {
  const mql = window.matchMedia(HOVER_QUERY);
  mql.addEventListener("change", onChange);
  return () => mql.removeEventListener("change", onChange);
}
function useCanHover() {
  return useSyncExternalStore(
    subscribeHover,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => true,
  );
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
            Let&apos;s build <span className="text-accent">systems</span> that work.
          </motion.h1>
          <motion.p
            {...rise(0.1, reduceMotion)}
            className="max-w-md text-base text-pretty text-zinc-400 sm:text-lg"
          >
            Skip the forms. Reach out directly for project inquiries, system architecture
            consulting, or just a virtual coffee.
          </motion.p>
        </div>

        <div className="flex min-w-0 flex-col gap-4 sm:gap-6 lg:col-span-7">
          <motion.div {...rise(0.2, reduceMotion)}>
            <EditorCard reduceMotion={reduceMotion} />
          </motion.div>
          <motion.div {...rise(0.3, reduceMotion)}>
            <TerminalCard reduceMotion={reduceMotion} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── Window chrome ───────────────────────────── */

const windowFrame =
  "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950/80 shadow-ambient-lg backdrop-blur-xl transition-[border-color,box-shadow] duration-500 ease-apple";

/** macOS-style title bar. Dots stay muted until the window is hovered. */
function TitleBar({ title, meta }: { title: ReactNode; meta?: ReactNode }) {
  const dots = ["group-hover:bg-[#ff5f57]", "group-hover:bg-[#febc2e]", "group-hover:bg-[#28c840]"];
  return (
    <div className="relative flex h-9 items-center border-b border-white/10 bg-white/[0.03] px-4 sm:h-10">
      <div aria-hidden className="flex gap-1.5">
        {dots.map((hover) => (
          <span
            key={hover}
            className={`size-3 rounded-full bg-white/20 transition-colors duration-300 ${hover}`}
          />
        ))}
      </div>
      <div className="absolute inset-x-0 flex justify-center font-mono text-xs text-zinc-400 pointer-events-none">
        {title}
      </div>
      {meta && <div className="ml-auto font-mono text-[10px] text-zinc-600">{meta}</div>}
    </div>
  );
}

/* ───────────────────────────── Card 1: IDE ───────────────────────────── */

// One token per span: [text, colour class].
type Token = readonly [string, string];
const P = "text-zinc-500"; // punctuation
const TAG = "text-blue-400";
const ATTR = "text-purple-400";
const STR = "text-orange-400";
const TEXT = "text-zinc-200";

const CODE: readonly (readonly Token[])[] = [
  [
    ["<", P],
    ["Button", TAG],
  ],
  [
    ["  variant", ATTR],
    ["=", P],
    ['"primary"', STR],
  ],
  [
    ["  action", ATTR],
    ["=", P],
    [`"mailto:${EMAIL}"`, STR],
  ],
  [[">", P]],
  [["  Say Hello", TEXT]],
  [
    ["</", P],
    ["Button", TAG],
    [">", P],
  ],
];

function EditorCard({ reduceMotion }: { reduceMotion: boolean }) {
  const canHover = useCanHover();
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  // Touch devices can't hover, so the preview simply stays open there.
  const showPreview = !canHover || hovered || focused;

  return (
    <div
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      className={`group ${windowFrame} hover:border-white/20 focus-within:border-white/20`}
    >
      <TitleBar
        title={
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-accent" aria-hidden />
            EmailClient.tsx
          </span>
        }
        meta="TSX"
      />

      <div className="relative">
        <pre
          aria-label={`React snippet: a primary button that opens mailto:${EMAIL}`}
          className="overflow-x-auto px-4 py-3 font-mono text-[11px] leading-[1.7] sm:px-5 sm:py-4 sm:text-sm"
        >
          <code>
            {CODE.map((line, i) => (
              <div key={i} className="flex">
                <span
                  aria-hidden
                  className="mr-4 hidden w-4 shrink-0 text-right text-zinc-600 select-none sm:inline-block sm:mr-5"
                >
                  {i + 1}
                </span>
                <span className="whitespace-pre">
                  {line.map(([text, color], j) => (
                    <span key={j} className={color}>
                      {text}
                    </span>
                  ))}
                </span>
              </div>
            ))}
          </code>
        </pre>

        {/* Live preview of the snippet, floating over the editor. */}
        <AnimatePresence>
          {showPreview && (
            <motion.div
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.98 }}
              transition={{ duration: 0.35, ease }}
              className="pointer-events-auto absolute right-3 bottom-2 z-10 flex items-center gap-2.5 rounded-full border border-white/15 bg-zinc-900/70 py-1 pr-1 pl-3.5 shadow-ambient-lg backdrop-blur-md sm:right-4 sm:bottom-3 sm:gap-3 sm:pl-4"
            >
              <p className="font-mono text-[9px] tracking-[0.18em] text-zinc-500 sm:text-[10px]">
                PREVIEW
              </p>
              <a
                href={`mailto:${EMAIL}`}
                className="group/btn inline-flex h-8 items-center gap-1.5 rounded-full bg-accent px-3.5 text-xs font-medium whitespace-nowrap text-accent-foreground shadow-glow transition-[filter,transform] duration-200 hover:brightness-110 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900 sm:h-9 sm:px-4 sm:text-sm"
              >
                Say Hello
                <ArrowUpRight
                  aria-hidden
                  className="size-4 transition-transform duration-300 ease-apple group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                />
              </a>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ───────────────────────────── Card 2: Terminal ───────────────────────────── */

function TerminalCard({ reduceMotion }: { reduceMotion: boolean }) {
  const lines: ReactNode[] = [
    <Fragment key="cmd">
      <span className="text-zinc-500">&gt; </span>
      <span className="text-blue-400">initiate_call</span>{" "}
      <span className="text-purple-400">--target</span>{" "}
      <span className="text-orange-400">&quot;{PHONE_DISPLAY}&quot;</span>
    </Fragment>,
    <Fragment key="wait">
      <span className="text-zinc-500">&gt; </span>
      <span className="text-zinc-400">establishing secure line...</span>
    </Fragment>,
    <span key="ok" className="text-green-400">
      ✓ Status: Ready to connect
    </span>,
  ];

  return (
    <motion.a
      href={PHONE_HREF}
      aria-label={`Call ${PHONE_DISPLAY}`}
      whileHover={reduceMotion ? undefined : { scale: 1.015 }}
      whileTap={reduceMotion ? undefined : { scale: 0.99 }}
      transition={{ duration: 0.3, ease }}
      className={`group block ${windowFrame} hover:border-green-400/30 hover:shadow-[0_0_0_1px_rgb(74_222_128/0.08),0_24px_60px_-24px_rgb(74_222_128/0.25)] focus-visible:border-green-400/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400/40`}
    >
      <TitleBar title="zsh — connection" meta="80×24" />

      <div className="overflow-x-auto px-4 py-3 font-mono text-[11px] leading-[1.7] sm:px-5 sm:py-4 sm:text-sm">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            className="whitespace-pre"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.01, delay: reduceMotion ? 0 : 0.7 + i * 0.35 }}
          >
            {line}
          </motion.div>
        ))}
        <motion.div
          aria-hidden
          className="flex items-center gap-2 whitespace-pre text-zinc-500"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.01, delay: reduceMotion ? 0 : 0.7 + lines.length * 0.35 }}
        >
          <span>&gt;</span>
          <span
            className={`inline-block h-[1.1em] w-[0.6em] bg-zinc-400 group-hover:bg-green-400 ${
              reduceMotion ? "" : "animate-caret-blink"
            }`}
          />
          <span className="text-zinc-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100">
            ↵ press to dial
          </span>
        </motion.div>
      </div>
    </motion.a>
  );
}
