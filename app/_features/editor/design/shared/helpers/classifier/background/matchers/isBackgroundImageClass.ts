import { createClassClassifier } from "../../createClassClassifier";
import { backgroundRules } from "../rules";
import { classifyBackgroundClass } from "../services/classifyBackgroundClass";

const backgroundClassifier = createClassClassifier({
  prefix: "bg-",
  rules: backgroundRules,
});

export function isBackgroundImageClass(className: string): boolean {
  return (
    backgroundClassifier.belongsTo(className, "backgroundImage") ||
    classifyBackgroundClass(className) === "backgroundImage"
  );
}
