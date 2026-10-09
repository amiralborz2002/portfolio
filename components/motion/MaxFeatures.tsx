"use client";

import { domMax, LazyMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Adds drag and layout (layoutId) support for the `m.*` components inside it. Only the
 * components that need those features import this, so routes without them never ship them.
 */
export function MaxFeatures({ children }: { children: ReactNode }) {
  return <LazyMotion features={domMax}>{children}</LazyMotion>;
}
