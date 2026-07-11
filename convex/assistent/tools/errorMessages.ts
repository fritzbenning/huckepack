export const ErrorMessages = {
  fileNotFound: (fileId: string) => `File with ID ${fileId} not found.`,
  fileIdRequired: () =>
    "Error: fileId is required. Either provide it as an argument or ensure currentFileId is available in context. Use getCurrentFile to check the current file, or getProjectFiles to list all files.",
  userIdRequired: () => "Error: User must be authenticated. userId is not available in context.",
  projectNotFound: () => "No files found in this project.",
  themeNotFound: () => "No tailwind theme found for this project. A default theme will be created when needed.",
  themeEmpty: () => "Theme exists but has no content.",
  themeUpdateFailed: () => "Theme was updated but could not be retrieved.",
  fileUpdateFailed: () => "File was updated but could not be retrieved.",
  genericError: (operation: string, error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return `Error ${operation}: ${errorMessage}. Please ensure you have access to this resource.`;
  },
};









