import type { Icon } from "@phosphor-icons/react";
import { MinusIcon } from "@phosphor-icons/react";
import { Input } from "@shared/ui-kit/inputs/input/Input";
import { Select } from "@shared/ui-kit/inputs/select/Select";
import type { SelectOption } from "@shared/ui-kit/ui/SelectList";
import { Activity } from "react";
import type { Unit } from "./UnitSelect";

export type FlexibleIcon = Icon | React.ComponentType<React.SVGProps<SVGSVGElement>> | string;

export interface DesignValueInputProps {
  isTokenMode?: boolean;
  className?: string;
  dimension?: "tiny" | "small" | "medium" | "large";
  tone?: "subtle" | "emphasized";
  icon?: FlexibleIcon;
  placeholder?: string;
  selectOptions?: SelectOption[];
  selectValue?: string | null;
  onSelectChange?: (value: string) => void;
  inputValue?: string | number;
  onInputChange?: (value: string) => void;
  unit?: Unit;
  onUnitChange?: (unit: Unit) => void;
  availableUnits?: Unit[];
  showUnitSelector?: boolean;
  inputClassName?: string;
  hideUnitLabel?: boolean;
  onClear?: () => void;
  showClear?: boolean;
  disabled?: boolean;
  actionIcon?: Icon;
  onActionClick?: () => void;
}

export function DesignValueInput({
  isTokenMode = false,
  className = "",
  dimension = "small",
  tone = "emphasized",
  icon,
  placeholder,
  selectOptions = [],
  selectValue,
  onSelectChange,
  inputValue,
  onInputChange,
  unit,
  onUnitChange,
  availableUnits,
  showUnitSelector = true,
  inputClassName = "h-7",
  hideUnitLabel = false,
  onClear,
  showClear = false,
  disabled = false,
  actionIcon,
  onActionClick,
}: DesignValueInputProps) {
  const hasValue = isTokenMode ? !!selectValue : inputValue !== undefined && inputValue !== "";
  const shouldShowClear = !!(showClear && hasValue && onClear);
  const shouldShowAction = !!(actionIcon && onActionClick) || shouldShowClear;
  const finalActionIcon = shouldShowClear ? MinusIcon : actionIcon;
  const finalOnActionClick = shouldShowClear ? onClear : onActionClick;

  return (
    <div className={`relative flex items-center ${className}`.trim()}>
      <Activity mode={isTokenMode ? "visible" : "hidden"}>
        <Select
          options={selectOptions}
          value={selectValue}
          onChange={onSelectChange}
          placeholder={placeholder}
          className="w-full"
          dimension={dimension}
          tone={tone}
          icon={icon as Icon | string | undefined}
          x="right"
          disabled={disabled}
          actionIcon={shouldShowAction ? finalActionIcon : undefined}
          onActionClick={shouldShowAction ? finalOnActionClick : undefined}
        />
      </Activity>
      <Activity mode={isTokenMode ? "hidden" : "visible"}>
        <Input
          icon={icon as Icon | string | undefined}
          value={inputValue}
          onChange={onInputChange}
          placeholder={placeholder}
          className={className}
          inputClassName={inputClassName}
          unit={unit}
          onUnitChange={onUnitChange}
          availableUnits={availableUnits}
          showUnitSelector={showUnitSelector}
          hideUnitLabel={hideUnitLabel}
          tone={tone}
          actionIcon={shouldShowAction ? finalActionIcon : undefined}
          onActionClick={shouldShowAction ? finalOnActionClick : undefined}
          disabled={disabled}
        />
      </Activity>
    </div>
  );
}
