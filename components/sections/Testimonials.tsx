import { Quote } from "lucide-react";

import { cn } from "@/lib/utils";

export type Testimonial = {
  quote: string;
  name: string;
  /** Role and company, e.g. "Head of Product · Karo" */
  role: string;
  /** Optional link to the original LinkedIn recommendation or profile */
  href?: string;
};

/*
 * PLACEHOLDER CONTENT — replace each entry with a real LinkedIn
 * recommendation (quote, name, role) before publishing. Add or remove
 * objects freely; the grid adapts.
 */
export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Amir took a service catalogue that had grown into hundreds of overlapping categories and turned it into a structure our users and our database could both understand. Engineering estimates dropped the moment the architecture docs landed.",
    name: "Recommender Name",
    role: "Product Lead · Company",
  },
  {
    quote:
      "A rare designer who reads the business logic before opening Figma. Our pricing rules, currency conversions and inventory edge cases were mapped into flows that developers could implement without a single follow-up meeting.",
    name: "Recommender Name",
    role: "Engineering Manager · Company",
  },
  {
    quote:
      "Collaborating with Amir felt like working with a systems engineer and a UX lead at once: the uncomfortable questions get asked early, every decision is documented, and the team is left with a shared language for complex problems.",
    name: "Recommender Name",
    role: "Senior Product Designer · Company",
  },
];

// One soft gradient per card so placeholder avatars don't look identical.
const AVATARS = [
  "from-orange-400/70 to-rose-500/40",
  "from-sky-400/60 to-indigo-500/40",
  "from-emerald-400/60 to-teal-600/40",
] as const;

export function Testimonials() {
  return (
    <section
      id="testimonials"
      aria-labelledby="testimonials-title"
      className="mx-auto w-full max-w-6xl px-6"
    >
      <div className="text-center">
        <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
          What others say
        </p>
        <h2
          id="testimonials-title"
          className="mt-3 mb-12 text-3xl font-bold text-white md:text-5xl"
        >
          Trusted by teams I&apos;ve worked with.
        </h2>
      </div>

      <ul className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {TESTIMONIALS.map((t, i) => (
          <li key={i}>
            <TestimonialCard testimonial={t} avatar={AVATARS[i % AVATARS.length]} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function TestimonialCard({
  testimonial: { quote, name, role, href },
  avatar,
}: {
  testimonial: Testimonial;
  avatar: string;
}) {
  const initials = name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <figure className="group flex h-full flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm transition-colors duration-300 hover:border-white/20 hover:bg-white/[0.07]">
      <Quote
        aria-hidden
        className="mb-6 size-8 text-white/10 transition-colors duration-300 group-hover:text-accent/40"
        strokeWidth={1.5}
        fill="currentColor"
      />

      <blockquote className="mb-8 text-base leading-relaxed text-zinc-300">
        <p>&ldquo;{quote}&rdquo;</p>
      </blockquote>

      <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-6">
        <span
          aria-hidden
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-xs font-semibold text-white/80 ring-1 ring-white/10",
            avatar,
          )}
        >
          {initials}
        </span>
        <div className="min-w-0">
          {href ? (
            <a href={href} target="_blank" rel="noreferrer" className="text-sm font-medium text-white hover:text-accent">
              {name}
            </a>
          ) : (
            <p className="text-sm font-medium text-white">{name}</p>
          )}
          <p className="text-sm text-zinc-500">{role}</p>
        </div>
      </figcaption>
    </figure>
  );
}
