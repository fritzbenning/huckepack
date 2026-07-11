import type { ComponentType } from "@lib/parser";
import type { IconProps } from "@phosphor-icons/react";
import { Cube, Diamond, Note, Rectangle } from "@phosphor-icons/react";

interface ElementIconProps extends Omit<IconProps, "type"> {
  type: ComponentType | null;
}

export const getIconComponent = (componentType: ComponentType | null) => {
  switch (componentType) {
    case "component":
      return Diamond;
    case "block":
      return Cube;
    case "section":
      return Rectangle;
    case "page":
      return Note;
    default:
      return Cube;
  }
};

export function ElementIcon({ type, className = "size-3.5", weight = "duotone", ...props }: ElementIconProps) {
  const IconComponent = getIconComponent(type);
  return <IconComponent className={className} weight={weight} {...props} />;
}
