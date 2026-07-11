import { generateObject } from "ai";
import { z } from "zod";
import { httpAction } from "../../_generated/server";
import { getUserIdFromAction } from "../../lib/auth";
import { openrouter } from "../shared/providers";
import { buildClassSuggestionsPrompt } from "../utils/buildClassSuggestionsPrompt";
import { getCorsHeaders } from "../utils/getCorsHeaders";

const classSuggestionsSchema = z.object({
  suggestions: z.array(z.string()).describe("Array of Tailwind CSS class name strings"),
});

export const getClassSuggestions = httpAction(async (ctx, request) => {
  const origin = request.headers.get("Origin");

  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: getCorsHeaders(origin),
    });
  }

  if (request.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: getCorsHeaders(origin),
    });
  }

  try {
    await getUserIdFromAction(ctx);

    const body = await request.json();
    const { componentCode, nodeId, currentClasses, existingSuggestions } = body as {
      componentCode: string;
      nodeId: string;
      currentClasses: string[];
      existingSuggestions?: string[];
    };

    if (!componentCode || typeof componentCode !== "string") {
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "componentCode is required" }), {
        status: 400,
        headers,
      });
    }

    if (!nodeId || typeof nodeId !== "string") {
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "nodeId is required" }), {
        status: 400,
        headers,
      });
    }

    if (!Array.isArray(currentClasses)) {
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "currentClasses must be an array" }), {
        status: 400,
        headers,
      });
    }

    const currentClassesStr = currentClasses.length > 0 ? currentClasses.join(" ") : "none";

    let result: {
      object: {
        suggestions: string[];
      };
    };
    try {
      //   const model = openrouter.chat("qwen/qwen2.5-coder-7b-instruct");
      const model = openrouter.chat("qwen/qwen2.5-coder-7b-instruct");

      const prompt = buildClassSuggestionsPrompt(componentCode, nodeId, currentClassesStr);

      result = await generateObject({
        model,
        schema: classSuggestionsSchema,
        temperature: 0.3,
        maxRetries: 2,
        prompt,
      });
    } catch (generateError) {
      console.error("[getClassSuggestions] generateObject error:", generateError);
      console.error("[getClassSuggestions] Error details:", JSON.stringify(generateError, null, 2));
      // Return empty suggestions if model fails
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ suggestions: [] }), {
        status: 200,
        headers,
      });
    }

    const aiSuggestions = result.object.suggestions as string[];

    console.log("aiSuggestions", aiSuggestions);

    const headers = getCorsHeaders(origin);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ suggestions: aiSuggestions }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[getClassSuggestions] Error:", error);
    const headers = getCorsHeaders(origin);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers,
    });
  }
});
