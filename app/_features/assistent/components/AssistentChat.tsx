import type { Id } from "@convex/_generated/dataModel";
import { PlusIcon } from "@phosphor-icons/react";
import { setActiveThreadId } from "@project/file-manager/stores/fileManagerStore";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import ThreadView from "../components/ThreadView";
import { useThread } from "../hooks/useThread";
import { ThreadTab } from "./ThreadTab";

export default function AssistentChat({
  projectId,
  currentFileId,
}: {
  projectId?: Id<"projects">;
  currentFileId?: Id<"files">;
}) {
  const { threadId, threads, handleCreateThread, handleDeleteThread } = useThread(currentFileId, projectId);

  return (
    <div className="grid h-full min-h-0 min-w-0 grid-rows-[auto_1fr]">
      <div className="no-scrollbar flex min-w-0 items-stretch gap-1 overflow-x-auto border-neutral-100 border-b px-3.5 py-2 dark:border-neutral-800">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-sm bg-neutral-100 text-2xs transition-colors hover:bg-neutral-150 dark:bg-neutral-950 hover:dark:bg-neutral-950">
          <InlineIconButton
            icon={PlusIcon}
            onClick={handleCreateThread}
            title="New Thread"
            size="small"
            weight="regular"
          />
        </div>
        {threads?.map((thread) => (
          <ThreadTab
            key={thread._id}
            thread={thread}
            isActive={threadId === thread._id}
            onClick={() => currentFileId && projectId && setActiveThreadId(currentFileId, thread._id, projectId)}
            onDelete={() => handleDeleteThread(thread._id)}
          />
        ))}
      </div>

      {threadId && currentFileId && (
        <ThreadView threadId={threadId} projectId={projectId} currentFileId={currentFileId} />
      )}
    </div>
  );
}
