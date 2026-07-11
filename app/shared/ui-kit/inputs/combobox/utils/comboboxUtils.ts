export interface ComboboxOption {
  label: string;
  value: string;
}

/**
 * Filters options based on search term, matching both value and label
 */
export function filterOptions(
  options: ComboboxOption[],
  searchTerm: string,
  maxItems: number
): ComboboxOption[] {
  if (!searchTerm.trim()) {
    return options.slice(0, maxItems);
  }

  const searchLower = searchTerm.trim().toLowerCase();
  const results: ComboboxOption[] = [];

  for (let i = 0; i < options.length && results.length < maxItems; i++) {
    const option = options[i];
    if (
      option.value.toLowerCase().includes(searchLower) ||
      option.label.toLowerCase().includes(searchLower)
    ) {
      results.push(option);
    }
  }

  return results;
}

/**
 * Finds an exact match for the search value in the options
 */
export function findExactMatch(
  options: ComboboxOption[],
  searchValue: string
): ComboboxOption | undefined {
  const searchLower = searchValue.trim().toLowerCase();
  return options.find(
    (option) =>
      option.value.toLowerCase() === searchLower ||
      option.label.toLowerCase() === searchLower
  );
}

/**
 * Determines if the current search value is a custom value (not in options)
 */
export function isCustomValue(
  searchValue: string,
  filteredOptions: ComboboxOption[],
  allOptions: ComboboxOption[],
  allowCustom: boolean
): boolean {
  if (!searchValue.trim() || !allowCustom) return false;

  const searchLower = searchValue.toLowerCase();
  // First check filtered options (smaller set)
  if (filteredOptions.some((option) => option.value.toLowerCase() === searchLower)) {
    return false;
  }
  // Only check all options if not found in filtered (rare case)
  return !allOptions.some((option) => option.value.toLowerCase() === searchLower);
}

/**
 * Gets the display value for the input field
 */
export function getDisplayValue(
  searchValue: string,
  selectedValue: string | undefined,
  options: ComboboxOption[],
  isOpen: boolean
): string {
  // If user is searching (has typed something), always show searchValue
  if (searchValue) return searchValue;
  
  // If dropdown is open and searchValue is empty, show empty (user cleared it)
  if (isOpen) return "";
  
  // If dropdown is closed and there's a selected value, show its label
  if (selectedValue) {
    return options.find((opt) => opt.value === selectedValue)?.label || selectedValue;
  }
  
  return "";
}

