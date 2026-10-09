"use client";

import { useState } from "react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/Button";

type ArchiveLinkType = "internal" | "external" | "nda" | "offline";

type ArchiveEntry = {
  id: number;
  year: string;
  title: string;
  type: string;
  linkType: ArchiveLinkType;
  // Route for "internal", URL for "external"; empty for "nda" and "offline".
  href: string;
};

// Newest first. The header's index count and timeline are derived from this list.
const archiveData: ArchiveEntry[] = [
  { id: 1, year: "2025", title: "Philanthropic Campaign", type: "Donation Landing Page", linkType: "offline", href: "" },
  { id: 2, year: "2024", title: "Nikaro EdTech", type: "Platform Redesign", linkType: "offline", href: "" },
  { id: 3, year: "2024", title: "Insurance Exhibition Kiosk", type: "InsurTech Landing", linkType: "offline", href: "" },
  { id: 4, year: "2024", title: "Healthcare Logistics App", type: "Delivery Flow Redesign", linkType: "offline", href: "" },
  { id: 5, year: "2023", title: "Logestica", type: "Corporate Website Redesign", linkType: "offline", href: "" },
  { id: 6, year: "2023", title: "Enterprise ERP", type: "Interface Redesign", linkType: "offline", href: "" },
  { id: 7, year: "2023", title: "Escape Room Marketplace", type: "Web Application", linkType: "offline", href: "" },
  { id: 8, year: "2023", title: "Excoino Referral Gateway", type: "FinTech Landing Page", linkType: "offline", href: "" },
  { id: 9, year: "2023", title: "Traders' Copilot", type: "Chrome Extension", linkType: "offline", href: "" },
  { id: 10, year: "2023", title: "Enterprise Internal CMS", type: "Back-office Tool", linkType: "offline", href: "" },
  { id: 11, year: "2022", title: "Harchi Online", type: "B2B E-Commerce", linkType: "nda", href: "" },
  { id: 12, year: "2022", title: "Maad Talaei", type: "Guarantee Portal", linkType: "offline", href: "" },
  { id: 13, year: "2022", title: "Simi Nasr Maad", type: "Industrial Distributor Hub", linkType: "offline", href: "" },
  { id: 14, year: "2021", title: "Bavar Task Manager", type: "Mobile Application", linkType: "offline", href: "" },
];

const PAGE_SIZE = 10;

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
    <div className="flex w-full flex-col justify-between gap-4 border-b border-zinc-800/50 py-6 md:flex-row md:items-center md:gap-0">
      {/* Mobile: title left, year right. Desktop: year column, then title. */}
      <div className="flex w-full min-w-0 items-center justify-between md:w-2/3 md:justify-start md:gap-12">
        <span className="order-2 shrink-0 text-right font-mono text-sm text-zinc-500 md:order-1 md:w-12 md:text-left">
          {item.year}
        </span>
        <h3 className={`order-1 min-w-0 truncate pr-4 text-lg font-medium leading-tight text-white md:order-2 md:pr-0 ${hover}`}>
          {item.title}
        </h3>
      </div>
      <div className="mt-2 flex w-full min-w-0 items-center justify-between md:mt-0 md:w-1/3">
        <span className="min-w-0 truncate pr-4 text-sm text-zinc-500">{item.type}</span>
        <div className="shrink-0">
          <span
            className={`whitespace-nowrap font-mono text-xs uppercase tracking-wider ${clickable ? `text-zinc-300 ${hover}` : "text-zinc-600"}`}
          >
            {ACTION_LABEL[item.linkType]}
          </span>
        </div>
      </div>
    </div>
  );
}

const rowClass = "group block outline-none focus-visible:ring-2 focus-visible:ring-orange-400/70 rounded-sm";

const paginationButton = buttonVariants({
  variant: "ghost",
  size: "none",
  className: "font-mono text-sm uppercase focus-visible:text-orange-400",
});

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

  const handleLoadMore = () => setVisibleCount((prev) => prev + PAGE_SIZE);

  const handleShowLess = () => {
    setVisibleCount(PAGE_SIZE);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("archive-section")?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    // The Show Less button unmounts with the collapse; hand focus to the heading instead of <body>.
    document.getElementById("archive-title")?.focus({ preventScroll: true });
  };

  return (
    <section id="archive-section" aria-labelledby="archive-title" className="mx-auto mb-32 mt-32 max-w-7xl px-6">
      <header className="mb-12 flex flex-col items-start justify-between gap-2 border-t border-white/10 pt-8 font-mono text-sm text-zinc-500 md:flex-row md:items-center">
        <h2 id="archive-title" tabIndex={-1} className="text-zinc-300 outline-none">
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

      {(visibleCount < archiveData.length || visibleCount > PAGE_SIZE) && (
        <div className="flex items-center gap-6 pt-8">
          {visibleCount < archiveData.length && (
            <button type="button" onClick={handleLoadMore} className={paginationButton}>
              Load More ({archiveData.length - visibleCount})
            </button>
          )}
          {visibleCount > PAGE_SIZE && (
            <button type="button" onClick={handleShowLess} className={paginationButton}>
              Show Less
            </button>
          )}
        </div>
      )}
    </section>
  );
}
