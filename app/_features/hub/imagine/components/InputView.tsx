import { MessageInputBox } from "@assistent/components/MessageInputBox";
import { useCurrentUser } from "@hub/auth";
import { FadeIn } from "@shared/ui-kit/animations/FadeIn";
import { SectionTitle } from "@shared/ui-kit/editor/SectionTitle";
import { Heading } from "@shared/ui-kit/typo";

interface InputViewProps {
  onSend: (prompt: string) => void;
  status?: "loading" | "idle" | "error" | "submitted" | "streaming" | "ready";
}

export function InputView({ onSend, status }: InputViewProps) {
  const { convexUser } = useCurrentUser();
  return (
    <div className="flex flex-col gap-12">
      <div className="flex flex-col items-center gap-2">
        <FadeIn className="opacity-80">
          <SectionTitle>Imagine new project</SectionTitle>
        </FadeIn>
        <FadeIn className="max-w-100 text-center">
          <Heading variant="hero" as="h1" className="text-shadow-[40px]/4">
            Hey {convexUser?.name?.split(" ")[0]}, let's build what's on your mind!
          </Heading>
        </FadeIn>
      </div>
      <div className="relative flex flex-col gap-6 px-5">
        <FadeIn>
          <MessageInputBox size="large" onSend={onSend} placeholder="Describe your new project ..." status={status} />
        </FadeIn>
      </div>
    </div>
  );
}
