import { PaperclipIcon } from "@phosphor-icons/react";
import { IconAction } from "@shared/ui-kit/ui/IconAction";
import type React from "react";

interface AttachmentProps {
  title: string;
  onDetach: () => void;
}

export const Attachment: React.FC<AttachmentProps> = ({ title, onDetach }) => {
  return (
    <div className="mb-2 flex max-w-min items-center gap-1 text-nowrap rounded-sm border border-neutral-200 bg-neutral-50 px-1.5 py-1 dark:border-neutral-600 dark:bg-neutral-750">
      <PaperclipIcon className="size-3.5 text-neutral-500 dark:text-neutral-400" weight="regular" />
      <span className="font-semibold text-2xs text-neutral-500 dark:text-neutral-300">{title}</span>
      <IconAction onClick={onDetach} size="xs" className="ml-0.5" title="Detach node" />
    </div>
  );
};
