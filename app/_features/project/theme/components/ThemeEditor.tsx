import Button from "@shared/ui-kit/ui/Button";
import { useAsyncAction } from "@shared/action";
import { useState } from "react";
import { useTheme } from "../hooks/useTheme";

interface ThemeEditorProps {
  themeId: string;
  projectId: string;
}

/**
 * Example component showing how to use the theme feature
 * with optimistic updates
 */
export function ThemeEditor({ themeId, projectId }: ThemeEditorProps) {
  const { theme, loading: loadingTheme } = useTheme(themeId);
  const [content, setContent] = useState("");

  const { action: updateTheme, loading: updating } = useAsyncAction("theme.update", {
    onSuccess: () => {
      console.info("Theme updated successfully");
    },
    onError: (error: string) => {
      console.error("Failed to update theme:", error);
    },
  });

  const handleSave = () => {
    updateTheme({
      themeId,
      projectId,
      content,
    });
  };

  if (loadingTheme) {
    return <div>Loading theme...</div>;
  }

  if (!theme) {
    return <div>Theme not found</div>;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="font-semibold text-lg">{theme.name}</h2>
        <p className="text-gray-500 text-sm">Version: {theme.current_version?.id || 0}</p>
      </div>

      <textarea
        className="h-96 w-full rounded border p-4 font-mono text-sm"
        value={content || theme.current_version?.content || ""}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Enter your Tailwind v4 theme..."
      />

      <Button onClick={handleSave} disabled={updating || !content}>
        {updating ? "Saving..." : "Save Theme"}
      </Button>
    </div>
  );
}
