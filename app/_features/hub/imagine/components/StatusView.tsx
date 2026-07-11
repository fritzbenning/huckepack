import { prepareProjectRoute } from "@hub/projects";
import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { Heading } from "@shared/ui-kit/typo";
import Button from "@shared/ui-kit/ui/Button";
import type { UIMessage } from "ai";
import { useEffect, useEffectEvent, useMemo, useRef } from "react";
import { StepItem } from "./StepItem";

interface StatusViewProps {
  status: "inProgress" | "done";
  projectName: string | null;
  projectId: string | null;
  userName: string | null;
  messages: UIMessage[];
  stepStates: Map<string, { stepText: string; status: "in-progress" | "completed" }>;
  streamingStatus: string;
}

export function StatusView({ projectName, projectId, messages, streamingStatus, status }: StatusViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useEffectEvent(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: streamingStatus === "streaming" ? "smooth" : "auto" });
  });

  const stepItems = useMemo(() => {
    const stepMap = new Map<
      string,
      {
        stepId: string;
        stepText: string;
        status: "in-progress" | "completed";
        output?: string;
      }
    >();

    messages.forEach((message) => {
      if (message.parts && Array.isArray(message.parts)) {
        message.parts.forEach((part) => {
          if (part.type === "data-step") {
            const dataStepPart = part as {
              type: "data-step";
              id?: string;
              data: {
                stepText: string;
                status: "in-progress" | "completed";
                output?: string;
              };
            };

            const stepId = dataStepPart.id || `step-${dataStepPart.data.stepText}`;
            const existingStep = stepMap.get(stepId);

            stepMap.set(stepId, {
              stepId,
              stepText: dataStepPart.data.stepText,
              status: dataStepPart.data.status,
              output: dataStepPart.data.output ?? existingStep?.output,
            });
          }
        });
      }
    });

    return Array.from(stepMap.values());
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const projectRoute = projectId ? prepareProjectRoute(projectId) : null;

  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-2">
        <SectionTitle>New Project</SectionTitle>
        <Heading variant="hero" as="h1" className="text-shadow-[40px]/4">
          {projectName}
        </Heading>
      </div>
      <div className="flex flex-col gap-6">
        <div className="relative flex flex-col gap-6 px-5">
          <div className="flex min-w-0 flex-col gap-2 whitespace-normal">
            {stepItems.map((step) => (
              <StepItem
                key={step.stepId}
                stepId={step.stepId}
                stepText={step.stepText}
                status={step.status}
                output={step.output}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
        {status === "done" && projectRoute && (
          <div className="flex justify-center">
            <Button href={projectRoute} severity="primary" size="hero">
              Open Project
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
