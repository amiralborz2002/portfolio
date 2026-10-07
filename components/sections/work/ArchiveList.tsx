"use client";

import { useState } from "react";
import Link from "next/link";

type ArchiveLinkType = "internal" | "external" | "nda" | "offline";

type ArchiveEntry = {
  id: number;
  year: string;
  title: string;
  type: string;
  // The outcome, readable at a glance without opening the project.
  impact: string;
  linkType: ArchiveLinkType;
  // Route for "internal", URL for "external"; empty for "nda" and "offline".
  href: string;
};

// Newest first. The header's index count and timeline are derived from this list.
const archiveData: ArchiveEntry[] = [
  { id: 1, year: "2025", title: "E-Commerce Redesign", type: "E-Commerce", impact: "Increased mobile conversion by 25%", linkType: "internal", href: "/work/ecommerce-redesign" },
  { id: 2, year: "2025", title: "Tab Organizer", type: "Chrome Extension", impact: "4.8★ rating across 10k+ weekly users", linkType: "external", href: "https://example.com" },
  { id: 3, year: "2024", title: "Fintech Dashboard", type: "SaaS Dashboard", impact: "Reduced data entry errors by 40%", linkType: "nda", href: "" },
  { id: 4, year: "2024", title: "Editorial Platform", type: "CMS", impact: "Halved time-to-publish for the content team", linkType: "nda", href: "" },
  { id: 5, year: "2023", title: "Corporate Landing", type: "Marketing Site", impact: "Award-winning visual identity", linkType: "external", href: "https://example.com" },
  { id: 6, year: "2023", title: "Analytics Workspace", type: "SaaS Dashboard", impact: "Cut weekly reporting from hours to minutes", linkType: "internal", href: "/work/analytics-workspace" },
  { id: 7, year: "2022", title: "Restaurant Ordering App", type: "E-Commerce", impact: "Cut average checkout time in half", linkType: "offline", href: "" },
  { id: 8, year: "2022", title: "Internal CRM", type: "SaaS Dashboard", impact: "Unified three legacy tools into one workflow", linkType: "nda", href: "" },
  { id: 9, year: "2021", title: "Headless Blog", type: "CMS", impact: "Lighthouse performance score from 52 to 98", linkType: "offline", href: "" },
];

const PAGE_SIZE = 5;

const years = archiveData.map((item) => Number(item.year));
const INDEX = String(archiveData.length).padStart(3, "0");
const TIMELINE = `${Math.min(...years)} - ${Math.max(...years)}`;

const ACTION_LABEL: Record<ArchiveLinkType, string> = {
  internal: "Read Case Study →",
  external: "Live Site ↗",
  nda: "🔒 NDA",
  offline: "Offline",
};

function ArchiveRowContent({ item, clickable }: { item: ArchiveEntry; clickable: boolean }) {
  const hover = clickable ? "transition-colors group-hover:text-orange-400 group-focus-visible:text-orange-400" : "";

  return (
    <div className="flex w-full flex-col justify-between border-b border-zinc-800/50 py-6 md:flex-row md:items-center">
      <div className="flex w-full flex-col gap-4 md:w-2/3 md:flex-row md:items-center md:gap-12">
        <span className="w-12 shrink-0 font-mono text-sm text-zinc-500">{item.year}</span>
        <div>
          <h3 className={`text-lg font-medium text-white ${hover}`}>{item.title}</h3>
          <p className="mt-1 text-sm text-zinc-400">{item.impact}</p>
        </div>
      </div>
      <div className="mt-4 flex w-full items-center justify-between gap-4 md:mt-0 md:w-1/3">
        <span className="text-sm text-zinc-500">{item.type}</span>
        <span
          className={`whitespace-nowrap font-mono text-xs uppercase tracking-wider ${clickable ? `text-zinc-300 ${hover}` : "text-zinc-600"}`}
        >
          {ACTION_LABEL[item.linkType]}
        </span>
      </div>
    </div>
  );
}

const rowClass = "group block outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 rounded-sm";

function ArchiveRow({ item }: { item: ArchiveEntry }) {
  switch (item.linkType) {
    case "internal":
      return (
        <Link href={item.href} className={rowClass}>
          <ArchiveRowContent item={item} clickable />
        </Link>
      );
    case "external":
      return (
        <a href={item.href} target="_blank" rel="noopener noreferrer" className={rowClass}>
          <ArchiveRowContent item={item} clickable />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      );
    case "nda":
    case "offline":
      return (
        <div className="group">
          <ArchiveRowContent item={item} clickable={false} />
        </div>
      );
  }
}

export function ArchiveList() {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visibleItems = archiveData.slice(0, visibleCount);

  return (
    <section aria-labelledby="archive-title" className="mx-auto mb-32 mt-32 max-w-7xl px-6">
      <header className="mb-12 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-8 font-mono text-sm text-zinc-500 md:flex-row md:items-center">
        <h2 id="archive-title" className="text-zinc-300">
          [ THE ARCHIVE ]
        </h2>
        <p>
          {`INDEX: ${INDEX} // TIMELINE: ${TIMELINE} // STATUS: LOGGED`}
        </p>
      </header>

      <ul>
        {visibleItems.map((item) => (
          <li key={item.id}>
            <ArchiveRow item={item} />
          </li>
        ))}
      </ul>

      {visibleCount < archiveData.length && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
            className="py-8 font-mono text-sm uppercase text-zinc-500 transition-colors hover:text-white focus-visible:text-white"
          >
            Load More ({archiveData.length - visibleCount})
          </button>
        </div>
      )}
    </section>
  );
}
