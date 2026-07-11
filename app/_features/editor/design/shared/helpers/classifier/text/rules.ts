import type { ClassificationRule } from "../types";
import { matchesFontSize } from "./utils/matchesFontSize";
import { matchesTextAlign } from "./utils/matchesTextAlign";
import { matchesTextColor } from "./utils/matchesTextColor";

export const textRules: ClassificationRule[] = [
  {
    name: "align",
    property: "textAlign",
    matches: (cls) => matchesTextAlign(cls),
  },
  {
    name: "size",
    property: "fontSize",
    matches: (cls) => matchesFontSize(cls),
  },
  {
    name: "color",
    property: "textColor",
    matches: (cls) => matchesTextColor(cls),
  },
];
