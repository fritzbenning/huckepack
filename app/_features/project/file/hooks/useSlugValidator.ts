import { getAllFiles } from "@project/file-manager";
import { toSlug } from "@shared/utils/format";
import { useEffect, useState } from "react";

interface UseSlugValidatorOptions {
  fileName: string;
  projectId: string;
}

export function useSlugValidator({ fileName, projectId }: UseSlugValidatorOptions) {
  const [fileNameError, setFileNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!fileName.trim() || !projectId) {
      setFileNameError(null);
      return;
    }

    const checkSlugExists = () => {
      const slug = toSlug(fileName);

      if (!slug) {
        setFileNameError(null);
        return;
      }

      try {
        // Get files from fileManagerStore
        const existingFiles = getAllFiles(projectId);

        // Check if any file's slug matches
        const slugExists = existingFiles.some((file) => file.slug === slug);

        if (slugExists) {
          setFileNameError("A file with this name already exists");
        } else {
          setFileNameError(null);
        }
      } catch (error) {
        console.error("Error checking file slug:", error);
        setFileNameError(null);
      }
    };

    checkSlugExists();
  }, [fileName, projectId]);

  return fileNameError;
}
