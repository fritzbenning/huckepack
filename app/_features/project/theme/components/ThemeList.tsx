import Button from "@shared/ui-kit/ui/Button";
import { useAsyncAction } from "@shared/action";
import { useThemes } from "../hooks/useThemes";

interface ThemeListProps {
  projectId: string;
  onThemeSelect?: (themeId: string) => void;
}

/**
 * Example component showing how to list and delete themes
 * with optimistic updates
 */
export function ThemeList({ projectId, onThemeSelect }: ThemeListProps) {
  const { themes, loading } = useThemes(projectId);

  const { action: deleteTheme, loading: deleting } = useAsyncAction("theme.delete", {
    onSuccess: () => {
      console.info("Theme deleted successfully");
    },
    onError: (error: string) => {
      console.error("Failed to delete theme:", error);
    },
  });

  const handleDelete = (themeId: string) => {
    if (confirm("Are you sure you want to delete this theme?")) {
      deleteTheme({
        themeId,
        projectId,
      });
    }
  };

  if (loading) {
    return <div>Loading themes...</div>;
  }

  if (themes.length === 0) {
    return <div>No themes found</div>;
  }

  return (
    <div className="space-y-2">
      {themes.map((theme) => (
        <div key={theme.id} className="flex items-center justify-between rounded border p-4">
          <div className="flex-1">
            <h3 className="font-medium">{theme.name}</h3>
            <p className="text-gray-500 text-sm">Version: {theme.current_version?.id || 0}</p>
            {theme.repository_path && <p className="text-gray-400 text-xs">{theme.repository_path}</p>}
          </div>
          <div className="flex gap-2">
            {onThemeSelect && (
              <Button variant="outline" onClick={() => onThemeSelect(theme.id)}>
                Edit
              </Button>
            )}
            <Button variant="outline" onClick={() => handleDelete(theme.id)} disabled={deleting}>
              Delete
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
