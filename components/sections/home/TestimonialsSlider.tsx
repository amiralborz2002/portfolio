"use client";

import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRef, type ReactNode } from "react";

import { TestimonialAvatar } from "@/components/ui/TestimonialAvatar";
import { testimonials } from "@/data/testimonials";

const items = testimonials.slice(0, 6);

export function TestimonialsSlider() {
  const trackRef = useRef<HTMLUListElement>(null);

  // Scroll by one card (plus the gap); snapping lines it up afterwards.
  const scrollByCard = (dir: 1 | -1) => {
    const track = trackRef.current;
    const card = track?.firstElementChild as HTMLElement | null;
    if (!track || !card) return;
    track.scrollBy({ left: dir * (card.offsetWidth + 24), behavior: "smooth" });
  };

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Testimonials">
      <ul
        ref={trackRef}
        className="hide-scrollbar flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-8"
      >
        {items.map(({ id, content, name, role, avatar }) => (
          // Cards stretch to the tallest one in the row; long quotes are clamped.
          <li
            key={id}
            className="flex h-full min-w-[320px] shrink-0 basis-[320px] snap-center flex-col md:min-w-[400px] md:basis-[400px]"
          >
            <figure className="group flex flex-1 flex-col rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md transition-colors duration-500 ease-apple hover:border-white/20">
              <Quote
                aria-hidden
                className="size-7 shrink-0 text-white/10 transition-colors duration-300 group-hover:text-accent/40"
                strokeWidth={1.5}
                fill="currentColor"
              />
              <blockquote className="mt-5 mb-8 text-base leading-relaxed text-zinc-300">
                <p className="line-clamp-6">&ldquo;{content}&rdquo;</p>
              </blockquote>
              <figcaption className="mt-auto flex items-center gap-3 border-t border-white/5 pt-5">
                <TestimonialAvatar src={avatar} name={name} />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white">{name}</p>
                  <p className="truncate text-sm text-zinc-500">{role}</p>
                </div>
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-3">
        <ControlButton label="Previous testimonial" onClick={() => scrollByCard(-1)}>
          <ChevronLeft className="size-5" strokeWidth={1.75} />
        </ControlButton>
        <ControlButton label="Next testimonial" onClick={() => scrollByCard(1)}>
          <ChevronRight className="size-5" strokeWidth={1.75} />
        </ControlButton>
      </div>
    </div>
  );
}

function ControlButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-zinc-300 backdrop-blur-md transition-colors duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white"
    >
      {children}
    </button>
  );
}
