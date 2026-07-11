import { useFileManagerStore } from "@project/file-manager";

export type SandpackFiles = Record<string, string>;

export function useSandpackFiles(projectId: string | null) {
  const sandpackFiles = useFileManagerStore((state) => state.sandpackFiles, projectId ?? "");
  return sandpackFiles;
}
