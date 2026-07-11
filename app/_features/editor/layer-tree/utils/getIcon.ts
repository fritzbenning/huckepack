import type { Icon } from "@phosphor-icons/react";
import {
  ArrowSquareDownIcon,
  ArrowSquareRightIcon,
  CursorText,
  DiamondsFourIcon,
  File,
  GridFourIcon,
  Image,
  Lightning,
  Square,
  SquareIcon,
  SquareSplitHorizontal,
  SquaresFour,
  TextTIcon,
} from "@phosphor-icons/react";

const classIconMap: Array<{ classes: string[]; icon: Icon }> = [
  { classes: ["absolute", "fixed"], icon: SquaresFour },
  { classes: ["flex-col"], icon: ArrowSquareDownIcon },
  { classes: ["flex"], icon: ArrowSquareRightIcon },
  { classes: ["grid"], icon: GridFourIcon },
  { classes: ["block", "inline"], icon: SquareIcon },
];

const tagIconMap: Record<string, Icon> = {
  p: TextTIcon,
  span: TextTIcon,
  h1: TextTIcon,
  h2: TextTIcon,
  h3: TextTIcon,
  h4: TextTIcon,
  h5: TextTIcon,
  h6: TextTIcon,
  label: TextTIcon,
  svg: Image,
  img: Image,
  a: Lightning,
  button: Lightning,
  input: CursorText,
  textarea: CursorText,
  select: CursorText,
  form: File,
  section: SquareSplitHorizontal,
};

export const getIcon = (classes: string[], tagName: string, isComponent: boolean): Icon => {
  if (isComponent) {
    return DiamondsFourIcon;
  }

  if (classes && classes.length > 0) {
    for (const { classes: targetClasses, icon } of classIconMap) {
      if (targetClasses.some((cls) => classes.includes(cls))) {
        return icon;
      }
    }
  }

  const tagIcon = tagIconMap[tagName];
  if (tagIcon) {
    return tagIcon;
  }

  return Square;
};
