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
    filename: "jira-rice-automation.json",
    codeSnippet: '{\n  "trigger": "issue.updated",\n  "action": "set RICE = R*I*C/E"\n}',
    sections: [
      { title: "THE BOTTLENECK", content: "Teams prioritized the backlog by hand, and it was slow." },
      { title: "THE FIX", content: "Built a RICE scoring rule directly inside Jira Automation." },
      { title: "THE OUTCOME", content: "Saved 5 hours per sprint in planning meetings." },
    ],
  },
  {
    id: 2,
    filename: "article-content-pipeline.ts",
    codeSnippet: "function publish(draft) {\n  const article = cleanUp(draft);\n  return sendToCMS(article);\n}",
    sections: [
      { title: "THE BOTTLENECK", content: "An SEO client needed content outsourced, but drafts were slow and inconsistent." },
      { title: "THE FIX", content: "Built a pipeline that drafts, formats, and builds links." },
      { title: "THE OUTCOME", content: "Content shipped faster, with far less manual cleanup." },
    ],
  },
  {
    id: 3,
    filename: "prompt-generator-engine.gs",
    codeSnippet: "function onDropdownChange() {\n  const choices = readSheet();\n  return buildMasterPrompt(choices);\n}",
    sections: [
      { title: "THE BOTTLENECK", content: "A team needed product photos but had no studio or budget for shoots." },
      { title: "THE FIX", content: "Built a system that turns dropdown choices into prompts for natural-looking product shots." },
      { title: "THE OUTCOME", content: "The team now produces consistent studio-quality photos without a studio." },
    ],
  },
  {
    id: 4,
    filename: "blender-physics-sim.py",
    codeSnippet: "import { curiosity } from 'mind';\nimport { physics } from 'blender';\n\ncuriosity.render(physics);",
    sections: [
      { title: "THE CURIOSITY", content: "I’ve always liked turning complicated ideas, like how an elevator works, into something anyone can follow at a glance. Manual animation felt slow and one-off, so I got curious whether code could make the process systematic and reusable instead." },
      { title: "THE EXPERIMENT", content: "Combined Python for the physics logic, JavaScript for interactive previews, and Blender for the final render." },
      { title: "THE RESULT", content: "Built a repeatable pipeline, not just one animation, so any concept can become a short explainer." },
    ],
  },
];
