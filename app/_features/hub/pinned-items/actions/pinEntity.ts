import { convex } from "@lib/convex";
import { api } from "@convex/_generated/api";
import type { PinnedEntityType } from "../types";

export interface PinEntityParams {
  entity_type: PinnedEntityType;
  entity_id: string;
  entity?: {
    name?: string;
  };
}

export interface PinEntityResult {
  success: boolean;
  error?: string;
}

/**
 * Pin an entity (workspace, team, project, or file).
 * Uses Convex mutation for reactive updates.
 */
export async function pinEntity(params: PinEntityParams): Promise<PinEntityResult> {
  try {
    if (!params.entity_id || typeof params.entity_id !== "string" || params.entity_id.trim() === "") {
      const errorMsg = `Missing or invalid entity_id: ${JSON.stringify(params.entity_id)}`;
      console.error("Error in pinEntity action:", errorMsg, "Full params:", params);
      return {
        success: false,
        error: errorMsg,
      };
    }

    if (!params.entity_type) {
      const errorMsg = `Missing entity_type: ${JSON.stringify(params.entity_type)}`;
      console.error("Error in pinEntity action:", errorMsg, "Full params:", params);
      return {
        success: false,
        error: errorMsg,
      };
    }

    await convex.mutation(api.pinnedItems.pin, {
      entityType: params.entity_type,
      entityId: params.entity_id,
    });

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in pinEntity action:", error);

    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to pin entity",
    };
  }
}
