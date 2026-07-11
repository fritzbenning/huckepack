import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import { toSlug } from "@shared/utils/format";
import type { File } from "../types";

export const updateFile = async (params: {
  id: Id<"files">;
  name?: string;
  type?: string;
  draft?: boolean;
  tags?: string[];
}): Promise<File> => {
  await convex.mutation(api.files.update, {
    id: params.id,
    name: params.name !== undefined ? params.name : undefined,
    type: params.type !== undefined ? params.type : undefined,
    draft: params.draft !== undefined ? params.draft : undefined,
    tags: params.tags !== undefined ? params.tags : undefined,
  });

  const updatedFileData = await convex.query(api.files.get, {
    fileId: params.id,
  });

  if (!updatedFileData) {
    throw new Error("Failed to fetch updated file");
  }

  const slug = toSlug(updatedFileData.name);

  const file: File = {
    id: updatedFileData._id,
    name: updatedFileData.name,
    slug: slug,
    extension: updatedFileData.extension,
    type: updatedFileData.type,
    project_id: updatedFileData.projectId,
    current_version: updatedFileData.currentVersion,
    current_version_id: null,
    last_edit: new Date(updatedFileData.updatedAt).toISOString(),
    last_editor: updatedFileData.lastEditor,
    draft: updatedFileData.draft || false,
    owner_id: updatedFileData.ownerId || null,
    tags: updatedFileData.tags || [],
    created_at: new Date(updatedFileData._creationTime).toISOString(),
    updated_at: new Date(updatedFileData.updatedAt).toISOString(),
  };

  return file;
};
