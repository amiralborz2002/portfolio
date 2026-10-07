import type { Metadata } from "next";
import { ArchiveList } from "@/components/sections/work/ArchiveList";
import { FeaturedWorks } from "@/components/sections/work/FeaturedWorks";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Selected case studies — design systems, cloud platforms and product experiences by Amir Alborz.",
};

export default function WorkPage() {
  return (
    // One root element: Next.js scrolls a navigated page's first DOM node into view, and with a
    // Fragment it could target the Archive section instead of the top of the page.
    <div>
      <div className="mx-auto w-full max-w-7xl px-6 pt-32 md:pt-40">
        <FeaturedWorks />
      </div>
      <ArchiveList />
    </div>
  );
}
