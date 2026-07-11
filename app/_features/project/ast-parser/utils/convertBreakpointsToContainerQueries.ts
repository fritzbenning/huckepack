import { breakpoints } from "../../file-processor/constants";

export function convertBreakpointsToContainerQueries(code: string): string {
  return breakpoints.reduce((transformedCode, breakpoint) => {
    const regex = new RegExp(`(?<!@)\\b${breakpoint}:([\\w-]+)`, "g");
    return transformedCode.replace(regex, `@${breakpoint}/viewport:$1`);
  }, code);
}
