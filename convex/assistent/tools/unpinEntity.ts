import { tool } from "ai";
import { z } from "zod";

export function createHubUnpinTool() {
  return tool({
    description: "Unpin an entity from favorites",
    inputSchema: z.object({
      entityId: z.string().describe("Entity ID"),
      entityType: z.string().describe("Type of entity: 'workspace' | 'team' | 'project' | 'file'"),
    }),
    execute: async (params) => {
      return JSON.stringify({
        success: true,
        message: `${params.entityType} "${params.entityId}" is being unpinned from favorites`,
        clientSide: true,
      });
    },
  });
}
