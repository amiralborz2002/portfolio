import type { Metadata } from "next";
import { CaseStudyLayout } from "@/components/layout/CaseStudyLayout";

export const metadata: Metadata = {
  title: "The Design System",
  description:
    "How a token-driven design system unified six product teams and cut UI delivery time in half.",
};

export default function SampleCaseStudyPage() {
  return (
    <CaseStudyLayout
      title="The Design System"
      category="System Architecture · B2B"
      tlDr={{
        role: "Lead Product Designer",
        timeline: "8 months · 2025",
        context: "6 product teams, 3 platforms",
        impact: "−48% UI delivery time",
      }}
      nextProject={{ title: "Nubar Cloud Console", slug: "nubar-cloud" }}
    >
      <h2 id="context">01 / Context</h2>
      <p>
        By early 2025 the company was shipping six products from six slightly different
        interpretations of the same brand. Every team had its own button, its own spacing scale
        and its own idea of what “primary” meant. Designers spent the first week of every project
        rebuilding components that already existed somewhere else, and engineers quietly forked
        whichever version was closest to the mock.
      </p>
      <p>
        The cost was not only visual inconsistency. Accessibility fixes landed in one product and
        never reached the others, QA cycles doubled for anything touching shared flows, and
        onboarding a new designer meant a tour of tribal knowledge rather than a single source of
        truth.
      </p>
      <h3>The constraint</h3>
      <p>
        We could not freeze roadmaps for a rewrite. Whatever we built had to be adoptable one
        screen at a time, in production, without a migration weekend.
      </p>

      <h2 id="architecture">02 / Architecture</h2>
      <p>
        The system is built in three layers. <strong>Primitive tokens</strong> describe raw values
        — the palette, the type ramp, the spacing grid. <strong>Semantic tokens</strong> map those
        values to intent: surface, border, text-muted, accent. <strong>Component tokens</strong>{" "}
        bind intent to a specific part, so a button’s background can change without touching
        anything else that happens to share its colour.
      </p>
      <p>
        Tokens are authored once in Figma variables, exported as JSON through a small CI
        pipeline, and compiled into CSS custom properties, a Tailwind theme and native mobile
        resources. A change merged at 10:00 is live in every product’s staging build by lunch.
      </p>
      <h3>Governance over gatekeeping</h3>
      <p>
        Instead of a central team approving every change, we published contribution guidelines,
        a decision log and a weekly 30-minute office hour. Product teams own their proposals end
        to end; the system team owns consistency and review. Adoption followed because
        contributing was faster than forking.
      </p>
      <ul>
        <li>42 core components with documented states and keyboard behaviour</li>
        <li>WCAG 2.2 AA contrast enforced at the token level, not per screen</li>
        <li>Visual regression tests on every pull request to the library</li>
      </ul>

      <h2 id="impact">03 / Impact</h2>
      <p>
        Six months after the first release, every active product was consuming the shared
        library. Median time from approved design to shipped UI dropped by 48%, and
        accessibility-related bug reports fell by more than two thirds — largely because fixes now
        propagate everywhere at once.
      </p>
      <p>
        The less measurable win was cultural: design reviews moved from debating pixels to
        debating problems. When the foundation is shared, the conversation can finally be about
        the user.
      </p>
    </CaseStudyLayout>
  );
}
