import { BentoSnapshot } from "@/components/sections/BentoSnapshot";
import { Hero } from "@/components/sections/Hero";

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 md:gap-32 pb-24">
      <Hero />
      <BentoSnapshot />
    </div>
  );
}
