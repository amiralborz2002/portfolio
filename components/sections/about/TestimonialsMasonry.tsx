import { Quote } from "lucide-react";

import { TestimonialAvatar } from "@/components/ui/TestimonialAvatar";
import { testimonials } from "@/data/testimonials";

export function TestimonialsMasonry() {
  return (
    // CSS columns balance the varied quote lengths; cards never split across columns.
    <ul className="columns-1 gap-6 md:columns-2 lg:columns-3">
      {testimonials.map(({ id, content, name, role, avatar }) => (
        <li
          key={id}
          className="mb-6 inline-block w-full break-inside-avoid rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:p-8"
        >
          <Quote
            aria-hidden
            className="size-7 text-zinc-700"
            strokeWidth={1.5}
            fill="currentColor"
          />
          <p className="mt-5 text-base leading-relaxed text-zinc-300">
            &ldquo;{content}&rdquo;
          </p>
          <div className="mt-8 flex items-center gap-3 border-t border-zinc-800 pt-5">
            <TestimonialAvatar src={avatar} name={name} />
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{name}</p>
              <p className="text-sm text-zinc-500">{role}</p>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
