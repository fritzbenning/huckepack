"use client";

import { setBreakpoint, useCanvasStore } from "@editor/canvas";
import { sendComponentWidthToPreview } from "@lib/services/transmitter/sendComponentWidthToPreview";
import type { Icon } from "@phosphor-icons/react";
import { CodeBlock, DeviceMobile, Monitor, Ruler } from "@phosphor-icons/react";
import { SelectList } from "@shared/ui-kit/ui/SelectList";
import { cva } from "class-variance-authority";
import { useMemo, useState } from "react";
import { breakpointOptions, breakpointWidth } from "../constants";

const iconVariants = cva("size-5", {
  variants: {
    isActive: {
      true: "text-primary-600 dark:text-white",
      false: "text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-400",
    },
  },
});

const breakpointIcons: Record<string, Icon> = {
  stretch: CodeBlock,
  auto: Ruler,
  mobile: DeviceMobile,
  desktop: Monitor,
  custom: Ruler,
};

export function BreakpointSelector({ projectId }: { projectId: string }) {
  const viewport = useCanvasStore((state) => state.canvases[projectId]?.breakpoint?.viewport ?? "stretch");

  const [isActive, setIsActive] = useState(false);

  const handleBreakpointChange = (value: string) => {
    const viewport = value as "mobile" | "desktop" | "stretch" | "auto";
    setBreakpoint(projectId, viewport, breakpointWidth[viewport]);

    sendComponentWidthToPreview(breakpointWidth[viewport]);

    setIsActive(false);
  };

  const IconComponent = useMemo(() => breakpointIcons[viewport], [viewport]);

  return (
    <div className="relative">
      <button type="button" onClick={() => setIsActive(!isActive)}>
        <IconComponent className={iconVariants({ isActive })} weight="duotone" />
      </button>
      {isActive && (
        <div className="-translate-x-1/2 absolute bottom-10 left-1/2">
          <SelectList options={breakpointOptions} value={viewport} onSelect={handleBreakpointChange} size="large" />
        </div>
      )}
    </div>
  );
}
