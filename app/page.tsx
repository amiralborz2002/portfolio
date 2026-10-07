import { BentoSnapshot } from "@/components/sections/BentoSnapshot";
import { ExperienceJourney } from "@/components/sections/ExperienceJourney";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { Testimonials } from "@/components/sections/Testimonials";

export default function HomePage() {
  return (
    <div className="relative flex w-full flex-col gap-24 overflow-x-hidden pb-16 md:gap-32">
      <Hero />
      <BentoSnapshot />
      <ExperienceJourney />
      <section
        id="testimonials"
        aria-labelledby="testimonials-title"
        className="mx-auto w-full max-w-6xl px-6"
      >
        <div className="mb-16 text-center">
          <p className="text-xs font-medium tracking-widest text-zinc-500 uppercase">
            What others say
          </p>
          <h2 id="testimonials-title" className="mt-3 text-3xl font-bold text-white md:text-5xl">
            Trusted by teams I&apos;ve worked with.
          </h2>
        </div>
        <Testimonials limit={6} />
      </section>
      <FinalCTA />
    </div>
  );
}
