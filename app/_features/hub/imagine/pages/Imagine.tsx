import { useTheme } from "@application/theme";
import { useCurrentUser } from "@hub/auth";
import { HubPage } from "@hub/layout";
import { useTeamsByOwner } from "@hub/teams/hooks/useTeamsByOwner";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { GradFlow } from "gradflow";
import { AnimatePresence } from "motion/react";
import { useEffect } from "react";
import { InputView } from "../components/InputView";
import { StatusView } from "../components/StatusView";
import { useImagineWorkflow } from "../hooks/useImagineWorkflow";

export default function Imagine() {
  const { convexUser } = useCurrentUser();
  const { isDarkMode } = useTheme();
  const { personalTeamId } = useTeamsByOwner(convexUser?._id || null);

  const { messages, status, sendMessage, stepStates, projectName, projectId, workflowStatus } = useImagineWorkflow({
    teamId: personalTeamId ?? undefined,
  });

  const handleSend = (prompt: string) => {
    if (!personalTeamId) {
      console.error("[Imagine] Cannot send message: teamId is not available");
      return;
    }
    sendMessage({
      parts: [{ type: "text", text: prompt }],
    });
  };

  const renderContent = () => {
    if (workflowStatus === "pending") {
      return (
        <div className="flex flex-1 items-center justify-center">
          <Spinner key="spinner" size="xl" label="Thinking..." />
        </div>
      );
    }

    if (workflowStatus === "inProgress" || workflowStatus === "done") {
      return (
        <StatusView
          key="status-view"
          status={workflowStatus as "inProgress" | "done"}
          projectName={projectName}
          projectId={projectId}
          userName={convexUser?.name ?? null}
          messages={messages}
          stepStates={stepStates}
          streamingStatus={status}
        />
      );
    }

    return <InputView key="input-view" onSend={handleSend} status={status} />;
  };

  return (
    <>
      <HubPage className="relative h-screen w-full overflow-y-auto" background="transparent">
        <div className="relative z-10 mx-auto mt-10 flex w-full max-w-2xl flex-1 flex-col py-4">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </div>
      </HubPage>
      <div className="absolute inset-0 h-full w-full animate-delay-300 animate-gradient-fade-in-up">
        <GradFlow
          config={{
            color1: { r: 218, g: 103, b: 103 },
            color2: { r: 100, g: 25, b: 240 },
            color3: isDarkMode ? { r: 0, g: 0, b: 0 } : { r: 255, g: 255, b: 255 },
            speed: workflowStatus === "inProgress" ? 0.8 : 0.15,
            scale: 0.8,
            type: "stripe",
            noise: 0,
          }}
        />
      </div>
    </>
  );
}
