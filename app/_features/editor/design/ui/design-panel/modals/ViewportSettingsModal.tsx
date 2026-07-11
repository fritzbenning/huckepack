import { Input } from "@shared/ui-kit/inputs/input";
import { Switch } from "@shared/ui-kit/inputs/switch";
import { ModalContainer } from "@shared/ui-kit/ui/ModalContainer";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalHeader } from "@shared/ui-kit/ui/ModalHeader";
import type { Id } from "@convex/_generated/dataModel";
import { useFile, useUpdateFile } from "@project/file";
import { updateFileViewportWidth } from "@project/file-manager";
import type { BasePinnedModalProps } from "@shared/pinned-modal/types";
import { useEffect, useRef, useState } from "react";

interface ViewportSettingsModalProps extends BasePinnedModalProps {
  projectId: string;
  fileId: Id<"files">;
}

export function ViewportSettingsModal({ isOpen, onClose, projectId, fileId }: ViewportSettingsModalProps) {
  const { file } = useFile(fileId);
  const updateFile = useUpdateFile();

  const [viewportWidth, setViewportWidth] = useState<number>(390);
  const [viewportBehavior, setViewportBehavior] = useState<"auto" | "fixed">("fixed");
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (isOpen && file && !hasInitialized.current) {
      setViewportWidth(file.viewportWidth ?? 390);
      setViewportBehavior(file.viewportBehavior ?? "fixed");
      hasInitialized.current = true;
    }
    if (!isOpen) {
      hasInitialized.current = false;
    }
  }, [isOpen, file]);

  const handleConfirm = async (newViewportWidth?: number, newViewportBehavior?: "auto" | "fixed") => {
    if (!file) return;

    const finalViewportWidth = newViewportWidth ?? viewportWidth;
    const finalViewportBehavior = newViewportBehavior ?? viewportBehavior;

    updateFileViewportWidth(fileId, finalViewportWidth, projectId);

    try {
      await updateFile({
        id: fileId,
        viewportWidth: finalViewportWidth,
        viewportBehavior: finalViewportBehavior,
      });
    } catch (error) {
      console.error("Failed to update viewport settings:", error);
      // Revert optimistic update on error
      updateFileViewportWidth(fileId, file.viewportWidth, projectId);
    }
  };

  if (!isOpen) return null;

  const isAuto = viewportBehavior === "auto";

  return (
    <ModalContainer className="w-80" size="custom">
      <ModalHeader title="Default viewport settings" onClose={onClose} />
      <ModalContent>
        <div className="space-y-4">
          <Input
            label="Viewport width"
            id="viewport-width"
            type="number"
            value={viewportWidth.toString()}
            onChange={(value) => {
              const numValue = Number(value);
              if (!Number.isNaN(numValue) && numValue > 0) {
                setViewportWidth(numValue);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const numValue = Number(e.currentTarget.value);
                if (!Number.isNaN(numValue) && numValue > 0) {
                  handleConfirm(numValue);
                }
              }
            }}
            onBlur={(e) => {
              const numValue = Number(e.currentTarget.value);
              if (!Number.isNaN(numValue) && numValue > 0) {
                handleConfirm(numValue);
              }
            }}
            placeholder="Enter width"
            dimension="small"
            tone="emphasized"
            disabled={isAuto}
          />
          <div className="flex items-center gap-3">
            <Switch
              id="viewport-behavior"
              checked={isAuto}
              onCheckedChange={(checked) => {
                const newBehavior = checked ? "auto" : "fixed";
                setViewportBehavior(newBehavior);
                handleConfirm(undefined, newBehavior);
              }}
              size="small"
            />
            <label htmlFor="viewport-behavior" className="font-medium text-xs">
              Auto width
            </label>
          </div>
        </div>
      </ModalContent>
    </ModalContainer>
  );
}
