import { z } from "zod";

export const metadataSchema = z.object({
  name: z
    .string()
    .describe(
      "A creative, descriptive project name (1-3 words). Should be unique, memorable, and reflect the project's purpose"
    ),
});

export type Metadata = z.infer<typeof metadataSchema>;

