import { MarkdownText } from "@assistent/components/MarkdownText";
import { prepareProjectRoute } from "@hub/projects/services/prepareProjectRoute";
import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import Button from "@shared/ui-kit/ui/Button";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import type { UIMessage } from "ai";
import { useNavigate } from "react-router-dom";

interface ImagineMessagePartProps {
  part: UIMessage["parts"][number];
  message: UIMessage;
  messageId: string;
  index: number;
  stepStates: Map<string, { stepText: string; status: "in-progress" | "completed" }>;
}

export function ImagineMessagePart({ part, message, messageId, index, stepStates }: ImagineMessagePartProps) {
  const navigate = useNavigate();

  if (part.type === "text" && part.text) {
    const text = part.text.trim();

    // Check if this text matches a step status
    const stepStatus = stepStates.get(text);

    if (stepStatus) {
      // This is a step - render with spinner if in progress
      return (
        <FadeIn key={`step-${messageId}-${index}`} className="flex items-center gap-2">
          {stepStatus.status === "in-progress" && <Spinner size="sm" />}
          <span className="text-sm text-neutral-600 dark:text-neutral-400">{stepStatus.stepText}</span>
        </FadeIn>
      );
    }

    // Regular text part
    return (
      <FadeIn key={`text-${messageId}-${index}`} className="flex flex-col gap-2.5">
        <MarkdownText content={part.text} />
      </FadeIn>
    );
  }

  if (part.type === "data-step") {
    const dataStepPart = part as {
      type: "data-step";
      id?: string;
      data: { stepText: string; status: "in-progress" | "completed" };
    };
    const { stepText, status } = dataStepPart.data;
    const partKey = dataStepPart.id || `data-step-${messageId}-${index}`;

    return (
      <FadeIn key={partKey} className="flex items-center gap-2">
        {status === "in-progress" && <Spinner size="sm" />}
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{stepText}</span>
      </FadeIn>
    );
  }

  if (part.type === "data-meta") {
    const dataMetaPart = part as { type: "data-meta"; data: { projectId?: string; projectName?: string } };
    const { projectId } = dataMetaPart.data;

    const handleNavigateToProject = () => {
      if (projectId) {
        const route = prepareProjectRoute(projectId);
        navigate(route);
      }
    };

    return (
      <FadeIn key={`data-meta-${messageId}-${index}`} className="flex justify-center pt-4">
        <Button onClick={handleNavigateToProject} size="large">
          Open Project
        </Button>
      </FadeIn>
    );
  }

  return null;
}
