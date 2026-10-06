"use client";

import { forwardRef, type ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  type HTMLMotionProps,
} from "framer-motion";
import { cn } from "@/lib/utils";

const paddings = {
  none: "p-0",
  md: "p-6 sm:p-8",
  lg: "p-8 sm:p-10",
} as const;

const radii = {
  "2xl": "rounded-2xl",
  "3xl": "rounded-3xl",
} as const;

export interface BentoCardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: ReactNode;
  /** Inner padding. Default "lg" (p-8 → p-10). */
  padding?: keyof typeof paddings;
  /** Corner radius. Default "3xl" for main Bento cards. */
  radius?: keyof typeof radii;
  /** Hover scale, brighter hairline and a cursor-following accent spotlight. */
  interactive?: boolean;
  /** Classes for the inner content wrapper (grid/flex layout of the card body). */
  contentClassName?: string;
}

const spring = { type: "spring", stiffness: 260, damping: 28, mass: 0.8 } as const;

export const BentoCard = forwardRef<HTMLDivElement, BentoCardProps>(function BentoCard(
  {
    children,
    className,
    contentClassName,
    padding = "lg",
    radius = "3xl",
    interactive = false,
    onPointerMove,
    ...props
  },
  ref,
) {
  const reduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-400);
  const mouseY = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(420px circle at ${mouseX}px ${mouseY}px, color-mix(in oklab, var(--color-accent) 12%, transparent), transparent 70%)`;

  return (
    <motion.div
      ref={ref}
      onPointerMove={(event) => {
        if (interactive) {
          const rect = event.currentTarget.getBoundingClientRect();
          mouseX.set(event.clientX - rect.left);
          mouseY.set(event.clientY - rect.top);
        }
        onPointerMove?.(event);
      }}
      whileHover={interactive && !reduceMotion ? { scale: 1.02 } : undefined}
      transition={spring}
      className={cn(
        // Material: translucent glass, ultra-thin hairline, soft ambient shadow
        "group relative isolate overflow-hidden",
        radii[radius],
        "border border-hairline/10 bg-surface/50 shadow-ambient backdrop-blur-xl",
        "transition-[border-color,box-shadow] duration-500 ease-apple",
        interactive && "hover:border-hairline/20 hover:shadow-ambient-lg",
        className,
      )}
      {...props}
    >
      {/* Top inner highlight — the "lit edge" of the glass */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      {interactive && (
        <motion.span
          aria-hidden
          style={{ background: spotlight }}
          className="pointer-events-none absolute inset-0 -z-10 opacity-0 transition-opacity duration-500 ease-apple group-hover:opacity-100"
        />
      )}

      <div className={cn("relative h-full", paddings[padding], contentClassName)}>{children}</div>
    </motion.div>
  );
});
