import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { removeFileDependencies, removeFileRoutesAndImports } from "@hub/projects";
import { convex } from "@lib/convex";
import { getFile, removeFile, removeSandpackFile } from "@project/file-manager";

export const deleteFile = async (params: { fileId: Id<"files">; projectId: Id<"projects"> }): Promise<boolean> => {
  const { fileId, projectId } = params;

  const file = getFile(fileId, projectId);

  try {
    // Unpin the file if it's pinned (ignore errors if not pinned)
    try {
      await convex.mutation(api.pinnedItems.unpin, {
        entityType: "file",
        entityId: fileId,
      });
    } catch (error) {
      // File may not be pinned, continue with deletion
      console.error("File was not pinned or error unpinning:", error);
    }

    // Delete the file and its versions using Convex mutation
    await convex.mutation(api.files.delete_, {
      id: fileId,
    });

    if (file?.path) {
      removeSandpackFile(file.path, projectId);
    }

    removeFile(fileId, projectId);

    // Clean up related data after successful deletion
    removeFileDependencies(projectId, fileId);

    if (file?.path && file?.name) {
      removeFileRoutesAndImports(projectId, file.path, file.name);
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFile:", error);
    throw error;
  }
};
