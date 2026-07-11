import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { useCurrentUser } from "@hub/auth/hooks/useCurrentUser";
import { useMutation, useQuery } from "convex/react";
import React, { useCallback, useEffect, useRef } from "react";
import { useFileProcessor } from "./useFileProcessor";

interface ActiveEditor {
  userId: string;
  username: string;
  sessionId: string;
  lastSeen: number;
}

import type { Id } from "@convex/_generated/dataModel";

let globalBroadcastCodeChange: ((fileId: Id<"files">, code: string) => void) | null = null;

export const getBroadcastCodeChange = () => globalBroadcastCodeChange;

const useThrottleCallback = <Params extends unknown[], Return>(
  callback: (...args: Params) => Return,
  delay: number
) => {
  const lastCall = useRef(0);
  const timeout = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Params) => {
      const now = Date.now();
      const remainingTime = delay - (now - lastCall.current);

      if (remainingTime <= 0) {
        if (timeout.current) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }
        lastCall.current = now;
        callback(...args);
      } else if (!timeout.current) {
        timeout.current = setTimeout(() => {
          lastCall.current = Date.now();
          timeout.current = null;
          callback(...args);
        }, remainingTime);
      }
    },
    [callback, delay]
  );
};

export function useRealtimeCodeSync(projectId: Id<"projects">, activeFileIds: Id<"files">[], throttleMs: number = 300) {
  const sessionIdRef = useRef<string>(crypto.randomUUID());
  const { convexUser } = useCurrentUser();

  const projectIdAsId = projectId;

  const activeEditorsQuery = useQuery(api.presence.list, projectId ? { projectId: projectIdAsId } : "skip");

  const joinPresence = useMutation(api.presence.join);
  const updateLastSeen = useMutation(api.presence.updateLastSeen);
  const leavePresence = useMutation(api.presence.leave);
  const broadcastCodeChangeMutation = useMutation(api.collaboration.broadcastCodeChange);

  const activeFileIdsAsIds = activeFileIds;

  const activeEditors = React.useMemo<Record<string, ActiveEditor>>(() => {
    if (!activeEditorsQuery) return {};

    const editors: Record<string, ActiveEditor> = {};
    activeEditorsQuery.forEach((presence) => {
      if (presence.sessionId !== sessionIdRef.current) {
        editors[presence.sessionId] = {
          userId: presence.userId,
          username: presence.username,
          sessionId: presence.sessionId,
          lastSeen: presence.lastSeen,
        };
      }
    });
    return editors;
  }, [activeEditorsQuery]);

  const broadcastCodeChange = useThrottleCallback(async (fileId: Id<"files">, code: string) => {
    if (!convexUser) {
      console.warn("[Realtime] User not authenticated for broadcast");
      return;
    }

    try {
      await broadcastCodeChangeMutation({
        fileId,
        code,
        sessionId: sessionIdRef.current,
      });
    } catch (error) {
      console.error("[Realtime] Error broadcasting code change:", error);
    }
  }, throttleMs);

  useEffect(() => {
    globalBroadcastCodeChange = broadcastCodeChange;
    return () => {
      globalBroadcastCodeChange = null;
    };
  }, [broadcastCodeChange]);

  useEffect(() => {
    if (!projectId || !convexUser) return;

    const username = convexUser.name || convexUser.email?.split("@")[0] || "Collaborator";

    joinPresence({
      projectId: projectIdAsId,
      sessionId: sessionIdRef.current,
      username,
    }).catch((error) => {
      console.error("[Realtime] Error joining presence:", error);
    });

    const lastSeenInterval = setInterval(() => {
      updateLastSeen({
        projectId: projectIdAsId,
        sessionId: sessionIdRef.current,
      }).catch((error) => {
        console.error("[Realtime] Error updating last seen:", error);
      });
    }, 10000);

    return () => {
      clearInterval(lastSeenInterval);
      leavePresence({
        projectId: projectIdAsId,
        sessionId: sessionIdRef.current,
      }).catch((error) => {
        console.error("[Realtime] Error leaving presence:", error);
      });
    };
  }, [projectId, convexUser, projectIdAsId, joinPresence, updateLastSeen, leavePresence]);

  useFileProcessor(projectId, activeFileIds);

  return {
    broadcastCodeChange,
    activeEditors,
    isReady: !!convexUser,
  };
}
