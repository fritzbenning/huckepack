export function formatDuration(ms: number | null): string {
  if (ms === null) return "0μs";
  if (ms < 0.001) return `${(ms * 1000).toFixed(1)}μs`;
  if (ms < 1) return `${(ms * 1000).toFixed(1)}μs`;
  if (ms < 1000) return `${ms.toFixed(2)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}
