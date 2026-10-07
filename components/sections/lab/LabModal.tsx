"use client";

import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";
import type { Experiment } from "./data";

type LabModalProps = {
  item: Experiment | null;
  onClose: () => void;
};

export function LabModal({ item, onClose }: LabModalProps) {
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = item !== null;

  // While open: Escape closes, the page behind stops scrolling, and focus moves into the
  // dialog and back to the card that opened it.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus();
    };
  }, [isOpen, onClose]);

  const duration = reduceMotion ? 0 : 0.2;

  // Portalled to <body> so no transformed ancestor can trap the fixed overlay. z-[110] clears
  // the sticky site header (z-[100]).
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {item && (
        <motion.div
          key="lab-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          onClick={onClose}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm md:p-8"
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="lab-modal-title"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration, ease: "easeOut" }}
            onClick={(event) => event.stopPropagation()}
            className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-2xl"
          >
            <div className="relative flex shrink-0 items-center border-b border-zinc-800 bg-zinc-900 px-4 py-2.5">
              <div className="flex gap-1.5" aria-hidden="true">
                <span className="h-3 w-3 rounded-full bg-red-500/80" />
                <span className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <span className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <h2
                id="lab-modal-title"
                className="absolute left-1/2 max-w-[60%] -translate-x-1/2 truncate font-mono text-xs text-zinc-400"
              >
                {item.filename}
              </h2>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="ml-auto rounded-md p-1 text-zinc-500 transition-colors hover:bg-zinc-800 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* On small screens the whole body scrolls; on lg each pane scrolls on its own. */}
            <div className="flex flex-1 flex-col overflow-y-auto lg:flex-row lg:overflow-hidden">
              <div className="space-y-8 border-b border-zinc-800 p-8 lg:w-1/3 lg:overflow-y-auto lg:border-r lg:border-b-0">
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Bottleneck
                  </h3>
                  <p className="leading-relaxed text-zinc-400">{item.bottleneck}</p>
                </section>
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    The Fix
                  </h3>
                  <p className="font-medium leading-relaxed text-white">{item.fix}</p>
                </section>
                <section>
                  <h3 className="mb-2 text-xs font-semibold uppercase tracking-widest text-zinc-500">
                    Outcome
                  </h3>
                  <p className="text-lg font-medium leading-relaxed text-orange-400">{item.outcome}</p>
                </section>
              </div>

              <div className="flex flex-col bg-zinc-900 p-8 lg:w-2/3">
                <div className="mb-4 font-mono text-xs text-zinc-500">{"// OUTPUT_VIEWER"}</div>
                <div className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 lg:min-h-96">
                  {item.media?.kind === "image" ? (
                    <Image
                      src={item.media.src}
                      alt={item.media.alt}
                      fill
                      sizes="(min-width: 1024px) 760px, 100vw"
                      className="object-contain"
                      unoptimized={item.media.src.endsWith(".gif")}
                    />
                  ) : item.media?.kind === "video" ? (
                    <video
                      src={item.media.src}
                      poster={item.media.poster}
                      className="h-full w-full object-contain"
                      autoPlay
                      muted
                      loop
                      playsInline
                      controls
                    />
                  ) : (
                    <span className="px-4 text-center font-mono text-sm text-zinc-600">
                      [ Media Render: Image / MP4 / GIF ]
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
