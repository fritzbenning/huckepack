import type { DesignPropertyConfig, DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry";
import BackgroundAttachment, { config as backgroundAttachmentConfig } from "../properties/background-attachment";
import BackgroundColor, { config as backgroundColorConfig } from "../properties/background-color";
import BackgroundImage, { config as backgroundImageConfig } from "../properties/background-image";
import BorderRadius, { config as borderRadiusConfig } from "../properties/border-radius";
import FlexLayout, { config as flexLayoutConfig } from "../properties/flex-layout";
import FontFamily, { config as fontFamilyConfig } from "../properties/font-family";
import FontSize, { config as fontSizeConfig } from "../properties/font-size";
import FontWeight, { config as fontWeightConfig } from "../properties/font-weight";
import Height, { config as heightConfig } from "../properties/height";
import LetterSpacing, { config as letterSpacingConfig } from "../properties/letter-spacing";
import Margin, { config as marginConfig } from "../properties/margin";
import MaxHeight, { config as maxHeightConfig } from "../properties/max-height";
import MaxWidth, { config as maxWidthConfig } from "../properties/max-width";
import MinHeight, { config as minHeightConfig } from "../properties/min-height";
import MinWidth, { config as minWidthConfig } from "../properties/min-width";
import Opacity, { config as opacityConfig } from "../properties/opacity";
import Overflow, { config as overflowConfig } from "../properties/overflow";
import Padding, { config as paddingConfig } from "../properties/padding";
import Position, { config as positionConfig } from "../properties/position";
import TextColor, { config as textColorConfig } from "../properties/text-color";
import Visibility, { config as visibilityConfig } from "../properties/visibility";
import Width, { config as widthConfig } from "../properties/width";
import ZIndex, { config as zIndexConfig } from "../properties/z-index";
import { createConfigRegistry, createRegistry } from "../shared/utils";

export const DESIGN_PROPERTIES: DesignPropertyRegistryEntry[] = [
  {
    key: "flexLayout",
    category: "Layout",
    displayName: "Flex",
    config: flexLayoutConfig,
    component: FlexLayout,
    getDropdownValues: () => [
      {
        classToAdd: "flex",
        label: "Flex",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "borderRadius",
    category: "Appearance",
    displayName: "Radius",
    config: borderRadiusConfig,
    component: BorderRadius,
    getDropdownValues: () => [
      {
        classToAdd: "rounded-2xl",
        label: "Radius",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "opacity",
    category: "Appearance",
    displayName: "Opacity",
    config: opacityConfig,
    component: Opacity,
    getDropdownValues: () => [
      {
        classToAdd: "opacity-100",
        label: "Opacity",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "overflow",
    category: "Appearance",
    displayName: "Overflow",
    config: overflowConfig,
    component: Overflow,
    getDropdownValues: () => [
      {
        classToAdd: "overflow-auto",
        label: "Overflow",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "visibility",
    category: "Appearance",
    displayName: "Visibility",
    config: visibilityConfig,
    component: Visibility,
    getDropdownValues: () => [
      {
        classToAdd: "visible",
        label: "Visibility",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "fontFamily",
    category: "Typography",
    displayName: "Font",
    config: fontFamilyConfig,
    component: FontFamily,
    getDropdownValues: () => [
      {
        classToAdd: "font-sans",
        label: "Font Family",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "fontSize",
    category: "Typography",
    displayName: "Size",
    config: fontSizeConfig,
    component: FontSize,
    getDropdownValues: () => [
      {
        classToAdd: "text-base",
        label: "Font Size",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "fontWeight",
    category: "Typography",
    displayName: "Weight",
    config: fontWeightConfig,
    component: FontWeight,
    getDropdownValues: () => [
      {
        classToAdd: "font-normal",
        label: "Font Weight",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "textColor",
    category: "Typography",
    displayName: "Color",
    config: textColorConfig,
    component: TextColor,
    getDropdownValues: () => [
      {
        classToAdd: "text-black",
        label: "Text Color",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "letterSpacing",
    category: "Typography",
    displayName: "Tracking",
    config: letterSpacingConfig,
    component: LetterSpacing,
    getDropdownValues: () => [
      {
        classToAdd: "tracking-normal",
        label: "Letter Spacing",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "padding",
    category: "Spacing",
    displayName: "Padding",
    config: paddingConfig,
    component: Padding,
    getDropdownValues: () => [
      {
        classToAdd: "p-0",
        label: "Padding",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "margin",
    category: "Spacing",
    displayName: "Margin",
    config: marginConfig,
    component: Margin,
    getDropdownValues: () => [
      {
        classToAdd: "m-0",
        label: "Margin",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "width",
    category: "Dimensions",
    displayName: "Width",
    config: widthConfig,
    component: Width,
    getDropdownValues: () => [
      {
        classToAdd: "w-auto",
        label: "Width",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "height",
    category: "Dimensions",
    displayName: "Height",
    config: heightConfig,
    component: Height,
    getDropdownValues: () => [
      {
        classToAdd: "h-auto",
        label: "Height",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "minWidth",
    category: "Dimensions",
    displayName: "Min W",
    config: minWidthConfig,
    component: MinWidth,
    getDropdownValues: () => [
      {
        classToAdd: "min-w-0",
        label: "Min width",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "maxWidth",
    category: "Dimensions",
    displayName: "Max W",
    config: maxWidthConfig,
    component: MaxWidth,
    getDropdownValues: () => [
      {
        classToAdd: "max-w-none",
        label: "Max width",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "minHeight",
    category: "Dimensions",
    displayName: "Min H",
    config: minHeightConfig,
    component: MinHeight,
    getDropdownValues: () => [
      {
        classToAdd: "min-h-0",
        label: "Min height",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "maxHeight",
    category: "Dimensions",
    displayName: "Max H",
    config: maxHeightConfig,
    component: MaxHeight,
    getDropdownValues: () => [
      {
        classToAdd: "max-h-none",
        label: "Max height",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "position",
    category: "Position",
    displayName: "Position",
    config: positionConfig,
    component: Position,
    getDropdownValues: (presentProperties) => {
      if (presentProperties.position) return [];

      const values = ["relative", "absolute", "sticky", "fixed"];
      const siblingClasses = positionConfig.features.position.classes;

      return values.map((value) => ({
        classToAdd: value,
        label: value.charAt(0).toUpperCase() + value.slice(1),
        siblingClasses,
      }));
    },
  },
  {
    key: "zIndex",
    category: "Position",
    displayName: "z-Index",
    config: zIndexConfig,
    dependencies: {
      requires: ["position"],
    },
    component: ZIndex,
    getDropdownValues: () => [
      {
        classToAdd: "z-auto",
        label: "z-Index",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "backgroundColor",
    category: "Background",
    displayName: "Color",
    config: backgroundColorConfig,
    component: BackgroundColor,
    getDropdownValues: () => [
      {
        classToAdd: "bg-white",
        label: "Color",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "backgroundImage",
    category: "Background",
    displayName: "Image",
    config: backgroundImageConfig,
    component: BackgroundImage,
    getDropdownValues: () => [
      {
        classToAdd: "bg-none",
        label: "Image",
        siblingClasses: [],
      },
    ],
  },
  {
    key: "backgroundAttachment",
    category: "Background",
    displayName: "Parallax",
    config: backgroundAttachmentConfig,
    component: BackgroundAttachment,
    getDropdownValues: () => [
      {
        classToAdd: "bg-scroll",
        label: "Parallax",
        siblingClasses: [],
      },
    ],
  },
];

export const DESIGN_PROPERTY_REGISTRY: Record<DesignPropertyKey, DesignPropertyRegistryEntry> =
  createRegistry(DESIGN_PROPERTIES);

export const DESIGN_PROPERTY_CONFIG_REGISTRY: Record<string, DesignPropertyConfig> =
  createConfigRegistry(DESIGN_PROPERTIES);
