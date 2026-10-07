import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { FAQ } from "@/components/sections/about/FAQ";
import { ManifestoScroll } from "@/components/sections/about/ManifestoScroll";
import { TestimonialsMasonry } from "@/components/sections/about/TestimonialsMasonry";
import { WhyMeBento } from "@/components/sections/about/WhyMeBento";

export const metadata: Metadata = {
  title: "About",
  description:
    "Amir Alborz — a Product Designer and System Thinker bridging user-centric craft with scalable logic.",
};

export default function AboutPage() {
  return (
    <div className="flex flex-col gap-24 pb-16 md:gap-32">
      <AboutHero />
      <ManifestoScroll />
      <div className="mx-auto w-full max-w-7xl px-6 py-32">
        <WhyMeBento />
      </div>
      <section
        aria-labelledby="about-testimonials-title"
        className="mx-auto w-full max-w-6xl px-6"
      >
        <h2
          id="about-testimonials-title"
          className="mb-16 text-center text-3xl font-bold text-white md:text-5xl"
        >
          Trusted by the best.
        </h2>
        <TestimonialsMasonry />
      </section>
      <div className="py-24 md:py-32">
        <FAQ />
      </div>
    </div>
  );
}
