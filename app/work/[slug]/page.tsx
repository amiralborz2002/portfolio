import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CaseStudyLayout } from "@/components/layout/CaseStudyLayout";
import { caseStudies, getCaseStudy, getNextCaseStudy } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

// Prerender every known case study at build time.
export function generateStaticParams() {
  return caseStudies.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = getCaseStudy((await params).slug);
  if (!study) return {};
  return { title: study.title, description: study.summary };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  const next = getNextCaseStudy(slug);

  return (
    <CaseStudyLayout
      title={study.title}
      category={study.category}
      tlDr={study.tlDr}
      nextProject={{ title: next.title, slug: next.slug }}
      sections={study.sections.map(({ id, heading }) => ({ id, label: heading }))}
    >
      {study.sections.map((section, i) => (
        <section key={section.id} aria-labelledby={section.id}>
          <h2 id={section.id}>
            {String(i + 1).padStart(2, "0")} / {section.heading}
          </h2>
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </section>
      ))}
    </CaseStudyLayout>
  );
}
