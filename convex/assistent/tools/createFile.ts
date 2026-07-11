import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

export function createFileCreateTool(ctx: ActionCtx, projectId: Id<"projects">, userId: Id<"users">) {
  return tool({
    description: "Create a new file in the current project",
    inputSchema: z.object({
      name: z.string().describe("File name (with or without extension, e.g., 'Button.tsx' or 'Button')"),
      code: z.string().optional().describe("Initial file code. Leave empty if not requested otherwise by the user."),
      type: z.string().optional().describe("File type (e.g., 'component', 'page'). Defaults to 'component'"),
    }),
    execute: async (params) => {
      try {
        if (!userId) {
          return ErrorMessages.userIdRequired();
        }

        const nameWithoutExt = params.name.replace(/\.(tsx?|jsx?)$/, "");
        const extension = params.name.match(/\.(tsx?|jsx?)$/)?.[1] || "tsx";
        const defaultCode =
          params.code || `export default function ${nameWithoutExt}() {\n  return <div>${nameWithoutExt}</div>;\n}`;

        const fileId = await ctx.runMutation(api.files.create, {
          projectId,
          name: nameWithoutExt,
          type: params.type || "component",
          extension: extension,
          code: defaultCode,
        });

        return JSON.stringify({
          success: true,
          fileId,
          message: `File "${params.name}" created successfully`,
        });
      } catch (error) {
        return ErrorMessages.genericError("creating file", error);
      }
    },
  });
}
