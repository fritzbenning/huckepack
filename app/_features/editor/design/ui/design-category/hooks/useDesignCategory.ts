import type { DesignPropertyKey } from "@editor/design/registry";
import { getCategoryDropdownOptions } from "@editor/design/shared/utils";
import { getAvailableCategoryProperties } from "@editor/design/shared/utils/category";
import { getPresentCategoryProperties } from "@editor/design/shared/utils/registry/getPresentCategoryProperties";
import type { CategoryConfig } from "@editor/design/ui/design-category/types";
import { useMemo } from "react";

interface UseDesignCategoryParams {
  category: CategoryConfig;
  presentProperties: Record<DesignPropertyKey, boolean>;
}

export function useDesignCategory({ category, presentProperties }: UseDesignCategoryParams) {
  const availableRules = useMemo(
    () => getAvailableCategoryProperties(category.rules, presentProperties),
    [category.rules, presentProperties]
  );

  const presentRules = useMemo(
    () => getPresentCategoryProperties(category.rules, presentProperties),
    [category.rules, presentProperties]
  );

  const dropdownOptions = useMemo(
    () => getCategoryDropdownOptions(availableRules, presentProperties),
    [availableRules, presentProperties]
  );

  const showActionButton = dropdownOptions.length > 0;

  return {
    availableRules,
    presentRules,
    dropdownOptions,
    showActionButton,
  };
}
