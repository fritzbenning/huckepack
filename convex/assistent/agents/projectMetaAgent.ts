import { generateObject } from "ai";
import { metadataSchema } from "../imagine/steps/metadata/schema";
import { openrouter } from "../shared/providers";

export async function projectMetaAgent(prompt: string) {
  return generateObject({
    model: openrouter.chat("google/gemini-3-flash-preview"),
    schema: metadataSchema,
    prompt: `Generate a creative, descriptive project name based on this project request:

            User project request: "${prompt}"

            Requirements:
            - 1-5 words only
            - Should be unique and memorable
            - Should reflect the project's purpose and theme
            - Avoid generic names like "My Project" or "New Project"
            - Make it catchy and professional

            Examples of good names:
            - "EcoMarket" (for an e-commerce site selling eco products)
            - "Artisan Bakery" (for a bakery website)
            - "TechFlow" (for a tech company landing page)
            - "Urban Garden" (for a gardening app)
            `,
  });
}
