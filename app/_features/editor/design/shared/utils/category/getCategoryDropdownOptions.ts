import type { DesignPropertyConfig, DesignPropertyKey, DesignPropertyRegistryEntry } from "@editor/design/registry/types";
import type { DropdownValue } from "@editor/design/ui/design-category/types";

export interface DropdownOption {
  value: string;
  label: string;
  dropdownValue: DropdownValue;
  config: DesignPropertyConfig;
}

/**
 * Gets dropdown options for category selection from available rules.
 * Extracts dropdown values from each rule and formats them as options.
 *
 * @param availableRules - Array of available design property registry entries
 * @param presentProperties - Record of present property keys
 * @returns Array of dropdown options
 * @example
 * // Simple: Get dropdown options
 * const options = getCategoryDropdownOptions(availableRules, {});
 * // Returns: [{ value: "w-auto", label: "Width", dropdownValue: {...} }, ...]
 *
 * @example
 * // Comprehensive: Use dropdown options in UI
 * const rules = [
 *   { key: "width", getDropdownValues: () => [{ classToAdd: "w-auto", label: "Width", siblingClasses: [] }] }
 * ];
 * const options = getCategoryDropdownOptions(rules, {});
 * options.forEach(opt => {
 *   console.log(`${opt.label}: ${opt.value}`); // "Width: w-auto"
 * });
 */
export function getCategoryDropdownOptions(
  availableRules: DesignPropertyRegistryEntry[],
  presentProperties: Record<DesignPropertyKey, boolean>
): DropdownOption[] {
  const options: DropdownOption[] = [];

  for (const rule of availableRules) {
    const dropdownValues = rule.getDropdownValues(presentProperties);
    for (const dropdownValue of dropdownValues) {
      options.push({
        value: dropdownValue.classToAdd,
        label: dropdownValue.label,
        dropdownValue,
        config: rule.config,
      });
    }
  }

  return options;
}
