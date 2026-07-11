import { createUIMessageStreamResponse } from "ai";
import { httpAction } from "../../_generated/server";
import { getUserIdFromAction } from "../../lib/auth";
import type { AssistRequestBody } from "../../types/assistent";
import { createCoderAgent } from "../agents/coder";
import { convertUIMessagesToModelMessages } from "../utils/convertUIMessages";
import { getCorsHeaders } from "../utils/getCorsHeaders";

export const chat = httpAction(async (ctx, request) => {
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

    const { messages, projectId, currentFileId, model } = body as AssistRequestBody;

    if (!projectId) {
      return new Response(JSON.stringify({ error: "projectId is required" }), {
        status: 400,
        headers: {
          ...getCorsHeaders(origin),
          "Content-Type": "application/json",
        },
      });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "messages array is required" }), {
        status: 400,
        headers: {
          ...getCorsHeaders(origin),
          "Content-Type": "application/json",
        },
      });
    }

    if (!currentFileId) {
      return new Response(JSON.stringify({ error: "fileId is required. Please specify which file to edit." }), {
        status: 400,
        headers: {
          ...getCorsHeaders(origin),
          "Content-Type": "application/json",
        },
      });
    }

    const agent = createCoderAgent(ctx, projectId, currentFileId, userId, model);
    const convertedMessages = convertUIMessagesToModelMessages(messages);

    const stream = agent.stream({
      messages: convertedMessages,
    });

    const response = createUIMessageStreamResponse({ stream: stream.toUIMessageStream() });
    const corsHeaders = getCorsHeaders(origin);
    corsHeaders.forEach((value, key) => {
      response.headers.set(key, value);
    });
    return response;
  } catch (error) {
    console.error("[chat] Error:", error);
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers: {
        ...getCorsHeaders(origin),
        "Content-Type": "application/json",
      },
    });
  }
});
