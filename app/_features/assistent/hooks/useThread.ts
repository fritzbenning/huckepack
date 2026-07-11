import type { Id } from "@convex/_generated/dataModel";
import {
  createFileChatThread,
  deleteFileChatThread,
  getFileChatThreads,
  setActiveThreadId,
  useFileManagerStore,
} from "@project/file-manager/stores/fileManagerStore";
import { useMemo } from "react";
import { DEFAULT_THREAD_TITLE } from "../constants";

export function useThread(currentFileId?: Id<"files">, projectId?: Id<"projects">) {
  const threadId = useFileManagerStore(
    (state) => (currentFileId ? (state.files[currentFileId]?.activeThreadId ?? null) : null),
    projectId || ("" as Id<"projects">)
  );

  const chatHistory = useFileManagerStore(
    (state) => (currentFileId ? state.files[currentFileId]?.chatHistory : undefined),
    projectId || ("" as Id<"projects">)
  );

  const threads = useMemo(() => {
    if (!chatHistory || chatHistory.length === 0) return [];
    return [...chatHistory].sort((a, b) => b.updatedAt - a.updatedAt);
  }, [chatHistory]);

  const handleCreateThread = async () => {
    if (!currentFileId || !projectId) return;

    const newThreadId = createFileChatThread(currentFileId, projectId, DEFAULT_THREAD_TITLE);
    setActiveThreadId(currentFileId, newThreadId, projectId);
    return newThreadId;
  };

  const handleDeleteThread = async (deletedThreadId: string) => {
    if (!currentFileId || !projectId) return;

    deleteFileChatThread(currentFileId, deletedThreadId, projectId);

    if (deletedThreadId === threadId) {
      const remainingThreads = getFileChatThreads(currentFileId, projectId);
      if (remainingThreads.length > 0) {
        setActiveThreadId(currentFileId, remainingThreads[0].threadId, projectId);
      } else {
        setActiveThreadId(currentFileId, null, projectId);
      }
    }
  };

  return {
    threadId,
    threads: threads.map((t) => ({
      _id: t.threadId,
      title: t.title,
      createdAt: t.createdAt,
      updatedAt: t.updatedAt,
    })),
    handleCreateThread,
    handleDeleteThread,
  };
}
