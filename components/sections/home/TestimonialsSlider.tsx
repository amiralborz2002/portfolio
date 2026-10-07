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
    <div role="region" aria-label="Testimonials">
      <ul
        ref={trackRef}
        className="hide-scrollbar flex snap-x snap-mandatory items-stretch gap-6 overflow-x-auto pb-8"
      >
        {items.map(({ id, content, name, role, avatar }) => (
          // Cards stretch to the tallest one in the row; long quotes are clamped.
          <li
            key={id}
            className="flex h-full min-w-[320px] shrink-0 basis-[320px] snap-center flex-col justify-between rounded-2xl border border-zinc-800 bg-zinc-900 p-6 md:min-w-[420px] md:basis-[420px] md:p-8"
          >
            <div>
              <Quote
                aria-hidden
                className="size-7 text-zinc-700"
                strokeWidth={1.5}
                fill="currentColor"
              />
              <p className="mt-5 line-clamp-6 text-base leading-relaxed text-zinc-300">
                &ldquo;{content}&rdquo;
              </p>
            </div>
            <div className="mt-8 flex items-center gap-3 border-t border-zinc-800 pt-5">
              <TestimonialAvatar src={avatar} name={name} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-white">{name}</p>
                <p className="truncate text-sm text-zinc-500">{role}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="flex justify-center gap-3">
        <ControlButton
          label="Previous testimonial"
          onClick={() => scrollByCard(-1)}
        >
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
      className="flex size-11 items-center justify-center rounded-full border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors duration-300 hover:border-zinc-600 hover:text-white"
    >
      {children}
    </button>
  );
}
