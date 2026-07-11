import type { Id } from "@convex/_generated/dataModel";
import { ClockIcon } from "@phosphor-icons/react";
import { ModalHeader } from "@shared/ui-kit/ui/ModalHeader";
import { Activity } from "react";
import { HistoryTimeline } from "./HistoryTimeline";

interface EditorBodyModalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: Id<"projects">;
  fileId: Id<"files">;
}

export function EditorBodyModalContainer({ isOpen, onClose, projectId, fileId }: EditorBodyModalContainerProps) {
  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <div className="flex h-full flex-col border-neutral-100 border-t bg-white dark:border-neutral-750 dark:bg-neutral-850">
        <ModalHeader title="Your changes" icon={ClockIcon} onClose={onClose} />
        <div className="flex-1 overflow-hidden">
          <HistoryTimeline projectId={projectId} fileId={fileId} />
        </div>
      </div>
    </Activity>
  );
}
