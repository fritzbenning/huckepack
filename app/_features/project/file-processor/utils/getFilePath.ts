import { localPath } from "@project/file-manager/constants";

interface FilePathInput {
  repository_path?: string | null;
  name: string;
  extension: string;
}

export function getFilePath(file: FilePathInput): string {
  const path = file.repository_path || `${localPath}${file.name}.${file.extension}`;
  return path.startsWith("/") ? path : `/${path}`;
}
