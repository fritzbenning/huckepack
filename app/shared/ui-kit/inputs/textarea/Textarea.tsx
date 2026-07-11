import { ArrowUp } from "@phosphor-icons/react";
import type React from "react";
import { useEffect, useState } from "react";
import type { DynamicIconName } from "@/types/componentTypes";
import { TextareaField } from "./TextareaField";
import { TextareaRoot } from "./TextareaRoot";

interface TextareaProps {
  icon?: DynamicIconName;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  width?: "full" | "slim";
  dimension?: "small" | "large";
  align?: "left" | "center";
  instant?: boolean;
  tone?: "subtle" | "emphasized" | "transparent" | "glass";
  id?: string;
  rows?: number;
  maxLength?: number;
  showSendButton?: boolean;
  onSend?: () => void;
}

export const Textarea: React.FC<TextareaProps> = ({
  icon,
  value,
  onChange,
  placeholder,
  className = "",
  width = "full",
  dimension = "small",
  align = "left",
  instant = false,
  tone = "subtle",
  id,
  rows = 4,
  maxLength,
  showSendButton = false,
  onSend,
  ...rest
}) => {
  const [textareaValue, setTextareaValue] = useState(value || "");

  useEffect(() => {
    setTextareaValue(value || "");
  }, [value]);

  const handleSubmit = () => {
    if (onChange && textareaValue !== value) {
      onChange(textareaValue);
    }
  };

  const handleSend = () => {
    if (onSend) {
      onSend();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSubmit();
      e.currentTarget.blur();
    }
  };

  const handleBlur = () => {
    handleSubmit();
  };

  const textareaContent = (
    <>
      <TextareaField
        value={textareaValue}
        onChange={(e) => {
          setTextareaValue(e.target.value);
          if (instant && onChange) {
            onChange(e.target.value);
          }
        }}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        width={width}
        dimension={dimension}
        tone={tone}
        align={align}
        icon={!!icon}
        id={id}
        rows={rows}
        maxLength={maxLength}
        {...rest}
      />
    </>
  );

  if (showSendButton) {
    return (
      <div className={`relative flex items-end gap-3 ${className}`}>
        <div className="group relative flex-1">{textareaContent}</div>
        <div className="absolute right-4 bottom-5">
          <button
            type="button"
            onClick={handleSend}
            disabled={!textareaValue.trim()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 transition-all hover:bg-primary-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-25 dark:bg-neutral-750 dark:text-white dark:hover:bg-neutral-500"
          >
            <ArrowUp className="h-4 w-4 leading-none" weight="duotone" />
          </button>
        </div>
      </div>
    );
  }

  return <TextareaRoot className={className}>{textareaContent}</TextareaRoot>;
};
