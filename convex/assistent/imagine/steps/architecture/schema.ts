import { z } from "zod";

export const architectureSchema = z.object({
  components: z
    .array(
      z.object({
        name: z.string().describe("Component name (e.g., 'Button', 'Card')"),
        purpose: z.string().describe("What this component does"),
        dependencies: z.array(z.string()).default([]).describe("Other components this depends on"),
      })
    )
    .default([]),
  pages: z
    .array(
      z.object({
        name: z.string().describe("Page name (e.g., 'HomePage', 'AboutPage')"),
        purpose: z.string().describe("What this page displays"),
        dependencies: z.array(z.string()).default([]).describe("Components this page uses"),
      })
    )
    .default([]),
});

export type Architecture = z.infer<typeof architectureSchema>;
