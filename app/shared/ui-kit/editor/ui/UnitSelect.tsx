import { Select } from "@shared/ui-kit/inputs/select/Select";
import type { SelectOption } from "@shared/ui-kit/ui/SelectList";
import type React from "react";

type Unit = "scale" | "px" | "%" | "rem" | "em" | "vw" | "vh";

interface UnitSelectProps {
  unit?: Unit;
  onUnitChange?: (unit: Unit) => void;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  availableUnits?: Unit[];
  hideLabel?: boolean;
  tabIndex?: number;
}

const ALL_UNITS: Unit[] = ["scale", "px", "%", "rem", "em", "vw", "vh"];

export const UnitSelect: React.FC<UnitSelectProps> = ({
  unit = "px",
  onUnitChange,
  onOpenChange,
  className = "",
  availableUnits = ALL_UNITS,
  hideLabel = false,
  tabIndex,
}) => {
  const handleUnitChange = (selectedUnit: string) => {
    if (onUnitChange) {
      onUnitChange(selectedUnit as Unit);
    }
  };

  const UNIT_OPTIONS: SelectOption[] = availableUnits.map((unit) => ({
    value: unit,
    label: unit === "scale" ? "𝒳" : unit,
  }));

  return (
    <div className={`${className}`}>
      <Select
        options={UNIT_OPTIONS}
        value={unit}
        onChange={handleUnitChange}
        onOpenChange={onOpenChange}
        tone="transparent"
        dimension="tiny"
        x="right"
        xOffset={8}
        y="bottom"
        triggerClassName="h-full"
        distance="medium"
        hideLabel={hideLabel}
        triggerTabIndex={tabIndex}
      />
    </div>
  );
};

export type { Unit };
