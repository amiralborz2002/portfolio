import Link from "next/link";
import { getCaseStudy } from "@/lib/data";
import { cn } from "@/lib/utils";

type CardLayout = {
  /** Grid placement on the 12-column md+ layout. */
  span: string;
  /** Placeholder image height; row-span-2 cards get the taller variant. */
  height: string;
};

// Grid placement for each flagship, in display order. Titles, tags and slugs come
// from lib/data so every card always links to a case study that exists.
const CARD_LAYOUT: Record<string, CardLayout> = {
  "design-system": { span: "md:col-span-7 md:row-span-2", height: "h-[400px] md:h-[640px]" },
  "nubar-cloud": { span: "md:col-span-5 md:row-span-2", height: "h-[400px] md:h-[640px]" },
  "digi-express": { span: "md:col-span-4", height: "h-[300px] md:h-[400px]" },
  "fragrance-spa": { span: "md:col-span-4", height: "h-[300px] md:h-[400px]" },
  "parv-online": { span: "md:col-span-4", height: "h-[300px] md:h-[400px]" },
};

const FEATURED = Object.entries(CARD_LAYOUT).flatMap(([slug, layout]) => {
  const study = getCaseStudy(slug);
  return study ? [{ ...study, ...layout }] : [];
});

type FeaturedCard = (typeof FEATURED)[number];

function WorkCard({ study }: { study: FeaturedCard }) {
  return (
    <Link
      href={`/work/${study.slug}`}
      className={cn(
        "group relative block overflow-hidden rounded-3xl border border-white/10 bg-white/5",
        "outline-none transition-colors duration-500 hover:border-white/20",
        "focus-visible:ring-2 focus-visible:ring-orange-400/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black",
        study.span,
      )}
    >
      {/* Image area — swap the gradient for a real <Image> once assets land. */}
      <div
        aria-hidden
        className={cn(
          "w-full bg-gradient-to-br from-zinc-800 to-zinc-900",
          "transition-transform duration-700 ease-out group-hover:scale-105 group-focus-visible:scale-105",
          "motion-reduce:transition-none motion-reduce:group-hover:scale-100",
          study.height,
        )}
      />

      <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/80 to-transparent p-8">
        <h2 className="flex items-start gap-3 text-2xl font-bold text-white md:text-3xl">
          <span>{study.title}</span>
          <span
            aria-hidden
            className="translate-y-1 text-orange-400 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
          >
            ↗
          </span>
        </h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {study.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full border border-orange-500/30 bg-orange-500/10 px-3 py-1 text-xs text-orange-400"
            >
              {tag}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export function FeaturedWorks() {
  return (
    <section aria-labelledby="featured-works-title">
      <header>
        <h1
          id="featured-works-title"
          className="mb-6 text-5xl font-bold tracking-tight text-white md:text-7xl"
        >
          Selected Works.
        </h1>
        <p className="mb-16 max-w-2xl text-xl text-zinc-400">
          A selection of systems I&apos;ve built, platforms I&apos;ve scaled, and experiences
          people actually use.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {FEATURED.map((study) => (
          <WorkCard key={study.slug} study={study} />
        ))}
      </div>
    </section>
  );
}
