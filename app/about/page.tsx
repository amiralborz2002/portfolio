import type { Metadata } from "next";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { ManifestoScroll } from "@/components/sections/about/ManifestoScroll";

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
    </div>
  );
}
