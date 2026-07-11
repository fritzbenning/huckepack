import { tool } from "ai";
import { z } from "zod";

export function createHubPinTool() {
  return tool({
    description: "Pin an entity (workspace, team, project, file) to favorites",
    inputSchema: z.object({
      entityId: z.string().describe("Entity ID (workspace, team, project, or file)"),
      entityType: z.string().describe("Type of entity: 'workspace' | 'team' | 'project' | 'file'"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `${params.entityType} "${params.entityId}" is being pinned to favorites`,
        clientSide: true,
      });
    },
  });
}
