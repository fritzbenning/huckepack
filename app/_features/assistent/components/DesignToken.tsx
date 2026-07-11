import { CornersOut, Palette, Ruler, Square, Stack, TextT } from "@phosphor-icons/react";
import { cva } from "class-variance-authority";
import type React from "react";

const designTokenVariants = cva(
  "flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 transition-all dark:border-neutral-750 dark:bg-neutral-850",
  {
    variants: {
      type: {
        color: "",
        typography: "",
        spacing: "",
        shadow: "",
        border: "",
        radius: "",
      },
    },
  }
);

const getTokenIcon = (type: string) => {
  const iconClass = "size-4 flex-shrink-0";

  switch (type) {
    case "color":
      return <Palette className={iconClass} weight="duotone" />;
    case "typography":
      return <TextT className={iconClass} weight="duotone" />;
    case "spacing":
      return <Ruler className={iconClass} weight="duotone" />;
    case "shadow":
      return <Stack className={iconClass} weight="duotone" />;
    case "border":
      return <Square className={iconClass} weight="duotone" />;
    case "radius":
      return <CornersOut className={iconClass} weight="duotone" />;
    default:
      return <Palette className={iconClass} weight="duotone" />;
  }
};

const renderTokenPreview = (type: string, value: string) => {
  switch (type) {
    case "color":
      return (
        <div
          className="h-6 w-6 rounded-full border border-black/10 dark:border-white/20"
          style={{ backgroundColor: value }}
          title={value}
        />
      );
    case "spacing":
      return (
        <div className="flex items-center gap-1">
          <div
            className="rounded-sm bg-primary-400 opacity-60 dark:bg-primary-500"
            style={{ width: value, height: "8px" }}
          />
          <span className="font-mono text-gray-600 text-xs dark:text-gray-400">{value}</span>
        </div>
      );
    case "shadow":
      return (
        <div className="h-4 w-6 rounded border bg-white dark:bg-gray-800" style={{ boxShadow: value }} title={value} />
      );
    case "border":
      return <div className="h-4 w-6 rounded bg-white dark:bg-gray-800" style={{ border: value }} title={value} />;
    case "radius":
      return (
        <div
          className="h-4 w-4 border border-black/10 bg-linear-to-br from-primary-400 to-purple-500 dark:border-white/10"
          style={{ borderRadius: value }}
          title={value}
        />
      );
    case "typography":
      return (
        <span
          className="font-mono text-gray-800 text-xs dark:text-gray-200"
          style={{ fontFamily: value.includes("font-") ? undefined : value }}
        >
          Ag
        </span>
      );
    default:
      return null;
  }
};

interface DesignTokenProps {
  title: string;
  type: "color" | "typography" | "spacing" | "shadow" | "border" | "radius";
  value: string;
  className?: string;
  animate?: boolean;
}

export const DesignToken: React.FC<DesignTokenProps> = ({ title, type, value, className = "", animate = true }) => {
  return (
    <div className={`${designTokenVariants({ type })} ${animate ? "animate-fade-in" : ""} ${className}`}>
      <div className="flex min-w-0 flex-1 items-center gap-2.5">
        {getTokenIcon(type)}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="font-semibold text-gray-900 text-xs dark:text-gray-100">{title}</span>
          <div className="max-w-full overflow-hidden text-ellipsis whitespace-nowrap font-mono text-2xs text-gray-600 dark:text-gray-400">
            {value}
          </div>
        </div>
      </div>
      {type === "color" && <div className="shrink-0">{renderTokenPreview(type, value)}</div>}
    </div>
  );
};
