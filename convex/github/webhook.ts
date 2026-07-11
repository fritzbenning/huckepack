import { api } from "../_generated/api";
import { httpAction } from "../_generated/server";

function hexToBytes(hex: string): ArrayBuffer {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength);
}

async function verifySignature(
  request: Request,
  rawBody: string,
  secret: string
): Promise<{ valid: boolean; details?: string }> {
  if (!secret) {
    console.error("GITHUB_WEBHOOK_SECRET environment variable is not set!");
    return { valid: false, details: "GITHUB_WEBHOOK_SECRET not set" };
  }

  const signatureHeader = request.headers.get("x-hub-signature-256");
  if (!signatureHeader || !signatureHeader.startsWith("sha256=")) {
    return { valid: false, details: "Missing or invalid signature header" };
  }

  const signatureHex = signatureHeader.replace("sha256=", "");
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, [
    "verify",
  ]);

  const signatureBytes = hexToBytes(signatureHex);
  const verified = await crypto.subtle.verify("HMAC", key, signatureBytes, encoder.encode(rawBody));

  return { valid: verified, details: verified ? undefined : "Signature verification failed" };
}

export const githubWebhook = httpAction(async (ctx, request) => {
  if (request.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const rawBody = await request.text();
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    return new Response(
      JSON.stringify({
        error: "Webhook secret not configured",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const verificationResult = await verifySignature(request, rawBody, secret);
  if (!verificationResult.valid) {
    return new Response(
      JSON.stringify({
        error: "Invalid signature",
        debug: verificationResult.details,
      }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const payload = JSON.parse(rawBody);
  const event = request.headers.get("x-github-event");

  if (event === "installation") {
    const githubAppId = payload.installation?.id;

    if (payload.action === "created") {
      await ctx.runMutation(api.githubInstallations.upsert, {
        githubAppId,
      });
    } else if (payload.action === "deleted") {
      await ctx.runMutation(api.githubInstallations.delete_, {
        githubAppId,
      });
    }
  }

  return new Response("OK", { status: 200 });
});
