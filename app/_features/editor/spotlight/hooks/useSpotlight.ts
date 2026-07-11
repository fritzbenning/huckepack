import type { Id } from "@convex/_generated/dataModel";
import { addTab } from "@editor/tabs";
import { prepareProjectFileRoute } from "@project/file/services/prepareProjectFileRoute";
import { useStoreFile, useStoreFiles } from "@project/file-manager/stores/fileManagerStore";
import { executeAction } from "@shared/action";
import type { ComboboxOption } from "@shared/ui-kit/inputs/combobox/useCombobox";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface UseSpotlightProps {
  projectId: Id<"projects">;
  fileId?: Id<"files">;
}

export interface UseSpotlightReturn {
  options: ComboboxOption[];
  handleNavigate: (value: string) => void;
  handleInsert: (value: string) => Promise<void>;
  isComponent: (fileId: string) => boolean;
}

export function useSpotlight({ projectId, fileId }: UseSpotlightProps): UseSpotlightReturn {
  const navigate = useNavigate();
  const files = useStoreFiles(projectId);
  const { file: currentFile } = useStoreFile(fileId, projectId);

  const options = useMemo<ComboboxOption[]>(() => {
    return files.map((file) => ({
      value: file.id,
      label: file.name,
    }));
  }, [files]);

  const handleNavigate = (fileIdToNavigate: string) => {
    const file = files.find((f) => f.id === fileIdToNavigate);
    if (!file) return;

    const route = prepareProjectFileRoute(projectId, fileIdToNavigate);
    addTab(fileIdToNavigate, file.name, projectId, "file");
    navigate(route);
  };

  const handleInsert = async (componentFileId: string) => {
    if (!fileId || !currentFile) {
      toast.error("Cannot insert component", {
        description: "No file is currently open",
      });
      return;
    }

    const componentFile = files.find((f) => f.id === componentFileId);
    if (!componentFile) {
      toast.error("Component not found");
      return;
    }

    if (componentFile.id === fileId) {
      toast.error("Cannot insert component", {
        description: "Cannot insert a component into itself",
      });
      return;
    }

    try {
      const result = await executeAction("instance.insert", {
        instanceFileId: componentFileId,
        projectId,
        targetFileId: fileId,
      });

      if (result && typeof result === "object" && "success" in result && !result.success) {
        const errorResult = result as { success: false; error?: string };
        toast.error("Failed to insert component", {
          description: errorResult.error || "Unknown error occurred",
        });
      } else {
        toast.success("Component inserted successfully", {
          description: "Component added to canvas",
        });
      }
    } catch (error) {
      console.error("Error inserting component:", error);
      toast.error("Failed to insert component", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  const isComponent = (fileIdToCheck: string): boolean => {
    const file = files.find((f) => f.id === fileIdToCheck);
    return !!file?.export;
  };

  return {
    options,
    handleNavigate,
    handleInsert,
    isComponent,
  };
}
