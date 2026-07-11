import { api } from "@convex/_generated/api";
import type { Id } from "@convex/_generated/dataModel";
import { convex } from "@lib/convex";

export async function getVersions(fileId: string) {
  return await convex.query(api.files.getVersions, {
    fileId: fileId as Id<"files">,
  });
}

export async function loadVersion(fileId: string, versionNumber: number) {
  const versions = await getVersions(fileId);
  return versions.find((v) => v.version === versionNumber);
}

export async function restoreVersion(fileId: string, versionNumber: number): Promise<string | null> {
  const version = await loadVersion(fileId, versionNumber);
  return version?.code ?? null;
}

