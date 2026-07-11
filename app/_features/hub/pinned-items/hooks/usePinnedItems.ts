import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";

export function usePinnedItems() {
  const pinnedItems = useQuery(api.pinnedItems.list);
  const pinnedItemsWithEntities = useQuery(api.pinnedItems.listWithEntities);

  const pin = useMutation(api.pinnedItems.pin).withOptimisticUpdate((localStore, args) => {
    const { entityType, entityId } = args;

    // Optimistically update isPinned query
    localStore.setQuery(api.pinnedItems.isPinned, { entityType, entityId }, true);

    // Get userId from existing list if available
    const currentList = localStore.getQuery(api.pinnedItems.list, {});
    const userId = currentList && currentList.length > 0 ? currentList[0].userId : ("" as Id<"users">);

    if (currentList !== undefined) {
      const now = Date.now();
      const tempId = crypto.randomUUID() as Id<"pinnedItems">;
      const newPinnedItem = {
        _id: tempId,
        _creationTime: now,
        userId,
        entityType,
        entityId,
        createdAt: now,
        updatedAt: now,
      };
      // Add to the beginning of the list (order desc)
      localStore.setQuery(api.pinnedItems.list, {}, [newPinnedItem, ...currentList]);
    }

    // Optimistically update listWithEntities query
    const currentListWithEntities = localStore.getQuery(api.pinnedItems.listWithEntities, {});
    if (currentListWithEntities !== undefined) {
      const now = Date.now();
      const tempId = crypto.randomUUID() as Id<"pinnedItems">;
      const userIdFromEntities =
        currentListWithEntities.length > 0 ? currentListWithEntities[0].pinnedItem.userId : ("" as Id<"users">);
      const newPinnedItem = {
        _id: tempId,
        _creationTime: now,
        userId: userIdFromEntities,
        entityType,
        entityId,
        createdAt: now,
        updatedAt: now,
      };
      // Add to the beginning with null entity (will be populated by server)
      localStore.setQuery(api.pinnedItems.listWithEntities, {}, [
        { pinnedItem: newPinnedItem, entity: null },
        ...currentListWithEntities,
      ]);
    }
  });

  const unpin = useMutation(api.pinnedItems.unpin).withOptimisticUpdate((localStore, args) => {
    const { entityType, entityId } = args;

    // Optimistically update isPinned query
    localStore.setQuery(api.pinnedItems.isPinned, { entityType, entityId }, false);

    // Optimistically update list query
    const currentList = localStore.getQuery(api.pinnedItems.list, {});
    if (currentList !== undefined) {
      const filteredList = currentList.filter(
        (item) => !(item.entityType === entityType && item.entityId === entityId)
      );
      localStore.setQuery(api.pinnedItems.list, {}, filteredList);
    }

    // Optimistically update listWithEntities query
    const currentListWithEntities = localStore.getQuery(api.pinnedItems.listWithEntities, {});
    if (currentListWithEntities !== undefined) {
      const filteredList = currentListWithEntities.filter(
        (item) => !(item.pinnedItem.entityType === entityType && item.pinnedItem.entityId === entityId)
      );
      localStore.setQuery(api.pinnedItems.listWithEntities, {}, filteredList);
    }
  });

  return {
    pinnedItems: pinnedItemsWithEntities || [],
    data: pinnedItemsWithEntities || [],
    loading: pinnedItems === undefined || pinnedItemsWithEntities === undefined,
    error: null,
    refetch: () => {}, // Convex queries are reactive
    pin,
    unpin,
  };
}
