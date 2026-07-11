import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import { useFiles } from "@project/file/hooks/useFiles";
import { getAllFiles, getFile } from "@project/file-manager";
import { processAndStoreFile } from "@project/file-processor/services/processAndStoreFile";
import { toSlug } from "@shared/utils/format/toSlug";
import { useEffect, useState } from "react";

export function useFileProcessor(projectId: Id<"projects"> | null) {
  const { files: projectFilesMetadata, loading: filesLoading } = useFiles(projectId);

  const [loading, setLoading] = useState(true);
  const [processedCachedFiles, setProcessedCachedFiles] = useState(false);

  useEffect(() => {
    if (!projectId) {
      return;
    }

    if (filesLoading || !projectFilesMetadata) {
      // still loading or no files
      return;
    }

    const filesMetadata = projectFilesMetadata;

    const run = async () => {
      // Step 1: Reprocess locally cached files
      if (!processedCachedFiles) {
        const persistedFiles = getAllFiles(projectId as Id<"projects">);

        for (const file of persistedFiles) {
          try {
            await processAndStoreFile(
              file.id,
              file.name,
              file.code.reference,
              projectId as Id<"projects">,
              file.lastEdit,
              null,
              file.extension,
              file.slug,
              file.parsedAt,
              file.viewportWidth
            );
          } catch (error) {
            console.error(`[useFileProcessor] Error reprocessing persisted file ${file.id}:`, error);
          }
        }

        setProcessedCachedFiles(true);
      }

      // Step 2: Process files that changed (existing logic)
      const changedFiles = filesMetadata.filter((file) => {
        const local = getFile(file._id, projectId as Id<"projects">);
        const dbUpdatedAt = file.updatedAt ?? 0;
        const localParsedAt = local?.parsedAt ?? null;

        return !local || localParsedAt === null || dbUpdatedAt > localParsedAt;
      });

      if (changedFiles.length === 0) {
        setLoading(false);
        return;
      }

      for (const fileMetadata of changedFiles) {
        try {
          const fullFile = await convex.query(api.files.get, { fileId: fileMetadata._id });

          if (!fullFile) {
            console.warn(`[useFileProcessor] File ${fileMetadata._id} not found`);
            continue;
          }

          const slug = toSlug(fullFile.name);

          await processAndStoreFile(
            fullFile._id,
            fullFile.name,
            fullFile.code,
            fullFile.projectId,
            null,
            null,
            fullFile.extension,
            slug,
            undefined,
            fullFile.viewportWidth
          );
        } catch (error) {
          console.error(`[useFileProcessor] Error processing file ${fileMetadata._id}:`, error);
        }
      }

      setLoading(false);
    };

    run();
  }, [projectFilesMetadata, projectId]);

  return {
    loading: filesLoading || loading,
  };
}
