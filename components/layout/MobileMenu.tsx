"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, m, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";

const LINKS = [
  { num: "01", label: "Home", href: "/" },
  { num: "02", label: "Work", href: "/work" },
  { num: "03", label: "Lab", href: "/lab" },
  { num: "04", label: "About", href: "/about" },
  { num: "05", label: "Contact", href: "/contact" },
] as const;

const EASE = [0.22, 1, 0.36, 1] as const;

// The nav list staggers its children in, then the status footer lands last.
const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  exit: { transition: { staggerChildren: 0.04, staggerDirection: -1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2, ease: "easeIn" } },
};

const footerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { delay: 0.5, duration: 0.5 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

export function MobileMenu() {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();
  const [isOpen, setIsOpen] = useState(false);

  // While open: lock background scroll, close on Escape, and close if the viewport grows
  // past the `md` breakpoint (where this menu is hidden) so the scroll lock never sticks.
  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    const desktop = window.matchMedia("(min-width: 768px)");
    const onBreakpoint = () => desktop.matches && setIsOpen(false);

    window.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [isOpen]);

  // Home matches only itself; other sections stay lit on their sub-pages (e.g. /work/[slug]).
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
  const lineTransition = { duration: reduceMotion ? 0 : 0.3, ease: EASE };

  return (
    <>
      {/* Hamburger ↔ X: the two lines meet at the centre and rotate into a cross. */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-controls="mobile-menu"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="relative z-[60] inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-white transition-colors hover:bg-white/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent md:hidden"
      >
        <span className="relative block h-3 w-5" aria-hidden="true">
          <m.span
            className="absolute left-0 top-0 h-px w-full origin-center bg-current"
            initial={false}
            animate={isOpen ? { top: "50%", rotate: 45 } : { top: "0%", rotate: 0 }}
            transition={lineTransition}
          />
          <m.span
            className="absolute bottom-0 right-0 h-px origin-center bg-current"
            initial={false}
            animate={
              isOpen
                ? { bottom: "50%", rotate: -45, width: "100%" }
                : { bottom: "0%", rotate: 0, width: "60%" }
            }
            transition={lineTransition}
          />
        </span>
      </button>

      {/* Portalled to <body> so the header's backdrop-filter can't trap the fixed overlay.
          z-50 sits beneath the sticky header (z-[100]), keeping the logo and toggle visible. */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <m.div
                id="mobile-menu"
                key="mobile-menu"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.3, ease: "easeOut" }}
                className="fixed inset-0 z-50 flex h-[100dvh] flex-col overflow-y-auto bg-zinc-950/95 px-8 pt-16 backdrop-blur-2xl md:hidden"
              >
                <m.nav
                  aria-label="Mobile"
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="flex flex-1 flex-col justify-center py-8"
                >
                  {LINKS.map((link) => {
                    const active = isActive(link.href);
                    return (
                      <m.div key={link.href} variants={itemVariants}>
                        <Link
                          href={link.href}
                          onClick={() => setIsOpen(false)}
                          aria-current={active ? "page" : undefined}
                          className="group mb-8 flex w-fit items-baseline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                          <span
                            className={`mr-4 font-mono text-sm transition-transform group-hover:-translate-x-2 md:text-base ${
                              active ? "text-orange-400" : "text-zinc-500"
                            }`}
                          >
                            {"// "}
                            {link.num}
                          </span>
                          <span
                            className={`text-4xl font-bold transition-colors min-[400px]:text-5xl ${
                              active ? "text-white" : "text-zinc-500 group-hover:text-zinc-300"
                            }`}
                          >
                            {link.label}
                          </span>
                        </Link>
                      </m.div>
                    );
                  })}
                </m.nav>

                <m.div
                  variants={footerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mb-8 mt-auto flex justify-between border-t border-zinc-800 pt-8 font-mono text-xs text-zinc-500"
                >
                  <span>STATUS: ONLINE</span>
                  <span>SYS_V1.0</span>
                </m.div>
              </m.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
