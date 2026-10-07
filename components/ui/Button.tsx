import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

/**
 * The one button standard for the whole app. Use <Button> where you can; when the
 * element has to stay custom (a raw <a>, a menu trigger), apply `buttonVariants()`.
 *
 * No "use client" and no motion: the press feedback is plain CSS, so this module
 * works from Server Components (e.g. app/not-found.tsx) as well as client ones.
 */

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg" | "none";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full whitespace-nowrap select-none " +
  "transition-all duration-300 ease-in-out active:scale-[0.98] " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background " +
  "disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-orange-500 text-black font-medium " +
    "hover:bg-orange-400 hover:shadow-[0_0_20px_rgba(249,115,22,0.3)]",
  secondary:
    "bg-transparent border border-zinc-700 text-zinc-300 " +
    "hover:bg-zinc-800 hover:text-white hover:border-zinc-500",
  ghost: "text-zinc-400 bg-transparent hover:text-orange-400",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-sm",
  md: "h-11 px-6 text-sm",
  lg: "h-12 px-8 text-base",
  // Text-only buttons (e.g. ghost pagination) that sit flush with surrounding content.
  none: "",
};

export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, variants[variant], sizes[size], className);
}

type BaseProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

type ButtonProps = BaseProps & ComponentProps<"button"> & { href?: undefined };
type LinkProps = BaseProps & Omit<ComponentProps<typeof Link>, "href"> & { href: string };

function isLink(props: ButtonProps | LinkProps): props is LinkProps {
  return typeof props.href === "string";
}

export function Button(props: ButtonProps | LinkProps) {
  if (isLink(props)) {
    const { variant, size, className, ...rest } = props;
    return <Link className={buttonVariants({ variant, size, className })} {...rest} />;
  }

  const { variant, size, className, type = "button", ...rest } = props;
  return <button type={type} className={buttonVariants({ variant, size, className })} {...rest} />;
}
