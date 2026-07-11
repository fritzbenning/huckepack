import type { Id } from "@convex/_generated/dataModel";

export interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ModalPropsMap {
  "workspace.new": BaseModalProps;
  "workspace.settings": BaseModalProps & { workspaceId: string };
  "team.new": BaseModalProps & { workspaceId?: string };
  "team.settings": BaseModalProps & { teamId: string; navigateOnDelete?: boolean };
  "project.new": BaseModalProps & { teamId?: Id<"teams">; onSuccess?: (projectId: string) => void };
  "project.settings": BaseModalProps & { projectId: string; navigateOnDelete?: boolean };
  "file.new": BaseModalProps & { projectId: string };
  "file.settings": BaseModalProps & { fileId: string; projectId: string };
  "file.delete": BaseModalProps & { 
    fileId: Id<"files">; 
    projectId: Id<"projects">;
    navigateTo?: "library" | "first-file";
  };
  "file.import": BaseModalProps & { projectId: string };
  "repo.connect": BaseModalProps;
  "component.select": BaseModalProps & {
    projectId: string;
    currentFileId: string;
    onSelect: (componentFileId: string) => void;
  };
  "application.notImplemented": BaseModalProps & { message?: string };
}

// Modal names from the props map
export type ModalName = keyof ModalPropsMap;

// Generic modal props type using the map
export type ModalProps<T extends ModalName> = T extends keyof ModalPropsMap ? ModalPropsMap[T] : never;

// Extract content props (excluding isOpen, onClose)
export type ModalContentProps<T extends ModalName> = Omit<ModalProps<T>, "isOpen" | "onClose">;

// Helper type for modal components
export type ModalComponent<T extends ModalName> = React.ComponentType<ModalProps<T>>;
