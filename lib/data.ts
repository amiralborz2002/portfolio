export type CaseStudySection = {
  /** Anchor id — also drives the sticky table of contents. */
  id: string;
  heading: string;
  paragraphs: string[];
};

export type CaseStudy = {
  slug: string;
  title: string;
  category: string;
  /** Short pills shown on the /work grid card. */
  tags: string[];
  summary: string;
  tlDr: { role: string; timeline: string; context: string; impact: string };
  sections: CaseStudySection[];
};

// Placeholder copy — replace each entry with the real story. Order here is the
// order of the "Next Project" chain (the last one loops back to the first).
export const caseStudies: CaseStudy[] = [
  {
    slug: "design-system",
    title: "The Design System",
    category: "System Architecture · B2B",
    tags: ["System Architecture", "Design Tokens", "B2B"],
    summary:
      "How a token-driven design system unified six product teams and cut UI delivery time in half.",
    tlDr: {
      role: "Lead Product Designer",
      timeline: "8 months · 2025",
      context: "6 product teams, 3 platforms",
      impact: "−48% UI delivery time",
    },
    sections: [
      {
        id: "context",
        heading: "Context",
        paragraphs: [
          "Six products were shipping from six slightly different interpretations of the same brand. Every team had its own button, its own spacing scale and its own idea of what “primary” meant.",
          "Accessibility fixes landed in one product and never reached the others, and onboarding a new designer meant a tour of tribal knowledge rather than a single source of truth.",
        ],
      },
      {
        id: "architecture",
        heading: "Architecture",
        paragraphs: [
          "The system is built in three layers: primitive tokens for raw values, semantic tokens for intent, and component tokens that bind intent to a specific part.",
          "Tokens are authored once in Figma variables, exported as JSON through a small CI pipeline, and compiled into CSS custom properties, a Tailwind theme and native mobile resources.",
        ],
      },
      {
        id: "impact",
        heading: "Impact",
        paragraphs: [
          "Six months after the first release every active product consumed the shared library. Median time from approved design to shipped UI dropped by 48%.",
          "Design reviews moved from debating pixels to debating problems — when the foundation is shared, the conversation can finally be about the user.",
        ],
      },
    ],
  },
  {
    slug: "nubar-cloud",
    title: "Nubar Cloud Console",
    category: "Cloud Infrastructure · Dashboard",
    tags: ["Cloud Infrastructure", "Dashboard"],
    summary: "Turning a sprawling cloud control panel into a console engineers actually trust.",
    tlDr: {
      role: "Senior UX Designer",
      timeline: "10 months · 2024–2025",
      context: "IaaS console, 40+ services",
      impact: "−35% support tickets",
    },
    sections: [
      {
        id: "context",
        heading: "Context",
        paragraphs: [
          "The console had grown one service at a time. Each team added its own navigation, its own tables and its own language for the same concepts.",
          "New customers churned during onboarding because provisioning a single server took eleven screens and three glossaries.",
        ],
      },
      {
        id: "architecture",
        heading: "Architecture",
        paragraphs: [
          "We rebuilt the information architecture around resources rather than services, with one consistent pattern for list, detail and create flows.",
          "A shared data-table and status vocabulary meant every service reported health, cost and usage the same way.",
        ],
      },
      {
        id: "impact",
        heading: "Impact",
        paragraphs: [
          "Time to first deployed server fell from 14 minutes to under 4, and support tickets tagged “how do I” dropped by 35% within a quarter.",
        ],
      },
    ],
  },
  {
    slug: "digi-express",
    title: "Digi Express Annual Report",
    category: "Data Storytelling · Web",
    tags: ["Data Storytelling", "Web"],
    summary: "An interactive annual report that turns a year of logistics data into a narrative.",
    tlDr: {
      role: "Product Designer",
      timeline: "3 months · 2024",
      context: "Public annual report",
      impact: "4× avg. time on page",
    },
    sections: [
      {
        id: "context",
        heading: "Context",
        paragraphs: [
          "Previous reports were static PDFs that few people opened. Leadership wanted something employees, partners and press would actually read and share.",
        ],
      },
      {
        id: "architecture",
        heading: "Architecture",
        paragraphs: [
          "The report is structured as chapters, each built around one headline metric, with scroll-driven charts that reveal detail only when the reader asks for it.",
        ],
      },
      {
        id: "impact",
        heading: "Impact",
        paragraphs: [
          "Average time on page was four times that of the previous report, and the launch became the company’s most-shared post of the year.",
        ],
      },
    ],
  },
  {
    slug: "fragrance-spa",
    title: "Fragrance B2B SPA",
    category: "E-commerce · B2B",
    tags: ["E-commerce", "B2B"],
    summary: "A wholesale ordering experience built for buyers who reorder hundreds of SKUs.",
    tlDr: {
      role: "UX Architect",
      timeline: "6 months · 2024",
      context: "Wholesale, 2,000+ SKUs",
      impact: "+27% repeat orders",
    },
    sections: [
      {
        id: "context",
        heading: "Context",
        paragraphs: [
          "Wholesale buyers were placing orders by email and spreadsheet because the consumer storefront made bulk ordering painful.",
        ],
      },
      {
        id: "architecture",
        heading: "Architecture",
        paragraphs: [
          "We designed a single-page ordering workspace with quick-add by SKU, saved order templates and tiered pricing visible at every step.",
        ],
      },
      {
        id: "impact",
        heading: "Impact",
        paragraphs: [
          "Repeat orders grew 27% in the first two quarters and average order processing time on the sales team fell by half.",
        ],
      },
    ],
  },
  {
    slug: "escape-room",
    title: "Escape Room Marketplace",
    category: "Marketplace · Booking",
    tags: ["Marketplace", "Booking"],
    summary: "A two-sided marketplace that makes discovering and booking escape rooms effortless.",
    tlDr: {
      role: "Product Designer",
      timeline: "5 months · 2023",
      context: "Two-sided marketplace",
      impact: "+41% booking conversion",
    },
    sections: [
      {
        id: "context",
        heading: "Context",
        paragraphs: [
          "Players had to compare rooms across dozens of separate websites, and venue owners managed bookings by phone.",
        ],
      },
      {
        id: "architecture",
        heading: "Architecture",
        paragraphs: [
          "Discovery is built around group size, difficulty and availability, with a booking flow that holds a slot while the group confirms.",
        ],
      },
      {
        id: "impact",
        heading: "Impact",
        paragraphs: [
          "Booking conversion rose 41% compared with venues’ own sites, and no-shows fell after we introduced group confirmations.",
        ],
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((study) => study.slug === slug);
}

export function getNextCaseStudy(slug: string): CaseStudy {
  const index = caseStudies.findIndex((study) => study.slug === slug);
  return caseStudies[(index + 1) % caseStudies.length];
}
