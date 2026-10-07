import Link from "next/link";
import type { ReactNode } from "react";
import { CaseStudyToc, type TocSection } from "./CaseStudyToc";

type CaseStudyLayoutProps = {
  title: string;
  category: string;
  tlDr: { role: string; timeline: string; context: string; impact: string };
  nextProject: { title: string; slug: string };
  /** Drives the sticky table of contents; each id must match a heading id in `children`. */
  sections?: TocSection[];
  children: ReactNode;
};

const DEFAULT_SECTIONS: TocSection[] = [
  { id: "context", label: "Context" },
  { id: "architecture", label: "Architecture" },
  { id: "impact", label: "Impact" },
];

export function CaseStudyLayout({
  title,
  category,
  tlDr,
  nextProject,
  sections = DEFAULT_SECTIONS,
  children,
}: CaseStudyLayoutProps) {
  const quickScan = [
    { label: "ROLE", value: tlDr.role },
    { label: "TIMELINE", value: tlDr.timeline },
    { label: "CONTEXT", value: tlDr.context },
    { label: "IMPACT", value: tlDr.impact },
  ];

  return (
    <article>
      {/* Top bar, hero and TL;DR — built for the 10-second scan */}
      <header className="mx-auto max-w-7xl px-6 pb-12 pt-24">
        <nav aria-label="Breadcrumb" className="mb-12 text-sm">
          <ol className="flex flex-wrap items-center gap-2 text-zinc-500">
            <li>
              <Link
                href="/work"
                className="rounded transition-colors hover:text-orange-400 focus-visible:text-orange-400 focus-visible:outline-none"
              >
                Work
              </Link>
            </li>
            <li aria-hidden className="text-zinc-600">
              /
            </li>
            <li>
              <span aria-current="page" className="text-white">
                {title}
              </span>
            </li>
          </ol>
        </nav>

        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-orange-400">{category}</p>
        <h1 className="mb-8 text-5xl font-bold tracking-tight text-white md:text-7xl">{title}</h1>

        <dl className="mb-16 grid grid-cols-2 gap-6 border-b border-t border-white/10 py-8 md:grid-cols-4">
          {quickScan.map(({ label, value }) => (
            <div key={label}>
              <dt className="mb-1 font-mono text-xs text-zinc-500">{label}</dt>
              <dd className="text-sm text-white md:text-base">{value}</dd>
            </div>
          ))}
        </dl>

        {/* Hero media placeholder — replace with <Image> or <video> per case study */}
        <div aria-hidden className="mb-24 h-[50vh] w-full rounded-3xl bg-zinc-900 md:h-[70vh]" />
      </header>

      {/* Two-column body: sticky TOC for orientation, long-form content for deep readers */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-12 px-6 lg:grid-cols-12">
        <aside className="hidden h-fit lg:sticky lg:top-32 lg:col-span-3 lg:block">
          <CaseStudyToc sections={sections} />
        </aside>

        <div className="prose prose-lg prose-invert max-w-none leading-relaxed lg:col-span-9 prose-headings:scroll-mt-32 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-white prose-p:leading-relaxed prose-p:text-zinc-300 prose-a:text-orange-400 prose-strong:text-white prose-li:text-zinc-300">
          {children}
        </div>
      </div>

      {/* Next project — one giant target to keep the reader moving */}
      <footer className="mt-32 border-t border-white/10">
        <Link
          href={`/work/${nextProject.slug}`}
          className="group relative block overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-orange-400/70"
        >
          {/* Hover reveal: a warm panel wipes up from the bottom edge */}
          <span
            aria-hidden
            className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-t from-orange-500/15 via-orange-500/5 to-transparent transition-transform duration-700 ease-out group-hover:scale-y-100 group-focus-visible:scale-y-100 motion-reduce:transition-none"
          />
          <span className="relative mx-auto block max-w-7xl px-6 py-24 md:py-32">
            <span className="mb-4 block font-mono text-sm uppercase tracking-widest text-zinc-500">
              Next Project
            </span>
            <span className="flex items-end justify-between gap-6">
              <span className="block break-words text-5xl font-bold tracking-tight text-white transition-transform duration-500 ease-out group-hover:translate-x-4 group-focus-visible:translate-x-4 motion-reduce:transition-none md:text-8xl">
                {nextProject.title}
              </span>
              <span
                aria-hidden
                className="text-4xl text-zinc-600 transition-all duration-500 group-hover:-translate-y-2 group-hover:translate-x-2 group-hover:text-orange-400 md:text-6xl"
              >
                ↗
              </span>
            </span>
          </span>
        </Link>
      </footer>
    </article>
  );
}
