import { cn } from "@lib/utils";
import type { Icon } from "@phosphor-icons/react";
import type React from "react";
import { forwardRef, useId } from "react";
import { type Unit, UnitSelect } from "../../editor/ui/UnitSelect";
import type { SelectOption } from "../../ui/SelectList";
import { Select } from "../select/Select";
import { useInputValue } from "./hooks/useInputValue";
import { InputErrorMessage } from "./InputErrorMessage";
import { InputField } from "./InputField";
import { InputIcon } from "./InputIcon";
import { InputLabel } from "./InputLabel";
import { InputRoot } from "./InputRoot";
import type { InputAlign, InputDimension, InputTextSize, InputTone, InputWidth } from "./types";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange" | "value" | "type"> {
  type?: "text" | "number";
  icon?: Icon | string;
  value?: string | number;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  unit?: Unit;
  onUnitChange?: (unit: Unit) => void;
  showUnitSelector?: boolean;
  staticUnit?: string;
  availableUnits?: Unit[];
  tokenSizeOptions?: SelectOption[];
  currentTokenSize?: string;
  onTokenSizeChange?: (size: string) => void;
  width?: InputWidth;
  dimension?: InputDimension;
  align?: InputAlign;
  instant?: boolean;
  tone?: InputTone;
  textSize?: InputTextSize;
  label?: string;
  savePrevValue?: boolean;
  error?: string | boolean;
  hideUnitLabel?: boolean;
  actionIcon?: Icon;
  onActionClick?: () => void;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      icon: Icon,
      value,
      onChange,
      placeholder,
      className = "",
      inputClassName = "",
      unit = "px",
      onUnitChange,
      showUnitSelector = false,
      staticUnit,
      availableUnits,
      tokenSizeOptions,
      currentTokenSize,
      onTokenSizeChange,
      width = "full",
      dimension = "small",
      align = "left",
      instant = false,
      tone = "subtle",
      textSize = "xs",
      id,
      label,
      savePrevValue = true,
      error,
      onKeyDown: customOnKeyDown,
      disabled,
      hideUnitLabel = false,
      actionIcon: ActionIcon,
      onActionClick,
      ...rest
    },
    ref
  ) => {
    const { inputValue, handleChange, handleSubmit } = useInputValue(value, onChange, instant, savePrevValue);
    const errorId = useId();
    const hasError = !!error;
    const errorMessage = typeof error === "string" ? error : undefined;
    const inputId = id || errorId;
    const ariaDescribedBy = errorMessage ? `${inputId}-error` : undefined;

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (customOnKeyDown) {
        customOnKeyDown(e);
      }

      if (e.key === "Enter" && !e.defaultPrevented) {
        handleSubmit();
        e.currentTarget.blur();
      }
    };

    const handleBlur = () => {
      handleSubmit();
    };

    // Show Select for token sizes when unit is "scale" and options are available
    const showTokenSizeSelect = unit === "scale" && tokenSizeOptions && tokenSizeOptions.length > 0;

    const inputElement = (
      <div className="group relative">
        <InputRoot
          className={label ? undefined : className}
          dimension={dimension}
          tone={tone}
          width={width}
          error={hasError}
          disabled={disabled}
        >
          {Icon && <InputIcon icon={Icon} dimension={dimension} />}
          {showTokenSizeSelect ? (
            <div className="flex flex-1 items-center">
              <Select
                options={tokenSizeOptions}
                value={currentTokenSize}
                onChange={(size) => {
                  if (onTokenSizeChange) {
                    onTokenSizeChange(size);
                  }
                }}
                placeholder={placeholder || "Select size"}
                className="flex-1"
                dimension={dimension}
                tone={tone}
              />
              {staticUnit ? (
                <div
                  className={cn(
                    "-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 text-neutral-500 text-xs dark:text-neutral-400"
                  )}
                >
                  {staticUnit}
                </div>
              ) : showUnitSelector ? (
                <>
                  {inputValue !== undefined && inputValue !== "" && (
                    <div
                      className={cn(
                        "-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 text-neutral-500 text-xs opacity-75 dark:text-neutral-400",
                        "group-hover:opacity-0"
                      )}
                    >
                      {unit === "scale" ? "𝒳" : unit}
                    </div>
                  )}
                  <div
                    className={cn(
                      "-translate-y-1/2 pointer-events-none absolute top-1/2 right-0 flex items-center gap-0.5 opacity-0",
                      "group-hover:pointer-events-auto group-hover:opacity-100"
                    )}
                  >
                    <UnitSelect
                      unit={unit}
                      onUnitChange={onUnitChange}
                      onOpenChange={undefined}
                      availableUnits={availableUnits}
                      className={ActionIcon && onActionClick ? "pr-0.5" : ""}
                      hideLabel={hideUnitLabel}
                      tabIndex={-1}
                    />
                    {ActionIcon && onActionClick && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick();
                        }}
                        className="flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                      >
                        <ActionIcon className="size-3 shrink-0" weight="bold" />
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </div>
          ) : (
            <>
              <InputField
                ref={ref}
                type={type}
                value={inputValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleBlur}
                placeholder={placeholder}
                dimension={dimension}
                tone={tone}
                align={align}
                icon={!!Icon}
                showUnitSelector={showUnitSelector || !!staticUnit}
                id={inputId}
                aria-invalid={hasError}
                aria-describedby={ariaDescribedBy}
                disabled={disabled}
                className={cn(
                  inputClassName,
                  type === "number" &&
                    "[&::-moz-appearance]:textfield appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                )}
                {...rest}
              />
              {staticUnit ? (
                <div
                  className={cn(
                    "-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 text-neutral-500 text-xs dark:text-neutral-400"
                  )}
                >
                  {staticUnit}
                </div>
              ) : showUnitSelector ? (
                <>
                  {inputValue !== undefined && inputValue !== "" && (
                    <div
                      className={cn(
                        "-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 text-neutral-500 text-xs opacity-75 dark:text-neutral-400",
                        "group-hover:opacity-0"
                      )}
                    >
                      {unit === "scale" ? "𝒳" : unit}
                    </div>
                  )}
                  <div
                    className={cn(
                      "-translate-y-1/2 pointer-events-none absolute top-1/2 right-2 flex items-center gap-1.5 opacity-0",
                      "group-hover:pointer-events-auto group-hover:opacity-100"
                    )}
                  >
                    <UnitSelect
                      unit={unit}
                      onUnitChange={onUnitChange}
                      availableUnits={availableUnits}
                      hideLabel={hideUnitLabel}
                      tabIndex={-1}
                    />
                    {ActionIcon && onActionClick && (
                      <button
                        type="button"
                        tabIndex={-1}
                        onClick={(e) => {
                          e.stopPropagation();
                          onActionClick();
                        }}
                        className="flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                      >
                        <ActionIcon className="size-3.5 shrink-0" weight="regular" />
                      </button>
                    )}
                  </div>
                </>
              ) : null}
            </>
          )}
        </InputRoot>
      </div>
    );

    if (label) {
      return (
        <div className={className}>
          <InputLabel htmlFor={inputId} dimension={dimension}>
            {label}
          </InputLabel>
          {inputElement}
          {errorMessage && (
            <InputErrorMessage id={ariaDescribedBy} className="mt-1">
              {errorMessage}
            </InputErrorMessage>
          )}
        </div>
      );
    }

    if (errorMessage || className) {
      return (
        <div className={className}>
          {inputElement}
          {errorMessage && (
            <InputErrorMessage id={ariaDescribedBy} className="mt-1">
              {errorMessage}
            </InputErrorMessage>
          )}
        </div>
      );
    }

    return inputElement;
  }
);

Input.displayName = "Input";
