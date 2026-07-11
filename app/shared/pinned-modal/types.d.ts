import type { Id } from "@convex/_generated/dataModel";

export interface BasePinnedModalProps {
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<HTMLElement | null>;
  asidePosition: "left" | "right";
}

export interface PinnedModalPropsMap {
  "property-panel.help": BasePinnedModalProps;
  "design-panel.help": BasePinnedModalProps;
  "file-tree.help": BasePinnedModalProps;
  "design-panel.viewport-settings": BasePinnedModalProps & { projectId: string; fileId: Id<"files"> };
  "design-panel.color-picker": BasePinnedModalProps & {
    projectId: Id<"projects">;
    fileId: Id<"files">;
    showOpacity?: boolean;
    featurePrefix?: "backgroundColor" | "textColor";
    title?: string;
  };
  "design-panel.text-color-picker": BasePinnedModalProps & {
    projectId: Id<"projects">;
    fileId: Id<"files">;
    showOpacity?: boolean;
    featurePrefix?: "backgroundColor" | "textColor";
    title?: string;
  };
}

// Pinned modal names from the props map
export type PinnedModalName = keyof PinnedModalPropsMap;

// Generic pinned modal props type using the map
export type PinnedModalProps<T extends PinnedModalName> = T extends keyof PinnedModalPropsMap
  ? PinnedModalPropsMap[T]
  : never;

// Extract content props (excluding isOpen, onClose, triggerRef, asidePosition)
export type PinnedModalContentProps<T extends PinnedModalName> = Omit<
  PinnedModalProps<T>,
  "isOpen" | "onClose" | "triggerRef" | "asidePosition"
>;

// Helper type for pinned modal components
export type PinnedModalComponent<T extends PinnedModalName> = React.ComponentType<PinnedModalProps<T>>;
