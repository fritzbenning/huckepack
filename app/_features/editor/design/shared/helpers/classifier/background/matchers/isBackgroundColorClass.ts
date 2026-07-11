import { createClassClassifier } from "../../createClassClassifier";
import { backgroundRules } from "../rules";

const backgroundClassifier = createClassClassifier({
  prefix: "bg-",
  rules: backgroundRules,
});

export function isBackgroundColorClass(className: string): boolean {
  return backgroundClassifier.belongsTo(className, "backgroundColor");
}
