import { Suspense } from "react";
import { BentoSnapshot } from "@/components/sections/BentoSnapshot";
import { ExperienceJourney } from "@/components/sections/ExperienceJourney";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <div className="relative flex w-full flex-col gap-24 overflow-x-hidden pb-16 md:gap-32">
      <Hero />
      {/* Nothing here suspends: each boundary only lets React hydrate the below-the-fold
          sections as separate, interruptible chunks instead of one long main-thread task. */}
      <Suspense>
        <BentoSnapshot />
      </Suspense>
      <Suspense>
        <ExperienceJourney />
      </Suspense>
      <Suspense>
        <Testimonials />
      </Suspense>
      <Suspense>
        <FinalCTA />
      </Suspense>
    </div>
  );
}
