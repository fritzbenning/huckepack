import { createClassClassifier } from "../../createClassClassifier";
import { backgroundRules } from "../rules";

const backgroundClassifier = createClassClassifier({
  prefix: "bg-",
  rules: backgroundRules,
});

export function isBackgroundOriginClass(className: string): boolean {
  return backgroundClassifier.belongsTo(className, "backgroundOrigin");
}
