import { BentoSnapshot } from "@/components/sections/BentoSnapshot";
import { ExperienceJourney } from "@/components/sections/ExperienceJourney";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 pb-32 md:gap-32">
      <Hero />
      <BentoSnapshot />
      <ExperienceJourney />
    </div>
  );
}
