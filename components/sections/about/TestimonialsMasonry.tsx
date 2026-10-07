import { Quote } from "lucide-react";

import { TestimonialAvatar } from "@/components/ui/TestimonialAvatar";
import { testimonials } from "@/data/testimonials";

export function TestimonialsMasonry() {
  return (
    // CSS columns balance the varied quote lengths; cards never split across columns.
    <ul className="columns-1 gap-6 md:columns-2 lg:columns-3">
      {testimonials.map(({ id, content, name, role, avatar }) => (
        <li key={id} className="mb-6 inline-block h-auto w-full break-inside-avoid">
          <figure className="group flex flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-500 ease-apple hover:border-white/20">
            <Quote
              aria-hidden
              className="size-7 shrink-0 text-white/10 transition-colors duration-300 group-hover:text-accent/40"
              strokeWidth={1.5}
              fill="currentColor"
            />
            <blockquote className="mt-5 mb-8 text-base leading-relaxed text-zinc-300">
              <p className="line-clamp-none">&ldquo;{content}&rdquo;</p>
            </blockquote>
            <figcaption className="flex items-center gap-3 border-t border-white/5 pt-5">
              <TestimonialAvatar src={avatar} name={name} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="text-sm text-zinc-500">{role}</p>
              </div>
            </figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
