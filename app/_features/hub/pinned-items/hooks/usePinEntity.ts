import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";
import { useState } from "react";
import type { PinnedEntityType } from "../types";
import { usePinnedItems } from "./usePinnedItems";

export function usePinEntity(entityType: PinnedEntityType, entityId: string) {
  const isPinned = useQuery(api.pinnedItems.isPinned, { entityType, entityId }) ?? false;
  const { pin, unpin } = usePinnedItems();
  const [loading, setLoading] = useState(false);

  const togglePin = async (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }

    setLoading(true);
    try {
      if (isPinned) {
        await unpin({ entityType, entityId });
      } else {
        await pin({ entityType, entityId });
      }
    } catch (error) {
      console.error("Error toggling pin:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    isPinned,
    togglePin,
    loading,
  };
}

