import type { ReactNode } from "react";

interface SandpackPreviewActionProps {
  onClick: () => void;
  children: ReactNode;
}

export function SandpackPreviewAction({ onClick, children }: SandpackPreviewActionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="m-2 flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-neutral-500 hover:text-primary-500 dark:border-neutral-600 dark:bg-neutral-850 dark:text-neutral-400 dark:hover:text-primary-300"
    >
      {children}
    </button>
  );
}
