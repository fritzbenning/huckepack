import { Moon, Sun } from "@phosphor-icons/react";
import { InlineIconButton } from "@shared/ui-kit/editor/ui/InlineIconButton";
import { Tooltip } from "@shared/ui-kit/ui/Tooltip";
import { useTheme } from "../hooks/useTheme";

export function ThemeToggle() {
  const { isDarkMode, toggleThemeMode } = useTheme();

  return (
    <Tooltip
      display="flex"
      content={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      position="bottom"
      triggerClassName="h-4"
    >
      <InlineIconButton
        icon={isDarkMode ? Moon : Sun}
        size="medium"
        onClick={toggleThemeMode}
        title={`Switch to ${isDarkMode ? "light" : "dark"} mode`}
      />
    </Tooltip>
  );
}
