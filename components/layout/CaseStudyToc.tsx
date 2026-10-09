"use client";

import { m, MotionConfig } from "framer-motion";
import { useEffect, useState } from "react";
import { MaxFeatures } from "@/components/motion/MaxFeatures";

export type TocSection = { id: string; label: string };

// A section becomes active once its heading crosses this fraction of the viewport.
const ACTIVATION_LINE = 0.35;

// The sliding active dot is a shared-layout (layoutId) animation.
export function CaseStudyToc({ sections }: { sections: TocSection[] }) {
  return (
    <MaxFeatures>
      <TocNav sections={sections} />
    </MaxFeatures>
  );
}

function TocNav({ sections }: { sections: TocSection[] }) {
  const [activeId, setActiveId] = useState<string | undefined>(sections[0]?.id);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const line = window.innerHeight * ACTIVATION_LINE;
      let current: string | undefined = sections[0]?.id;
      for (const { id } of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= line) current = id;
      }
      // At the very bottom the last section may never reach the line — select it anyway.
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) {
        current = sections.at(-1)?.id;
      }
      setActiveId(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [sections]);

  return (
    <MotionConfig reducedMotion="user">
      <nav aria-label="On this page">
        <p className="mb-6 font-mono text-xs uppercase tracking-widest text-zinc-500">On this page</p>
        <ol className="space-y-4">
          {sections.map(({ id, label }, i) => {
            const active = id === activeId;
            return (
              <li key={id}>
                <a
                  href={`#${id}`}
                  aria-current={active ? "location" : undefined}
                  className={`group flex items-center gap-3 rounded text-sm outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-orange-400/70 ${
                    active ? "text-white" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  <span className="relative flex size-2 shrink-0 items-center justify-center">
                    {active && (
                      <m.span
                        layoutId="toc-active-dot"
                        className="absolute inset-0 rounded-full bg-orange-500 shadow-[0_0_10px_rgb(249_115_22/0.7)]"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                  </span>
                  <span className="font-mono">{String(i + 1).padStart(2, "0")} /</span>
                  <span>{label}</span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>
    </MotionConfig>
  );
}
