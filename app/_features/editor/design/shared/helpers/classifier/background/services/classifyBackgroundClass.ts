import { createClassClassifier } from "../../createClassClassifier";
import { backgroundRules } from "../rules";

const backgroundClassifier = createClassClassifier({
  prefix: "bg-",
  rules: backgroundRules,
});

export function classifyBackgroundClass(className: string): string | null {
  if (className.startsWith("from-") || className.startsWith("via-") || className.startsWith("to-")) {
    return "backgroundImage";
  }
  return backgroundClassifier.classify(className);
}
