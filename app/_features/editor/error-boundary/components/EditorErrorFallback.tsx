import type { Id } from "@convex/_generated/dataModel";
import { useParamIds } from "@hooks/useParamIds";
import { BugBeetleIcon, CodeIcon } from "@phosphor-icons/react";
import { useStoreFile } from "@project/file-manager";
import { useAppSource } from "@sandpack/router";
import Button from "@shared/ui-kit/ui/Button";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ViewCodeModal } from "./ViewCodeModal";

interface EditorErrorFallbackProps {
  message: string;
  onRetry?: () => void;
  onOpenCodeEditor?: () => void;
}

export function EditorErrorFallback({ message, onRetry, onOpenCodeEditor }: EditorErrorFallbackProps) {
  const navigate = useNavigate();
  const [isCodeModalOpen, setIsCodeModalOpen] = useState(false);
  const { projectId, fileId } = useParamIds();

  const { file: currentFile } = useStoreFile(fileId, projectId ?? ("" as Id<"projects">));
  const { appSource } = useAppSource(projectId ?? null);
  const hasCode = currentFile?.code?.reference && appSource && fileId && projectId;

  return (
    <>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
        <BugBeetleIcon className="size-16 text-neutral-400 dark:text-neutral-600" weight="duotone" />
        <div className="flex flex-col items-center text-center">
          <h2 className="mb-2 font-semibold text-lg text-neutral-950 dark:text-neutral-100">Unable to load editor</h2>
          <p className="mb-6 max-w-2xl text-base text-neutral-600 dark:text-neutral-400">{message}</p>
          <div className="flex justify-center gap-2">
            {onRetry && (
              <Button onClick={onRetry} severity="primary">
                Try Again
              </Button>
            )}
            {onOpenCodeEditor && (
              <Button onClick={onOpenCodeEditor} severity="secondary" icon={CodeIcon}>
                Open Code Editor
              </Button>
            )}
            {hasCode ? (
              <Button onClick={() => setIsCodeModalOpen(true)} severity="secondary">
                View Code
              </Button>
            ) : (
              <Button onClick={() => navigate("/dashboard")} severity="secondary">
                Go to Dashboard
              </Button>
            )}
          </div>
        </div>
      </div>
      {hasCode && <ViewCodeModal isOpen={isCodeModalOpen} onClose={() => setIsCodeModalOpen(false)} />}
    </>
  );
}
