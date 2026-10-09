"use client";

import { domAnimation, LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Every animated component renders `m.*` instead of `motion.*`, so the animation features
 * ship once from here rather than with each component. `domAnimation` covers animate, exit,
 * variants, whileHover/Tap/Focus/InView — everything except drag and layout animations,
 * which the few components that use them add through <MaxFeatures>.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
