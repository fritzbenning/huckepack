import { createUIMessageStreamResponse } from "ai";
import type { Id } from "../../_generated/dataModel";
import { httpAction } from "../../_generated/server";
import { getUserIdFromAction } from "../../lib/auth";
import { createWorkflowStream, runImagineWorkflow } from "../imagine";
import { extractPromptFromRequest } from "../imagine/utils/extractPrompt";
import { getCorsHeaders } from "../utils/getCorsHeaders";

export const imagine = httpAction(async (ctx, request) => {
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
    const userId = await getUserIdFromAction(ctx);
    const body = await request.json();

    // Extract prompt from request
    const prompt = extractPromptFromRequest(body);

    if (!prompt || prompt.length === 0) {
      return new Response(
        JSON.stringify({ error: "prompt is required. Please provide a message with text content." }),
        {
          status: 400,
          headers: {
            ...getCorsHeaders(origin),
            "Content-Type": "application/json",
          },
        }
      );
    }

    // Extract teamId from request body
    const teamId = body.teamId as Id<"teams"> | undefined;

    if (!teamId) {
      return new Response(JSON.stringify({ error: "teamId is required" }), {
        status: 400,
        headers: {
          ...getCorsHeaders(origin),
          "Content-Type": "application/json",
        },
      });
    }

    // Create workflow stream
    const stream = createWorkflowStream(runImagineWorkflow({ ctx, userId, teamId, prompt }), prompt);

    // Return streaming response
    const response = createUIMessageStreamResponse({ stream });
    const corsHeaders = getCorsHeaders(origin);
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });

    return response;
  } catch (error) {
    console.error("[imagine] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: {
        ...getCorsHeaders(origin),
        "Content-Type": "application/json",
      },
    });
  }
});
