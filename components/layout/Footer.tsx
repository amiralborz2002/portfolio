import { Mail, Globe, User } from "lucide-react";

const SOCIALS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/in/your-handle", Icon: User },
  { label: "GitHub", href: "https://github.com/your-handle", Icon: Globe },
  { label: "Email", href: "mailto:your@email.com", Icon: Mail },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-6 px-6 py-8 sm:flex-row">
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Amir Alborz. All rights reserved.
        </p>

        <ul className="flex items-center gap-2">
          {SOCIALS.map(({ label, href, Icon }) => (
            <li key={label}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <Icon className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}