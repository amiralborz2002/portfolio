"use client";

import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import { useId, useState } from "react";

import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const; // matches --ease-apple

const FAQS = [
  {
    q: "What's your current availability?",
    a: "I'm open to freelance projects, contract roles, and select full-time opportunities that align with my expertise in system design.",
  },
  {
    q: "Where are you based and what timezones do you work with?",
    a: "I'm based in Haarlem, Netherlands. I comfortably overlap with European and most global timezones for synchronous collaboration.",
  },
  {
    q: "Do you actually write production code?",
    a: "No. While I build prototypes in Python or Next.js to test logic, my core focus is delivering architecture, UI/UX, and business rules for your engineering team to implement seamlessly.",
  },
] as const;

export function FAQ() {
  // One answer open at a time keeps the list short and scannable.
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section
      aria-labelledby="faq-title"
      className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-12 md:gap-8"
    >
      <div className="md:col-span-4">
        {/* Sticky beside the answers on desktop; plain heading on mobile */}
        <div className="md:sticky md:top-28">
          <p className="eyebrow">FAQ</p>
          <h2 id="faq-title" className="mt-3 text-3xl font-bold text-white md:text-5xl">
            The Details.
          </h2>
        </div>
      </div>

      <div className="border-t border-white/10 md:col-span-8">
        {FAQS.map((item, i) => (
          <AccordionItem
            key={item.q}
            question={item.q}
            answer={item.a}
            isOpen={open === i}
            onToggle={() => setOpen((current) => (current === i ? null : i))}
          />
        ))}
      </div>
    </section>
  );
}

function AccordionItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduceMotion = !!useReducedMotion();
  const id = useId();
  const buttonId = `${id}-button`;
  const panelId = `${id}-panel`;

  return (
    <div className="border-b border-white/10">
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={isOpen}
          aria-controls={panelId}
          onClick={onToggle}
          className="group flex w-full items-center justify-between gap-6 py-6 text-left outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-4 focus-visible:ring-offset-background md:py-7"
        >
          <span
            className={cn(
              "text-lg font-medium transition-colors duration-300 md:text-xl",
              isOpen ? "text-white" : "text-zinc-300 group-hover:text-white",
            )}
          >
            {question}
          </span>
          <PlusMinus open={isOpen} />
        </button>
      </h3>

      <AnimatePresence initial={false}>
        {isOpen && (
          <m.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            key="panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { height: { duration: 0.45, ease }, opacity: { duration: 0.3, ease } }
            }
            className="overflow-hidden"
          >
            {/* Padding lives inside the measured box so height animates cleanly */}
            <p className="max-w-2xl pr-12 pb-7 text-base leading-relaxed text-zinc-400">{answer}</p>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/** A plus whose vertical bar rotates flat into a minus, turning orange when open. */
function PlusMinus({ open }: { open: boolean }) {
  return (
    <span
      aria-hidden
      className={cn(
        "relative flex size-9 shrink-0 items-center justify-center rounded-full border transition-colors duration-300",
        open
          ? "border-accent/50 bg-accent/10 text-accent"
          : "border-white/10 text-zinc-400 group-hover:border-white/25 group-hover:text-white",
      )}
    >
      <span className="absolute h-px w-3.5 rounded-full bg-current" />
      <m.span
        className="absolute h-3.5 w-px rounded-full bg-current"
        initial={false}
        animate={{ rotate: open ? 90 : 0 }}
        transition={{ duration: 0.35, ease }}
      />
    </span>
  );
}
