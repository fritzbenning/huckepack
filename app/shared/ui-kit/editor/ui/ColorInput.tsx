import type { Id } from "@convex/_generated/dataModel";
import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import { openPinnedModal, usePinnedModalStore } from "@shared/pinned-modal/pinnedModalStore";
import { InputField } from "@shared/ui-kit/inputs/input/InputField";
import { InputIcon } from "@shared/ui-kit/inputs/input/InputIcon";
import { InputLabel } from "@shared/ui-kit/inputs/input/InputLabel";
import { InputRoot } from "@shared/ui-kit/inputs/input/InputRoot";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ColorInputProps {
  value: string;
  onChange?: (value: string) => void;
  projectId: Id<"projects">;
  fileId: Id<"files">;
  showOpacity?: boolean;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  icon?: Icon | string;
  dimension?: "tiny" | "small" | "medium" | "large";
  tone?: "subtle" | "emphasized";
  label?: string;
  disabled?: boolean;
  modalName?: "design-panel.color-picker" | "design-panel.text-color-picker";
}

function isValidHex(hex: string): boolean {
  return /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/.test(hex);
}

function normalizeHex(input: string): string | null {
  let hex = input.trim();
  if (!hex.startsWith("#")) {
    hex = `#${hex}`;
  }
  if (isValidHex(hex)) {
    return hex.toLowerCase();
  }
  return null;
}

export function ColorInput({
  value,
  onChange,
  projectId,
  fileId,
  showOpacity = false,
  className = "",
  inputClassName = "",
  placeholder = "#000000",
  icon: Icon,
  dimension = "small",
  tone = "emphasized",
  label,
  disabled = false,
  modalName = "design-panel.color-picker",
}: ColorInputProps) {
  const swatchRef = useRef<HTMLButtonElement>(null);
  const [inputValue, setInputValue] = useState(value || "");
  const { currentModal, isOpen } = usePinnedModalStore();
  const isModalOpen = isOpen && currentModal === modalName;

  useEffect(() => {
    setInputValue(value || "");
  }, [value]);

  const handleOpenModal = useCallback(() => {
    if (!swatchRef.current || disabled) return;

    const asideElement = swatchRef.current.closest('[class*="w-74"], [class*="w-85"]');
    const asidePosition = asideElement?.classList.contains("border-r-1") ? "left" : "right";

    openPinnedModal(modalName, swatchRef, asidePosition, {
      projectId,
      fileId,
      showOpacity,
    });
  }, [projectId, fileId, showOpacity, disabled, modalName]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  const handleSubmit = useCallback(() => {
    const normalized = normalizeHex(inputValue);
    if (normalized && onChange) {
      onChange(normalized);
    } else {
      setInputValue(value || "");
    }
  }, [inputValue, value, onChange]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSubmit();
        e.currentTarget.blur();
      } else if (e.key === "Escape") {
        setInputValue(value || "");
        e.currentTarget.blur();
      }
    },
    [handleSubmit, value]
  );

  const hasIcon = !!Icon;
  const normalizedDimension = dimension === "tiny" ? "small" : dimension;

  return (
    <div className={cn("relative flex flex-col", className)}>
      {label && (
        <InputLabel dimension={normalizedDimension} className="text-left">
          {label}
        </InputLabel>
      )}
      <InputRoot dimension={normalizedDimension} tone={tone} width="full" disabled={disabled}>
        {Icon && <InputIcon icon={Icon} dimension={normalizedDimension} />}
        <button
          ref={swatchRef}
          type="button"
          onClick={handleOpenModal}
          disabled={disabled}
          className={cn(
            "h-4 w-4 shrink-0 border border-neutral-300 dark:border-neutral-600",
            "hover:border-neutral-400 dark:hover:border-neutral-500",
            "transition-[border-radius] duration-200 ease-in-out",
            isModalOpen ? "rounded" : "rounded-full",
            hasIcon ? "ml-0" : "ml-2"
          )}
          style={{ backgroundColor: value || "#3b82f6" }}
          title="Open color picker"
        />
        <InputField
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          dimension={normalizedDimension}
          tone={tone}
          icon={false}
          className={cn("flex-1", inputClassName)}
        />
      </InputRoot>
    </div>
  );
}
