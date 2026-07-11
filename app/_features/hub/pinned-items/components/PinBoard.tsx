import { PushPin, XIcon } from "@phosphor-icons/react";
import { executeAction } from "@shared/action";
import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import AsideItem from "@shared/ui-kit/ui/AsideItem";
import { useLocation } from "react-router-dom";
import { usePinnedItems } from "../hooks/usePinnedItems";

export function PinBoard() {
  const { pinnedItems, refetch, loading } = usePinnedItems();
  const location = useLocation();

  const handleUnpin = async (
    entityType: "project" | "file" | "workspace" | "team",
    entityId: string,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    event.preventDefault();

    try {
      const result = await executeAction("hub.unpin", {
        entity_type: entityType,
        entity_id: entityId,
      });

      if (result && typeof result === "object" && "success" in result && result.success) {
        refetch();
      }
    } catch (error) {
      console.error("Error unpinning item:", error);
    }
  };

  const getNavigationPath = (entityType: string, entityId: string): string => {
    switch (entityType) {
      case "project":
        return `/project/${entityId}/library`;
      case "file":
        return `/files/${entityId}`;
      case "workspace":
        return `/workspaces/${entityId}`;
      case "team":
        return `/team/${entityId}`;
      default:
        return "#";
    }
  };

  if (!pinnedItems || pinnedItems.length === 0 || pinnedItems.length === undefined) {
    return null;
  }

  return (
    <AnimatedSkeleton
      loading={loading}
      skeletonItems={2}
      skeletonHeight={52}
      containerClassName="space-y-3"
      itemClassName="h-5 flex-1"
      rounded="sm"
    >
      <div className="flex w-full flex-col gap-1">
        {pinnedItems.map((item) => {
          const entityType = item.pinnedItem.entityType;
          const entityId = item.pinnedItem.entityId;
          const entityName = item.entity?.name || `${entityType} ${entityId.slice(0, 8)}`;

          return (
            <AsideItem
              key={item.pinnedItem._id}
              icon={PushPin}
              href={getNavigationPath(entityType, entityId)}
              isActive={location.pathname === getNavigationPath(entityType, entityId)}
              primaryAction={{
                icon: XIcon,
                onClick: (e) => handleUnpin(entityType, entityId, e),
                title: "Unpin",
              }}
            >
              <div className="flex-1 truncate text-left">{entityName}</div>
            </AsideItem>
          );
        })}
      </div>
    </AnimatedSkeleton>
  );
}
