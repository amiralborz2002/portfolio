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
    <>
      <div className="mx-auto w-full max-w-7xl px-6 pt-32 md:pt-40">
        <FeaturedWorks />
      </div>
      <ArchiveList />
    </>
  );
}
