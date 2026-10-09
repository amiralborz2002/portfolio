import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

/**
 * Drop-in for Framer Motion's `useReducedMotion`. Framer's hook reads the media query during the
 * very first client render, so for reduced-motion users that render differs from the static HTML
 * and React throws a hydration error. Here hydration uses the server value (`false`) and the real
 * preference applies on the render right after.
 */
export function useReducedMotion() {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
