export type ExperimentType = "python" | "typescript" | "script";

// Visual proof shown in the modal's output viewer. Drop files in /public and point `src` at them.
export type ExperimentMedia =
  | { kind: "image"; src: string; alt: string } // PNG / JPG / GIF
  | { kind: "video"; src: string; poster?: string }; // MP4 / WebM

export type Experiment = {
  id: number;
  filename: string;
  type: ExperimentType;
  bottleneck: string;
  fix: string;
  outcome: string;
  media?: ExperimentMedia;
};

export const EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    filename: "jira-rice-automation.py",
    type: "python",
    bottleneck: "Product teams were slow at prioritizing backlog tasks manually.",
    fix: "Integrated the RICE framework formula with Jira's API via Python to auto-calculate task weights.",
    outcome: "Saved 5 hours per sprint in planning meetings.",
  },
  {
    id: 2,
    filename: "article-content-pipeline.ts",
    type: "typescript",
    bottleneck: "Content team had a fragmented workflow for drafting and publishing.",
    fix: "Built an end-to-end automation pipeline connecting docs to the CMS.",
    outcome: "Reduced publishing friction by 60%.",
  },
  {
    id: 3,
    filename: "prompt-generator-engine.gs",
    type: "script",
    bottleneck: "Designers were writing inconsistent AI prompts for product photography.",
    fix: "Created a Google Sheet with a dynamic script that compiles master prompts based on UI dropdowns.",
    outcome: "Standardized AI outputs across the design team.",
  },
  {
    id: 4,
    filename: "blender-physics-sim.py",
    type: "python",
    bottleneck: "Explaining complex physical dispatching mechanisms visually was too manual.",
    fix: "Combined Python scripting with Blender/Manim to automate technical 3D animations.",
    outcome: "Created reusable code-driven animation assets.",
  },
];
