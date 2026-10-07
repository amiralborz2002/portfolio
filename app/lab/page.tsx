import type { Metadata } from "next";
import { LabGrid } from "@/components/sections/lab/LabGrid";

export const metadata: Metadata = {
  title: "Lab",
  description:
    "A workbench of automations, internal tools, Python scripts and system teardowns by Amir Alborz.",
};

export default function LabPage() {
  return (
    // One root element so navigation scrolls to the top of the page, as on /work.
    <div>
      <section className="mx-auto max-w-7xl px-6 pt-32 pb-16">
        <h1 className="mb-6 font-mono text-4xl font-bold text-white md:text-5xl">
          &gt; /lab/experiments<span className="animate-pulse">_</span>
        </h1>
        <p className="max-w-2xl font-mono text-lg leading-relaxed text-zinc-400">
          This is not my design portfolio. This is a workbench for automations, internal tools,
          Python scripts, and system teardowns. Dirty code, but highly functional multipliers.
        </p>
      </section>
      <LabGrid />
    </div>
  );
}
