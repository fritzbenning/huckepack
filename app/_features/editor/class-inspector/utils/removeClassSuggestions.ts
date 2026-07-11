import type { Id } from "@convex/_generated/dataModel";
import { getFileClassSuggestions, setFileClassSuggestions } from "@project/file-manager/stores/fileManagerStore";

export function removeClassSuggestionsForAddedClass(
  fileId: Id<"files">,
  nodeId: string | null,
  addedClass: string,
  projectId: Id<"projects">
): void {
  if (!nodeId) return;

  const suggestions = getFileClassSuggestions(fileId, nodeId, projectId);
  const filtered = suggestions.filter((suggestion) => suggestion !== addedClass);

  if (filtered.length !== suggestions.length) {
    setFileClassSuggestions(fileId, nodeId, filtered, projectId);
  }
}

export function removeClassSuggestionsForReplacedClass(
  fileId: Id<"files">,
  nodeId: string | null,
  newClass: string,
  projectId: Id<"projects">
): void {
  if (!nodeId) return;

  const suggestions = getFileClassSuggestions(fileId, nodeId, projectId);
  const filtered = suggestions.filter((suggestion) => suggestion !== newClass);

  if (filtered.length !== suggestions.length) {
    setFileClassSuggestions(fileId, nodeId, filtered, projectId);
  }
}
