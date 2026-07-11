import type { DesignPropertyConfig } from "@editor/design/registry";
import { feature } from "@editor/design/shared/helpers/registry";
import { isBackgroundClipClass, isBackgroundOriginClass } from "@editor/design/shared/helpers/classifier/background";
import { formatUrlToString, getUrlFromString } from "@editor/design/shared/utils";
import { getEnumClasses } from "@editor/design/values/enum";
import { IconLayoutGrid, IconPhoto, IconPhotoScan, IconPhotoSensor3 } from "@tabler/icons-react";

export const SIZE_VALUES = ["auto", "cover", "contain"] as const;

export const REPEAT_VALUES = ["repeat", "no-repeat", "repeat-x", "repeat-y", "repeat-round", "repeat-space"] as const;

export const POSITION_VALUES = [
  "bottom",
  "center",
  "left",
  "left-bottom",
  "left-top",
  "right",
  "right-bottom",
  "right-top",
  "top",
] as const;

export const ORIGIN_VALUES = ["border", "padding", "content"] as const;

export const CLIP_VALUES = ["border", "padding", "content", "text"] as const;

export const config = {
  features: {
    backgroundImage: feature.string({
      prefix: "bg",
      classes: ["bg-none"],
      placeholder: "Image URL",
      emptyValue: "bg-none",
      icon: IconPhoto,
      formatValue: formatUrlToString,
      parseValue: getUrlFromString,
    }),
    backgroundSize: feature.enum({
      prefix: "bg",
      classes: getEnumClasses("bg", SIZE_VALUES),
      icon: IconPhotoScan,
      defaultValue: "bg-auto",
    }),
    backgroundRepeat: feature.enum({
      prefix: "bg",
      classes: getEnumClasses("bg", REPEAT_VALUES),
      icon: IconLayoutGrid,
      defaultValue: "bg-repeat",
    }),
    backgroundPosition: feature.enum({
      prefix: "bg",
      classes: getEnumClasses("bg", POSITION_VALUES),
      icon: IconPhotoSensor3,
      defaultValue: "bg-center",
    }),
    backgroundOrigin: feature.enum({
      prefix: "bg-origin",
      classes: getEnumClasses("bg-origin", ORIGIN_VALUES),
      defaultValue: "bg-origin-padding",
      displayWhen: (classTokens: string[] | null) => {
        if (!classTokens) return false;
        return classTokens.some(isBackgroundOriginClass);
      },
    }),
    backgroundClip: feature.enum({
      prefix: "bg-clip",
      classes: getEnumClasses("bg-clip", CLIP_VALUES),
      defaultValue: "bg-clip-border",
      displayWhen: (classTokens: string[] | null) => {
        if (!classTokens) return false;
        return classTokens.some(isBackgroundClipClass);
      },
    }),
  },
} satisfies DesignPropertyConfig;
