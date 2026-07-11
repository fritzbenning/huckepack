import { generateText } from "ai";
import { httpAction } from "../../_generated/server";
import { getUserIdFromAction } from "../../lib/auth";
import { metaEditorModel } from "../agents/metaEditor";
import { getCorsHeaders } from "../utils/getCorsHeaders";

export const getTitle = httpAction(async (ctx, request) => {
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
    const { text } = body as { text: string };

    if (!text || typeof text !== "string") {
      const headers = getCorsHeaders(origin);
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ error: "text is required" }), {
        status: 400,
        headers,
      });
    }

    const result = await generateText({
      model: metaEditorModel,
      prompt: `Generate a concise title (maximum 3 words) for this message: "${text}". Only return the title without special characters, markdown formatting or explanations.`,
    });

    const title = result.text.trim();

    const headers = getCorsHeaders(origin);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ title }), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("[getTitle] Error:", error);
    const headers = getCorsHeaders(origin);
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : "Internal server error" }), {
      status: 500,
      headers,
    });
  }
});
