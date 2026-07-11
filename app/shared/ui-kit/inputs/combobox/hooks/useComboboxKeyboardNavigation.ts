import type { ComboboxOption } from "../utils/comboboxUtils";
import { findExactMatch } from "../utils/comboboxUtils";

export interface UseComboboxKeyboardNavigationProps {
  open: boolean;
  searchValue: string;
  filteredOptions: ComboboxOption[];
  highlightedIndex: number;
  allowCustom: boolean;
  isCustomValue: boolean;
  onOpen: () => void;
  onClose: () => void;
  onSetHighlightedIndex: (index: number) => void;
  onSelect: (value: string) => void;
  onBlur: () => void;
  onResetSearch?: () => void;
}

export function useComboboxKeyboardNavigation({
  open,
  searchValue,
  filteredOptions,
  highlightedIndex,
  allowCustom,
  isCustomValue,
  onOpen,
  onClose,
  onSetHighlightedIndex,
  onSelect,
  onBlur,
  onResetSearch,
}: UseComboboxKeyboardNavigationProps) {
  const handleEnterWithSearchValue = () => {
    // First, try to find an exact match in filtered options
    const exactMatch = findExactMatch(filteredOptions, searchValue);

    if (exactMatch) {
      // Apply the exact match
      onSelect(exactMatch.value);
    } else if (allowCustom && isCustomValue) {
      // Apply as custom value if allowCustom is true and it's not in the original options
      onSelect(searchValue.trim());
    } else if (filteredOptions.length > 0) {
      // Apply the first filtered option as fallback
      onSelect(filteredOptions[0].value);
    }
  };

  const handleEnterKey = () => {
    if (!open) {
      onOpen();
      return;
    }

    // Select highlighted option if available
    if (highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
      onSelect(filteredOptions[highlightedIndex].value);
      return;
    }

    // Handle selection when no option is highlighted
    if (searchValue.trim()) {
      handleEnterWithSearchValue();
    }
  };

  const handleArrowDown = () => {
    if (!open) {
      onOpen();
      onSetHighlightedIndex(0);
    } else {
      onSetHighlightedIndex(highlightedIndex < filteredOptions.length - 1 ? highlightedIndex + 1 : 0);
    }
  };

  const handleArrowUp = () => {
    if (open) {
      onSetHighlightedIndex(highlightedIndex > 0 ? highlightedIndex - 1 : filteredOptions.length - 1);
    }
  };

  const handleEscape = () => {
    onClose();
    onSetHighlightedIndex(-1);
    onResetSearch?.();
    onBlur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLDivElement>) => {
    switch (e.key) {
      case "Enter":
        e.preventDefault();
        e.stopPropagation();
        handleEnterKey();
        break;
      case "ArrowDown":
        e.preventDefault();
        e.stopPropagation();
        handleArrowDown();
        break;
      case "ArrowUp":
        e.preventDefault();
        e.stopPropagation();
        handleArrowUp();
        break;
      case "Escape":
        e.preventDefault();
        e.stopPropagation();
        handleEscape();
        break;
    }
  };

  return {
    handleKeyDown,
  };
}
