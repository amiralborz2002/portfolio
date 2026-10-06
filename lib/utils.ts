import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

/**
 * tailwind-merge must know our custom theme keys; otherwise it reads
 * `text-display-xl` as a text *color* and drops it next to `text-muted`.
 */
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["display-2xl", "display-xl", "display-lg", "title", "eyebrow"],
      shadow: ["ambient", "ambient-lg", "glow"],
    },
  },
});

/** Merge conditional class names and resolve Tailwind conflicts (last one wins). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
