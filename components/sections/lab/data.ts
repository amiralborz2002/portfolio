// Visual proof shown in the modal's output viewer. Drop files in /public and point `src` at them.
export type ExperimentMedia =
  | { kind: "image"; src: string; alt: string } // PNG / JPG / GIF
  | { kind: "video"; src: string; poster?: string }; // MP4 / WebM

// Free-form write-up blocks, so each experiment can tell its story in its own terms
// (bottleneck/fix/outcome for client work, curiosity/experiment for side quests).
export type ExperimentSection = {
  title: string;
  content: string;
};

export type Experiment = {
  id: number;
  filename: string;
  // Human-readable pseudo-code for the card teaser, not the real source.
  codeSnippet: string;
  sections: ExperimentSection[];
  media?: ExperimentMedia;
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    filename: "jira-rice-automation.py",
    codeSnippet: "function optimize() {\n  const tasks = getJiraBacklog();\n  return applyRICE(tasks);\n}",
    sections: [
      { title: "THE BOTTLENECK", content: "Product teams were slow at prioritizing manually." },
      { title: "THE FIX", content: "Integrated RICE formula with Jira API." },
      { title: "THE OUTCOME", content: "Saved 5 hours per sprint in planning meetings." },
    ],
  },
  {
    id: 2,
    filename: "article-content-pipeline.ts",
    codeSnippet: "function publish(draft) {\n  const article = cleanUp(draft);\n  return sendToCMS(article);\n}",
    sections: [
      { title: "THE BOTTLENECK", content: "Content team had a fragmented workflow for drafting and publishing." },
      { title: "THE FIX", content: "Built an end-to-end automation pipeline connecting docs to the CMS." },
      { title: "THE OUTCOME", content: "Reduced publishing friction by 60%." },
    ],
  },
  {
    id: 3,
    filename: "prompt-generator-engine.gs",
    codeSnippet: "function onDropdownChange() {\n  const choices = readSheet();\n  return buildMasterPrompt(choices);\n}",
    sections: [
      { title: "THE BOTTLENECK", content: "Designers were writing inconsistent AI prompts for product photography." },
      { title: "THE FIX", content: "Created a Google Sheet with a dynamic script that compiles master prompts based on UI dropdowns." },
      { title: "THE OUTCOME", content: "Standardized AI outputs across the design team." },
    ],
  },
  {
    id: 4,
    filename: "blender-physics-sim.py",
    codeSnippet: "import { curiosity } from 'mind';\nimport { physics } from 'blender';\n\ncuriosity.render(physics);",
    sections: [
      { title: "THE CURIOSITY", content: "I wanted to explain complex physical dispatching mechanisms visually." },
      { title: "THE EXPERIMENT", content: "Combined Python scripting with Blender/Manim." },
      { title: "THE RESULT", content: "Created reusable code-driven animation assets." },
    ],
  },
];
