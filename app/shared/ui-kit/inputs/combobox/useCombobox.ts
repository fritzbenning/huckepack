import { useRequestAnimationFrame } from "@hooks/useRequestAnimationFrame";
import { useDeferredValue, useEffect, useMemo, useRef, useState } from "react";
import { useComboboxKeyboardNavigation } from "./hooks/useComboboxKeyboardNavigation";
import type { ComboboxOption } from "./utils/comboboxUtils";
import { filterOptions, getDisplayValue, isCustomValue } from "./utils/comboboxUtils";

export type { ComboboxOption };

export interface UseComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  allowCustom?: boolean;
  maxDisplayItems?: number;
}

export interface UseComboboxReturn {
  // State
  open: boolean;
  searchValue: string;
  highlightedIndex: number;
  displayValue: string;

  // Refs
  triggerRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  dropdownRef: React.RefObject<HTMLDivElement | null>;

  // Computed values
  filteredOptions: ComboboxOption[];
  selectOptions: { value: string; label: string }[];
  isCustomValue: boolean;

  // Handlers
  setOpen: (open: boolean) => void;
  setSearchValue: (value: string) => void;
  handleSelect: (selectedValue: string) => void;
  handleClear: (e: React.MouseEvent<HTMLButtonElement>) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => void;
  handleTriggerClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  handleInputFocus: () => void;
}

export function useCombobox({
  options,
  value,
  onValueChange,
  allowCustom = false,
  maxDisplayItems = 1500,
}: UseComboboxProps): UseComboboxReturn {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const triggerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const shouldSkipFocusOnNextInputFocus = useRef(false);
  const scheduleAnimationFrame = useRequestAnimationFrame();

  // Defer search value to keep input responsive while filtering happens in background
  const deferredSearchValue = useDeferredValue(searchValue);

  // Filter options based on search - using extracted utility function
  const filteredOptions = useMemo(
    () => filterOptions(options, deferredSearchValue, maxDisplayItems),
    [options, deferredSearchValue, maxDisplayItems]
  );

  // Convert to SelectOption format for VirtualizedSelectList
  const selectOptions: { value: string; label: string }[] = useMemo(() => {
    return filteredOptions.map((option) => ({
      value: option.value,
      label: option.label,
    }));
  }, [filteredOptions]);

  // Check if current search is a custom value - using extracted utility function
  const isCustomValueAllowed = useMemo(
    () => isCustomValue(searchValue, filteredOptions, options, allowCustom),
    [searchValue, filteredOptions, options, allowCustom]
  );

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue === value ? "" : selectedValue);
    setOpen(false);
    setSearchValue("");
    setHighlightedIndex(-1);

    // Refocus input after selection, but skip opening dropdown on focus
    shouldSkipFocusOnNextInputFocus.current = true;
    setTimeout(() => {
      inputRef.current?.focus();
      shouldSkipFocusOnNextInputFocus.current = false;
    }, 0);
  };

  const handleClear = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setSearchValue("");
    setHighlightedIndex(-1);
    onValueChange?.("");
    // Keep dropdown open and refocus input after clearing
    setOpen(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  // Use extracted keyboard navigation hook
  const { handleKeyDown } = useComboboxKeyboardNavigation({
    open,
    searchValue,
    filteredOptions,
    highlightedIndex,
    allowCustom,
    isCustomValue: isCustomValueAllowed,
    onOpen: () => setOpen(true),
    onClose: () => setOpen(false),
    onSetHighlightedIndex: setHighlightedIndex,
    onSelect: handleSelect,
    onBlur: () => inputRef.current?.blur(),
    onResetSearch: () => setSearchValue(""),
  });

  const handleTriggerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only open if clicking on the container div itself, not on child elements
    if (e.target === e.currentTarget) {
      setOpen(true);
      inputRef.current?.focus();
    }
  };

  const handleInputFocus = () => {
    if (!shouldSkipFocusOnNextInputFocus.current) {
      // Defer opening to avoid blocking the focusin event handler
      scheduleAnimationFrame(() => {
        setOpen(true);
      });
    }
  };

  // Open dropdown when user starts typing
  useEffect(() => {
    if (searchValue.trim() && !open) {
      setOpen(true);
    }
  }, [searchValue, open]);

  // Highlight matching option when search changes
  useEffect(() => {
    if (searchValue.trim() && filteredOptions.length > 0) {
      const searchLower = searchValue.trim().toLowerCase();

      // First, try to find an exact match (by value or label)
      let matchingIndex = filteredOptions.findIndex(
        (option) => option.value.toLowerCase() === searchLower || option.label.toLowerCase() === searchLower
      );

      // If no exact match, try to find a prefix match
      if (matchingIndex < 0) {
        matchingIndex = filteredOptions.findIndex(
          (option) =>
            option.value.toLowerCase().startsWith(searchLower) || option.label.toLowerCase().startsWith(searchLower)
        );
      }

      // If a match is found, highlight it; otherwise highlight the first option
      setHighlightedIndex(matchingIndex >= 0 ? matchingIndex : 0);
    } else {
      setHighlightedIndex(-1);
    }
  }, [searchValue, filteredOptions]);

  // Maintain focus on input when popover opens
  useEffect(() => {
    if (open && inputRef.current) {
      // Small delay to ensure popover is rendered
      const timer = setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        open &&
        dropdownRef.current &&
        triggerRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  // Get display value using extracted utility function
  const displayValue = useMemo(
    () => getDisplayValue(searchValue, value, options, open),
    [searchValue, value, options, open]
  );

  return {
    open,
    searchValue,
    highlightedIndex,
    displayValue,
    triggerRef,
    inputRef,
    dropdownRef,
    filteredOptions,
    selectOptions,
    isCustomValue: isCustomValueAllowed,
    setOpen,
    setSearchValue,
    handleSelect,
    handleClear,
    handleKeyDown,
    handleTriggerClick,
    handleInputFocus,
  };
}
