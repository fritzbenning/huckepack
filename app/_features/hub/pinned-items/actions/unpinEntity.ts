import { convex } from "@lib/convex";
import { api } from "@convex/_generated/api";
import type { PinnedEntityType } from "../types";

export interface UnpinEntityParams {
  entity_type: PinnedEntityType;
  entity_id: string;
}

export interface UnpinEntityResult {
  success: boolean;
  error?: string;
}

/**
 * Unpin an entity (workspace, team, project, or file).
 * Uses Convex mutation for reactive updates.
 */
export async function unpinEntity(params: UnpinEntityParams): Promise<UnpinEntityResult> {
  try {
    if (!params.entity_id || typeof params.entity_id !== "string" || params.entity_id.trim() === "") {
      const errorMsg = `Missing or invalid entity_id: ${JSON.stringify(params.entity_id)}`;
      console.error("Error in unpinEntity action:", errorMsg, "Full params:", params);
      return {
        success: false,
        error: errorMsg,
      };
    }

    if (!params.entity_type) {
      const errorMsg = `Missing entity_type: ${JSON.stringify(params.entity_type)}`;
      console.error("Error in unpinEntity action:", errorMsg, "Full params:", params);
      return {
        success: false,
        error: errorMsg,
      };
    }

    await convex.mutation(api.pinnedItems.unpin, {
      entityType: params.entity_type,
      entityId: params.entity_id,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in unpinEntity action:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unpin entity",
    };
  }
}
