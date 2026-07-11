import { SelectPosition } from "@shared/ui-kit/ui/SelectPosition";
import { VirtualizedSelectList } from "@shared/ui-kit/ui/VirtualizedSelectList";
import { cn } from "@lib/utils";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useId } from "react";
import { Input } from "../input/Input";
import { ComboboxClearButton } from "./components/ComboboxClearButton";
import { ComboboxEmptyState } from "./components/ComboboxEmptyState";
import { ComboboxLiveRegion } from "./components/ComboboxLiveRegion";
import { ComboboxOverflowMessage } from "./components/ComboboxOverflowMessage";
import { type ComboboxOption, useCombobox } from "./useCombobox";

export interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  className?: string;
  allowCustom?: boolean;
  maxDisplayItems?: number;
  hideSearchIcon?: boolean;
  tone?: "subtle" | "emphasized" | "transparent";
  y?: "top" | "bottom";
  distance?: "small" | "medium" | "large";
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder,
  emptyText = "No results found.",
  className,
  allowCustom = false,
  maxDisplayItems = 1500,
  hideSearchIcon = false,
  tone = "emphasized",
  y = "bottom",
  distance = "small",
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
}: ComboboxProps) {
  const comboboxId = useId();
  const listboxId = `${comboboxId}-listbox`;
  const liveRegionId = `${comboboxId}-live-region`;

  const {
    open,
    searchValue,
    highlightedIndex,
    displayValue,
    triggerRef,
    inputRef,
    dropdownRef,
    filteredOptions,
    selectOptions,
    setSearchValue,
    handleSelect,
    handleClear,
    handleKeyDown,
    handleTriggerClick,
    handleInputFocus,
  } = useCombobox({
    options,
    value,
    onValueChange,
    allowCustom,
    maxDisplayItems,
  });

  // Get the highlighted option's ID for aria-activedescendant
  const activeDescendantId =
    highlightedIndex >= 0 && highlightedIndex < selectOptions.length
      ? `${listboxId}-option-${highlightedIndex}`
      : undefined;

  // Calculate search results count for live region
  const resultsCount = selectOptions.length;

  return (
    <div className={cn("relative", className)}>
      <div className="relative w-full" ref={triggerRef} onClick={handleTriggerClick}>
        <div className="relative">
          <Input
            value={displayValue}
            onChange={setSearchValue}
            placeholder={placeholder}
            icon={hideSearchIcon ? undefined : MagnifyingGlassIcon}
            className="w-full"
            instant={true}
            tone={tone}
            dimension="medium"
            savePrevValue={false}
            ref={inputRef}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            id={`${comboboxId}-input`}
            role="combobox"
            aria-expanded={open}
            aria-autocomplete="list"
            aria-controls={open ? listboxId : undefined}
            aria-activedescendant={open && activeDescendantId ? activeDescendantId : undefined}
            aria-haspopup="listbox"
            aria-label={ariaLabel}
            aria-labelledby={ariaLabelledBy}
          />
          {(value || searchValue) && <ComboboxClearButton onClick={handleClear} tone={tone} />}
        </div>
      </div>

      <ComboboxLiveRegion id={liveRegionId} resultsCount={resultsCount} emptyText={emptyText} isOpen={open} />

      {open && (
        <SelectPosition
          triggerRef={triggerRef}
          x="left"
          y={y}
          distance={distance}
          size="large"
        >
          <div ref={dropdownRef}>
            {selectOptions.length > 0 ? (
              <VirtualizedSelectList
                options={selectOptions}
                value={value}
                onSelect={handleSelect}
                size="large"
                maxHeight={310}
                itemHeight={31}
                highlightedIndex={highlightedIndex}
                listboxId={listboxId}
              />
            ) : (
              <ComboboxEmptyState emptyText={emptyText} />
            )}

            {filteredOptions.length === maxDisplayItems && options.length > maxDisplayItems && (
              <ComboboxOverflowMessage displayedCount={maxDisplayItems} totalCount={options.length} />
            )}
          </div>
        </SelectPosition>
      )}
    </div>
  );
}
