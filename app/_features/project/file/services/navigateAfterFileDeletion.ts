import { prepareProjectRoute } from "@hub/projects";
import { getAllFiles } from "@project/file-manager";
import type { NavigateFunction } from "react-router-dom";
import { prepareProjectFileRoute } from "./prepareProjectFileRoute";

export function navigateAfterFileDeletion(
  navigate: NavigateFunction,
  projectId: string,
  navigateTo?: "library" | "first-file"
): void {
  if (navigateTo === "library") {
    const libraryRoute = prepareProjectRoute(projectId);
    navigate(libraryRoute);
  } else if (navigateTo === "first-file") {
    // Get remaining files after deletion (file is already removed from store)
    const remainingFiles = getAllFiles(projectId);
    if (remainingFiles.length > 0) {
      const firstFile = remainingFiles[0];
      const fileRoute = prepareProjectFileRoute(projectId, firstFile.id);
      navigate(fileRoute);
    } else {
      // No files remaining, navigate to library
      const libraryRoute = prepareProjectRoute(projectId);
      navigate(libraryRoute);
    }
  } else {
    // Default fallback: navigate back
    navigate(-1);
  }
}
