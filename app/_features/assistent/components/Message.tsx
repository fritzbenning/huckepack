import type { UIMessage } from "ai";
import { AssistantMessage } from "./AssistantMessage";
import { UserMessage } from "./UserMessage";

export function Message({ message }: { message: UIMessage }) {
  const isUser = message.role === "user";

  return isUser ? <UserMessage message={message} /> : <AssistantMessage message={message} />;
}
