"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import type { ComponentProps } from "react";

type Variant = "primary" | "outline" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap select-none " +
  "transition-colors duration-200 " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-black hover:brightness-110",
  outline:
    "border border-white/10 bg-white/5 text-white backdrop-blur-md " +
    "hover:border-white/20 hover:bg-white/10",
  ghost: "text-zinc-300 hover:bg-white/5 hover:text-white",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
};

const tap = { scale: 0.98 };

// Renders a Next.js <Link> with motion props, so internal navigation
// stays client-side and we never nest <a> inside <button>.
const MotionLink = motion.create(Link);

type BaseProps = {
  variant?: Variant;
  size?: Size;
};

type ButtonProps = BaseProps &
  HTMLMotionProps<"button"> & {
    href?: undefined;
  };

type LinkProps = BaseProps &
  Omit<ComponentProps<typeof MotionLink>, "href"> & {
    href: string;
  };

function styles(variant: Variant = "primary", size: Size = "md", className = "") {
  return [base, variants[variant], sizes[size], className].filter(Boolean).join(" ");
}

function isLink(props: ButtonProps | LinkProps): props is LinkProps {
  return typeof props.href === "string";
}

export function Button(props: ButtonProps | LinkProps) {
  if (isLink(props)) {
    const { variant, size, className, ...rest } = props;
    return <MotionLink whileTap={tap} className={styles(variant, size, className)} {...rest} />;
  }

  const { variant, size, className, ...rest } = props;
  return (
    <motion.button
      type="button"
      whileTap={tap}
      className={styles(variant, size, className)}
      {...rest}
    />
  );
}