import type { ClassificationRule } from "../types";
import {
  BACKGROUND_ATTACHMENT_CLASSES,
  BACKGROUND_POSITION_CLASSES,
  BACKGROUND_REPEAT_CLASSES,
  BACKGROUND_SIZE_CLASSES,
  COLOR_KEYWORDS,
  COLOR_NAMES,
} from "./constants";
import { isGradientStopClass } from "./utils/isGradientStopClass";
import { matchesBackgroundColor } from "./utils/matchesBackgroundColor";
import { matchesBackgroundImage } from "./utils/matchesBackgroundImage";

export const backgroundRules: ClassificationRule[] = [
  {
    name: "clip",
    property: "backgroundClip",
    matches: (cls) => cls.startsWith("bg-clip-"),
  },
  {
    name: "origin",
    property: "backgroundOrigin",
    matches: (cls) => cls.startsWith("bg-origin-"),
  },
  {
    name: "attachment",
    property: "backgroundAttachment",
    matches: (cls) => BACKGROUND_ATTACHMENT_CLASSES.includes(cls),
  },
  {
    name: "repeat",
    property: "backgroundRepeat",
    matches: (cls) => BACKGROUND_REPEAT_CLASSES.includes(cls),
  },
  {
    name: "size",
    property: "backgroundSize",
    matches: (cls) => BACKGROUND_SIZE_CLASSES.includes(cls),
  },
  {
    name: "position",
    property: "backgroundPosition",
    matches: (cls) => BACKGROUND_POSITION_CLASSES.includes(cls),
  },
  {
    name: "image",
    property: "backgroundImage",
    matches: (cls) => matchesBackgroundImage(cls) || isGradientStopClass(cls),
  },
  {
    name: "color",
    property: "backgroundColor",
    matches: (cls) => matchesBackgroundColor(cls, COLOR_KEYWORDS, COLOR_NAMES),
  },
];
