import type { ReactNode } from "react";

const iconProps = {
  width: 20,
  height: 20,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  "aria-hidden": true,
} as const;

type Social = { label: string; href: string; external?: boolean; icon: ReactNode };

const SOCIALS: Social[] = [
  {
    label: "Email",
    href: "mailto:amiralborz2002@gmail.com",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
  {
    label: "Phone",
    href: "tel:+989388163359",
    icon: (
      <svg {...iconProps}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/amiralborz2002/",
    external: true,
    icon: (
      <svg {...iconProps}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    ),
  },
  {
    label: "Dribbble",
    href: "https://dribbble.com/amiralborz2002",
    external: true,
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="10" />
        <path d="M8.56 2.75c4.37 6 6 9.42 8 17.72" />
        <path d="M19.13 5.09c-4.21 4.66-8.81 5.86-16.86 5.97" />
        <path d="M21.75 12.84c-6.62-1.41-12.14 1-16.38 6.32" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="mt-auto w-full border-t border-zinc-900 py-8">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 md:flex-row">
        <div className="whitespace-nowrap font-mono text-[10px] text-zinc-500 min-[375px]:text-xs md:text-sm">© 2026 Amir Alborz. All rights reserved.</div>

        {/* Icons sit above the copyright on mobile, on the right on desktop. */}
        <div className="order-first flex items-center gap-6 md:order-none">
          {SOCIALS.map(({ label, href, external, icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="text-zinc-500 transition-colors duration-300 hover:text-white"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
