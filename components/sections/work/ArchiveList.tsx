import Link from "next/link";

type ArchiveEntry = {
  slug: string;
  year: number;
  title: string;
  role: string;
};

// Newest first. The header's index count and timeline are derived from this list.
const ARCHIVE: ArchiveEntry[] = [
  { slug: "kids-assessment-platform", year: 2026, title: "Kids Assessment Platform", role: "Product Design · EdTech" },
  { slug: "analytics-dashboard", year: 2025, title: "Analytics Dashboard", role: "Data Visualisation" },
  { slug: "chrome-extension", year: 2025, title: "Chrome Extension", role: "Product Design · Tooling" },
  { slug: "design-tokens-pipeline", year: 2025, title: "Design Tokens Pipeline", role: "Design Systems" },
  { slug: "e-commerce-spa", year: 2024, title: "E-Commerce SPA", role: "UX Architecture · Front-End" },
  { slug: "charity-landing-page", year: 2024, title: "Charity Landing Page", role: "Web Design" },
  { slug: "booking-flow-redesign", year: 2024, title: "Booking Flow Redesign", role: "UX Research · Interaction" },
  { slug: "fintech-onboarding", year: 2023, title: "Fintech Onboarding", role: "Product Design" },
  { slug: "corporate-identity", year: 2023, title: "Corporate Identity", role: "Brand · Visual Identity" },
  { slug: "internal-crm", year: 2022, title: "Internal CRM", role: "Information Architecture" },
  { slug: "mobile-banking-concept", year: 2022, title: "Mobile Banking Concept", role: "UI Design" },
  { slug: "restaurant-ordering-app", year: 2021, title: "Restaurant Ordering App", role: "UX/UI Design" },
];

const years = ARCHIVE.map((entry) => entry.year);
const INDEX = String(ARCHIVE.length).padStart(3, "0");
const TIMELINE = `${Math.min(...years)} - ${Math.max(...years)}`;

export function ArchiveList() {
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
        {ARCHIVE.map((entry) => (
          <li key={entry.slug}>
            <Link
              href={`/work/${entry.slug}`}
              className="group -mx-4 flex flex-col items-start justify-between gap-2 rounded-lg border-b border-white/10 px-4 py-6 outline-none transition-colors hover:bg-white/5 focus-visible:bg-white/5 focus-visible:ring-2 focus-visible:ring-orange-400/70 md:flex-row md:items-center md:gap-0"
            >
              <div className="flex items-center">
                <span className="w-24 shrink-0 font-mono text-sm text-zinc-500">{entry.year}</span>
                <span className="text-lg font-medium text-white transition-all duration-300 group-hover:translate-x-2 group-hover:text-orange-400 group-focus-visible:translate-x-2 group-focus-visible:text-orange-400 md:text-xl">
                  {entry.title}
                </span>
              </div>
              <div className="flex items-center pl-24 md:pl-0">
                <span className="mr-8 text-sm text-zinc-500 md:text-base">{entry.role}</span>
                <span
                  aria-hidden
                  className="text-zinc-500 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-orange-400 group-focus-visible:-translate-y-1 group-focus-visible:translate-x-1 group-focus-visible:text-orange-400"
                >
                  ↗
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
