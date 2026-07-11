import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";
import { toSlug } from "@shared/utils/format";
import { DEFAULT_THREAD_TITLE } from "../../../assistent/constants";
import { createFileChatThread, setActiveThreadId } from "../../file-manager/stores/fileManagerStore";
import { processAndStoreFile } from "../../file-processor/services/processAndStoreFile";
import { DEFAULT_TEMPLATE } from "../../file-version/constants";
import type { File } from "../types";

export const createFile = async (params: {
  name: string;
  projectId: Id<"projects">;
  type?: string;
  tags?: string[];
  code?: string;
}): Promise<File> => {
  const nameWithoutExt = params.name.replace(/\.(tsx?|jsx?)$/, "");
  const extension = params.name.match(/\.(tsx?|jsx?)$/)?.[1] || "tsx";
  const slug = toSlug(params.name);

  let templateCode = params.code || DEFAULT_TEMPLATE;
  if (!params.code && nameWithoutExt) {
    const componentName = slug || toSlug(nameWithoutExt) || "Component";
    templateCode = templateCode.replace(/ComponentName/g, componentName);
  }

  const fileId = await convex.mutation(api.files.create, {
    projectId: params.projectId,
    name: nameWithoutExt,
    type: params.type || "component",
    extension: extension,
    code: templateCode,
    tags: params.tags,
  });

  if (!fileId) {
    throw new Error("Failed to create file");
  }

  const fileData = await convex.query(api.files.get, { fileId });
  if (!fileData) {
    throw new Error("Failed to fetch created file");
  }

  const file: File = {
    id: fileData._id,
    name: fileData.name,
    slug: slug,
    extension: fileData.extension,
    type: fileData.type,
    project_id: fileData.projectId,
    current_version: fileData.currentVersion,
    current_version_id: null,
    last_edit: new Date(fileData.updatedAt).toISOString(),
    last_editor: fileData.lastEditor,
    draft: fileData.draft || false,
    owner_id: fileData.ownerId || null,
    tags: fileData.tags || [],
    created_at: new Date(fileData._creationTime).toISOString(),
    updated_at: new Date(fileData.updatedAt).toISOString(),
  };

  if (templateCode) {
    try {
      await processAndStoreFile(
        file.id,
        nameWithoutExt,
        templateCode,
        params.projectId,
        file.last_edit,
        null,
        file.extension,
        slug
      );

      // Create first assistant chat thread automatically after file is processed and stored
      const threadId = createFileChatThread(file.id, params.projectId, DEFAULT_THREAD_TITLE);
      setActiveThreadId(file.id, threadId, params.projectId);
    } catch (error) {
      console.error(`[createFile] Error processing file ${file.id}:`, error);
    }
  }

  return file;
};
