import { z } from "zod";

export const rebriefingSchema = z.object({
  briefing: z
    .string()
    .describe(
      "A comprehensive design briefing that outlines the visual style, design principles, color schemes, typography preferences, layout approach, and any specific design requirements for the project"
    ),
});

export type Rebriefing = z.infer<typeof rebriefingSchema>;

