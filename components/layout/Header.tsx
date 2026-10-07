"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../ui/Button";
import { MobileMenu } from "./MobileMenu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Work", href: "/work" },
  { label: "Lab", href: "/lab" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
] as const;

export function Header() {
  const pathname = usePathname();
  // Home matches only itself; other sections stay lit on their sub-pages (e.g. /work/[slug]).
  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));

  return (
    <header className="sticky top-0 z-[100] border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6 md:grid md:grid-cols-[1fr_auto_1fr]">
        {/* Logo / name */}
        <Link
          href="/"
          className="text-base font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-full"
        >
          Amir Alborz
        </Link>

        {/* Desktop links */}
        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(href) ? "page" : undefined}
              className={`rounded-full px-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                isActive(href)
                  ? "font-medium text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Primary CTA — always visible, on every breakpoint */}
        <div className="flex items-center gap-2 justify-self-end">
          <Button
            href="/contact"
            size="sm"
            aria-current={isActive("/contact") ? "page" : undefined}
            className="shadow-glow"
          >
            Get in touch
          </Button>

          <MobileMenu />
        </div>
      </div>

    </header>
  );
}
