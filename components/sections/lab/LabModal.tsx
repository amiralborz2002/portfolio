"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import {
  AnimatePresence,
  m,
  useDragControls,
  useReducedMotion,
  type PanInfo,
} from "framer-motion";
import { X } from "lucide-react";
import { MaxFeatures } from "@/components/motion/MaxFeatures";
import type { Experiment } from "./data";

type LabModalProps = {
  selectedItem: Experiment | null;
  onClose: () => void;
};

/** Tracks Tailwind's `md` breakpoint: below it the modal is a bottom sheet. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return isMobile;
}

// The mobile bottom sheet's swipe-to-dismiss needs the drag feature.
export function LabModal(props: LabModalProps) {
  return (
    <MaxFeatures>
      <LabModalWindow {...props} />
    </MaxFeatures>
  );
}

function LabModalWindow({ selectedItem, onClose }: LabModalProps) {
  const reduceMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const dragControls = useDragControls();
  const dialogRef = useRef<HTMLDivElement>(null);
  const isOpen = selectedItem !== null;

  // While open: Escape closes, the page behind stops scrolling, and focus moves into the
  // dialog and back to the card that opened it.
  useEffect(() => {
    if (!isOpen) return;
    const opener = document.activeElement as HTMLElement | null;
    const onKeyDown = (event: KeyboardEvent) => event.key === "Escape" && onClose();
    const previousOverflow = document.body.style.overflow;

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
      opener?.focus({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  // Swipe the sheet down far or fast enough and it dismisses, like a native sheet.
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.y > 120 || info.velocity.y > 500) onClose();
  };

  const duration = reduceMotion ? 0 : 0.2;
  // Mobile slides up from the bottom edge; desktop fades and scales in place.
  const hidden = isMobile && !reduceMotion ? { y: "100%" } : { opacity: 0, scale: reduceMotion ? 1 : 0.96 };
  const shown = isMobile ? { y: 0 } : { opacity: 1, scale: 1 };
  const windowTransition = isMobile && !reduceMotion
    ? { type: "spring", stiffness: 380, damping: 38 } as const
    : { duration, ease: "easeOut" } as const;

  // Portalled to <body> so no transformed ancestor can trap the fixed overlay. z-[110] clears
  // the sticky site header (z-[100]).
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {selectedItem && (
        <m.div
          key="lab-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration }}
          onClick={onClose}
          className="fixed inset-0 z-[110] flex items-end justify-center bg-black/80 backdrop-blur-sm md:items-center md:p-8"
        >
          <m.div
            ref={dialogRef}
            role="dialog"
            tabIndex={-1}
            aria-modal="true"
            aria-labelledby="lab-modal-title"
            initial={hidden}
            animate={shown}
            exit={hidden}
            transition={windowTransition}
            drag={isMobile ? "y" : false}
            dragListener={false}
            dragControls={dragControls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.6 }}
            onDragEnd={onDragEnd}
            onClick={(event) => event.stopPropagation()}
            className="mt-auto flex h-[95vh] w-full flex-col overflow-hidden rounded-t-3xl border border-b-0 border-zinc-800 bg-zinc-950 shadow-2xl outline-none max-md:fixed max-md:inset-x-0 max-md:bottom-0 md:mt-0 md:h-auto md:max-h-[90vh] md:max-w-6xl md:rounded-2xl md:border-b"
          >
            {/* The header doubles as the sheet's drag handle on mobile. */}
            <div
              onPointerDown={(event) => isMobile && dragControls.start(event)}
              className="relative flex w-full shrink-0 touch-none items-center justify-between border-b border-zinc-800 bg-zinc-900 px-4 py-3 max-md:pt-5 md:touch-auto"
            >
              <span
                aria-hidden="true"
                className="absolute left-1/2 top-2 h-1 w-10 -translate-x-1/2 rounded-full bg-zinc-700 md:hidden"
              />
              <div className="flex w-full min-w-0 items-center md:w-auto">
                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    onPointerDown={(event) => event.stopPropagation()}
                    aria-label="Close"
                    className="h-3 w-3 cursor-pointer rounded-full bg-red-500 transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/60"
                  />
                  <span aria-hidden="true" className="h-3 w-3 rounded-full bg-yellow-500" />
                  <span aria-hidden="true" className="h-3 w-3 rounded-full bg-green-500" />
                </div>
                <h2
                  id="lab-modal-title"
                  className="ml-auto min-w-0 truncate pl-4 font-mono text-xs text-zinc-400 md:ml-4 md:pl-0"
                >
                  {selectedItem.filename}
                </h2>
              </div>
              {/* Mobile closes via the red dot or a swipe down, so the X is desktop-only. */}
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="hidden shrink-0 rounded-md p-1 text-zinc-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 md:block"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* On small screens the whole body scrolls; on lg each pane scrolls on its own. */}
            <div className="flex flex-1 flex-col overflow-y-auto overscroll-contain lg:flex-row lg:overflow-hidden">
              <div className="border-b border-zinc-800 p-6 md:p-8 lg:w-1/3 lg:overflow-y-auto lg:border-b-0 lg:border-r">
                {selectedItem.sections.map((section) => (
                  <section key={section.title} className="mb-8 last:mb-0">
                    <div className="mb-2 font-mono text-xs uppercase text-zinc-500">{`// ${section.title}`}</div>
                    <p className="text-sm leading-relaxed text-zinc-300 md:text-base">{section.content}</p>
                  </section>
                ))}
              </div>

              <div className="flex flex-col bg-zinc-900 px-6 pb-12 pt-6 md:p-8 lg:w-2/3">
                <div className="mb-4 font-mono text-xs text-zinc-500">{"// OUTPUT_VIEWER"}</div>
                <div className="relative flex min-h-64 flex-1 items-center justify-center overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950 lg:min-h-96">
                  {selectedItem.media?.kind === "image" ? (
                    <Image
                      src={selectedItem.media.src}
                      alt={selectedItem.media.alt}
                      fill
                      sizes="(min-width: 1024px) 760px, 100vw"
                      className="object-contain"
                      unoptimized={selectedItem.media.src.endsWith(".gif")}
                    />
                  ) : selectedItem.media?.kind === "video" ? (
                    <video
                      src={selectedItem.media.src}
                      poster={selectedItem.media.poster}
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
          </m.div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
