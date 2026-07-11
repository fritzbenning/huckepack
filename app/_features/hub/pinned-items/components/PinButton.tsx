import { PushPin, PushPinSlash } from "@phosphor-icons/react";
import { usePinEntity } from "../hooks/usePinEntity";
import type { PinnedEntityType } from "../types";

interface PinButtonProps {
  entityType: PinnedEntityType;
  entityId: string;
  entityName?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function PinButton({ entityType, entityId, className = "", size = "md" }: PinButtonProps) {
  const { isPinned, togglePin, loading } = usePinEntity(entityType, entityId);

  const sizeClasses = {
    sm: "w-3 h-3",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  const buttonSizeClasses = {
    sm: "p-1",
    md: "p-1.5",
    lg: "p-2",
  };

  return (
    <button
      type="button"
      onClick={togglePin}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-md transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-850 ${loading ? "cursor-not-allowed opacity-50" : "cursor-pointer"}
        ${buttonSizeClasses[size]}
        ${className}
      `}
      title={isPinned ? "Unpin" : "Pin"}
    >
      {isPinned ? (
        <PushPinSlash className={`${sizeClasses[size]} text-neutral-600 dark:text-neutral-400`} weight="duotone" />
      ) : (
        <PushPin className={`${sizeClasses[size]} text-neutral-400 dark:text-neutral-600`} weight="duotone" />
      )}
    </button>
  );
}
