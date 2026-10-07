import Link from "next/link";

type ArchiveLinkType = "internal" | "external" | "nda" | "offline";

type ArchiveEntry = {
  id: number;
  year: string;
  title: string;
  role: string;
  // The outcome, readable at a glance without opening the project.
  impact: string;
  linkType: ArchiveLinkType;
  // Route for "internal", URL for "external"; empty for "nda" and "offline".
  href: string;
};

// Newest first. The header's index count and timeline are derived from this list.
const ARCHIVE: ArchiveEntry[] = [
  { id: 1, year: "2025", title: "E-Commerce Redesign", role: "Product Designer", impact: "Increased mobile conversion by 25%", linkType: "internal", href: "/work/ecommerce-redesign" },
  { id: 2, year: "2024", title: "Fintech Dashboard", role: "UX Engineer", impact: "Reduced data entry errors by 40%", linkType: "nda", href: "" },
  { id: 3, year: "2023", title: "Corporate Landing", role: "Web Designer", impact: "Award-winning visual identity", linkType: "external", href: "https://example.com" },
  { id: 4, year: "2022", title: "Restaurant Ordering App", role: "UX/UI Designer", impact: "Cut average checkout time in half", linkType: "offline", href: "" },
];

const years = ARCHIVE.map((entry) => Number(entry.year));
const INDEX = String(ARCHIVE.length).padStart(3, "0");
const TIMELINE = `${Math.min(...years)} - ${Math.max(...years)}`;

const actionBase = "inline-flex items-center gap-1 whitespace-nowrap font-mono text-xs uppercase tracking-wider";
const actionLink = `${actionBase} rounded text-zinc-300 outline-none transition-colors hover:text-orange-400 focus-visible:text-orange-400 focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:ring-offset-4 focus-visible:ring-offset-black`;
const actionStatic = `${actionBase} cursor-default text-zinc-600`;

function ArchiveAction({ entry }: { entry: ArchiveEntry }) {
  switch (entry.linkType) {
    case "internal":
      return (
        <Link href={entry.href} className={actionLink} aria-label={`Read case study: ${entry.title}`}>
          Read Case Study <span aria-hidden>→</span>
        </Link>
      );
    case "external":
      return (
        <a
          href={entry.href}
          target="_blank"
          rel="noopener noreferrer"
          className={actionLink}
          aria-label={`Live site: ${entry.title} (opens in a new tab)`}
        >
          Live Site <span aria-hidden>↗</span>
        </a>
      );
    case "nda":
      return (
        <span className={actionStatic}>
          <span aria-hidden>🔒</span> NDA
        </span>
      );
    case "offline":
      return <div className={actionStatic}>Offline</div>;
  }
}

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
          <li
            key={entry.id}
            className="group -mx-4 grid grid-cols-[6rem_1fr] gap-x-0 gap-y-3 rounded-lg border-b border-white/10 px-4 py-6 transition-colors hover:bg-white/5 focus-within:bg-white/5 md:grid-cols-[6rem_1fr_14rem_10rem] md:items-center md:gap-x-6"
          >
            <span className="font-mono text-sm text-zinc-500 md:self-start md:pt-1.5">{entry.year}</span>

            <div className="min-w-0">
              <h3 className="text-lg font-medium text-white transition-all duration-300 group-hover:translate-x-2 group-hover:text-orange-400 group-focus-within:translate-x-2 group-focus-within:text-orange-400 md:text-xl">
                {entry.title}
              </h3>
              <p className="mt-2 text-sm text-zinc-400">{entry.impact}</p>
            </div>

            <span className="col-start-2 text-sm text-zinc-500 md:col-start-auto md:text-base">{entry.role}</span>

            <div className="col-start-2 md:col-start-auto md:justify-self-end">
              <ArchiveAction entry={entry} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
