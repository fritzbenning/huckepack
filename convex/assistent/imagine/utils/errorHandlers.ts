export function createErrorMessage(operation: string, error: unknown): string {
  const errorMessage = error instanceof Error ? error.message : "Unknown error";
  return `Failed to ${operation}: ${errorMessage}`;
}

export class WorkflowError extends Error {
  constructor(
    public readonly step: string,
    message: string,
    public readonly originalError?: unknown
  ) {
    super(message);
    this.name = "WorkflowError";
  }
}
