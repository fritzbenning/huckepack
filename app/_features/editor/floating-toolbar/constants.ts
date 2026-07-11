import {
  CodeBlockIcon,
  DeviceMobileIcon,
  DiamondIcon,
  ImageIcon,
  LightningIcon,
  MonitorIcon,
  RulerIcon,
  SquareIcon,
  TextboxIcon,
  TextTIcon,
} from "@phosphor-icons/react";
import type { SelectOption } from "@shared/ui-kit/ui/SelectList";
import type { Element } from "./types";

export const breakpointWidth: Record<"stretch" | "mobile" | "desktop" | "auto", "100%" | "auto" | number> = {
  stretch: "100%",
  mobile: 390,
  desktop: 1280,
  auto: "auto",
};

export const breakpointOptions: SelectOption[] = [
  {
    value: "stretch",
    icon: CodeBlockIcon,
    label: "Stretch (100%)",
  },
  {
    value: "auto",
    icon: RulerIcon,
    label: "Content Width",
  },
  {
    value: "mobile",
    icon: DeviceMobileIcon,
    label: `Mobile (${breakpointWidth.mobile}px)`,
  },
  {
    value: "desktop",
    icon: MonitorIcon,
    label: `Desktop (${breakpointWidth.desktop}px)`,
  },
];

export const availableElements: Element[] = [
  {
    name: "Instance",
    icon: DiamondIcon,
    type: "",
    classes: "",
  },
  {
    name: "Element",
    icon: SquareIcon,
    type: "div",
    classes: "min-h-25 bg-white",
  },
  {
    name: "Text",
    icon: TextTIcon,
    type: "span",
    classes: "text-base",
  },
  {
    name: "Button",
    icon: LightningIcon,
    type: "button",
    classes: "bg-primary-500 text-white px-4 py-2 rounded-lg text-sm",
  },
  {
    name: "Input",
    icon: TextboxIcon,
    type: "input",
    classes: "border border-neutral-300 rounded-md p-2",
  },
  {
    name: "Image",
    icon: ImageIcon,
    type: "img",
    classes: "w-full h-full object-cover",
  },
];
