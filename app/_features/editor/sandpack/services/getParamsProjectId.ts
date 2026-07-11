export function getParamsProjectId(params: Record<string, string | undefined>): string | undefined {
  const catchAllPath = params["*"];
  const projectIdMatch = catchAllPath?.match(/^project\/([0-9a-f-]{36})/i);
  return projectIdMatch?.[1];
}
