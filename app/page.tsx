import { BentoSnapshot } from "@/components/sections/BentoSnapshot";
import { ExperienceJourney } from "@/components/sections/ExperienceJourney";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-16 md:gap-32">
      <Hero />
      <BentoSnapshot />
      <ExperienceJourney />
      <Testimonials />
      <FinalCTA />
    </div>
  );
}
