import { ShortcutHint } from "@shared/ui-kit/ui/ShortcutHint";

export interface SpotlightFooterProps {
  selectedFileId: string | null;
  isComponent: (fileId: string) => boolean;
  fileId?: string;
}

export function SpotlightFooter({ selectedFileId, isComponent, fileId }: SpotlightFooterProps) {
  const selectedIsComponent = selectedFileId ? isComponent(selectedFileId) : false;

  return (
    <div className="border-neutral-150 border-t bg-neutral-50 px-6 py-3 dark:border-neutral-850 dark:bg-neutral-950/50">
      <div className="flex items-center justify-between text-neutral-500 text-xs dark:text-neutral-400">
        <div className="flex items-center gap-4">
          {selectedIsComponent && fileId ? (
            <>
              <ShortcutHint shortcutKey="Enter" label="Insert" />
              <ShortcutHint shortcutKey="Tab" label="Open" />
            </>
          ) : (
            <ShortcutHint shortcutKey="Enter" label="Open file" />
          )}
        </div>
        <ShortcutHint shortcutKey="Esc" label="Close" />
      </div>
    </div>
  );
}
