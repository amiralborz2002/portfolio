import type { Metadata } from "next";
import { Suspense } from "react";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutTestimonials } from "@/components/sections/about/AboutTestimonials";
import { FAQ } from "@/components/sections/about/FAQ";
import { ManifestoScroll } from "@/components/sections/about/ManifestoScroll";
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
      {/* Nothing here suspends: each boundary only lets React hydrate the below-the-fold
          sections as separate, interruptible chunks instead of one long main-thread task. */}
      <Suspense>
        <ManifestoScroll />
      </Suspense>
      <div className="mx-auto w-full max-w-7xl px-6 py-32">
        <Suspense>
          <WhyMeBento />
        </Suspense>
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
        <Suspense>
          <AboutTestimonials />
        </Suspense>
      </section>
      <div className="py-24 md:py-32">
        <Suspense>
          <FAQ />
        </Suspense>
      </div>
    </div>
  );
}
