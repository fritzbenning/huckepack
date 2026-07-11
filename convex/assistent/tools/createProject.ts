import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import { tool } from "ai";
import { z } from "zod";
import { ErrorMessages } from "./errorMessages";

export function createProjectCreateTool(ctx: ActionCtx, userId: Id<"users">) {
  return tool({
    description: "Create a new project within a team",
    inputSchema: z.object({
      teamId: z.string().describe("Team ID"),
      name: z.string().describe("Project name"),
      description: z.string().optional().describe("Project description (optional)"),
    }),
    execute: async (params) => {
      try {
        if (!userId) {
          return ErrorMessages.userIdRequired();
        }

        const projectId = await ctx.runMutation(api.projects.create, {
          teamId: params.teamId as Id<"teams">,
          name: params.name,
          description: params.description,
        });

        return JSON.stringify({
          success: true,
          projectId,
          message: `Project "${params.name}" created successfully`,
        });
      } catch (error) {
        return ErrorMessages.genericError("creating project", error);
      }
    },
  });
}
