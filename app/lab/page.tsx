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
      <section className="mx-auto max-w-7xl px-6 pt-12 min-[400px]:pt-16 md:pt-32 pb-16">
        <h1 className="mb-6 break-words font-mono text-3xl font-bold tracking-tight text-white min-[400px]:text-4xl md:text-5xl">
          {/* nbsp keeps the prompt on the path; <wbr> breaks at the slash, not mid-word. */}
          &gt;&nbsp;/lab/<wbr />experiments<span className="animate-pulse">_</span>
        </h1>
        <p className="max-w-2xl font-mono text-lg leading-relaxed text-zinc-400">
          This is not my design portfolio. This is where I build fast and break things on
          purpose: automations, internal tools, Python scripts, system teardowns that actually ship.
        </p>
      </section>
      <LabGrid />
    </div>
  );
}
