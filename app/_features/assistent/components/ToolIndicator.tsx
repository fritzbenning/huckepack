import { useApplicationThemeStore } from "@application/theme/stores/applicationThemeStore";
import { CaretDownIcon, CheckCircleIcon } from "@phosphor-icons/react";
import { ShimmerText } from "@shared/ui-kit/ui/ShimmerText";
import { Spinner } from "@shared/ui-kit/ui/Spinner";
import { toTitleCase } from "@shared/utils/format";
import { cva } from "class-variance-authority";
import { useState } from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import css from "react-syntax-highlighter/dist/esm/languages/hljs/css";
import javascript from "react-syntax-highlighter/dist/esm/languages/hljs/javascript";
import typescript from "react-syntax-highlighter/dist/esm/languages/hljs/typescript";
import { toolIndicatorDarkHighlightTheme, toolIndicatorLightHighlightTheme } from "./constants";
import { ToolIndicatorRoot } from "./ToolIndicatorRoot";
import type { ToolIndicatorState } from "./toolIndicatorRootVariants";

const languageMap: Record<string, typeof css> = {
  css,
  javascript,
  typescript,
};

const toolIndicatorButtonVariants = cva("group flex items-center gap-2 px-2.5 py-0.75", {
  variants: {
    canExpand: {
      true: "cursor-pointer",
      false: "cursor-default",
    },
  },
});

const toolIndicatorCaretVariants = cva("absolute inset-0 size-3.5 opacity-0 transition-all group-hover:opacity-100", {
  variants: {
    isExpanded: {
      true: "rotate-180",
      false: "",
    },
  },
});

interface ToolIndicatorProps {
  name: string;
  output?: string;
  state: ToolIndicatorState;
  className?: string;
  language?: string;
}

export function ToolIndicator({ name, output = "", state, className = "", language = "css" }: ToolIndicatorProps) {
  const themeMode = useApplicationThemeStore((theme) => theme.themeMode);
  const [isExpanded, setIsExpanded] = useState(false);

  const canExpand = !!(output || state === "input-streaming");

  return (
    <ToolIndicatorRoot state={state} className={className}>
      <button
        type="button"
        onClick={() => canExpand && setIsExpanded(!isExpanded)}
        className={toolIndicatorButtonVariants({ canExpand })}
      >
        <div className="flex items-center gap-1.5">
          {state === "output-available" && output && (
            <div className="relative size-3.5">
              <CheckCircleIcon className="size-3.5 transition-opacity group-hover:opacity-0" weight="regular" />
              <CaretDownIcon className={toolIndicatorCaretVariants({ isExpanded })} />
            </div>
          )}
          {state === "output-available" && !output && <CheckCircleIcon className="size-4" weight="regular" />}
          {state === "input-streaming" && (
            <div className="size-3.5 shrink-0">
              <Spinner size="sm" />
            </div>
          )}
          {state === "input-streaming" ? (
            <ShimmerText className="font-medium">{toTitleCase(name)}</ShimmerText>
          ) : (
            <span className="font-medium">{toTitleCase(name)}</span>
          )}
        </div>
      </button>
      {output && isExpanded && (
        <div className="custom-scrollbar overflow-x-auto border-neutral-150 border-t px-3.5 py-2 font-mono text-xs dark:border-neutral-800">
          <SyntaxHighlighter
            language={languageMap[language] || css || javascript}
            style={themeMode === "dark" ? toolIndicatorDarkHighlightTheme : toolIndicatorLightHighlightTheme}
            customStyle={{ background: "transparent", margin: 0 }}
          >
            {output || ""}
          </SyntaxHighlighter>
        </div>
      )}
    </ToolIndicatorRoot>
  );
}
