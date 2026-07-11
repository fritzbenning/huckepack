import type { AssignmentPatternProperty, ObjectPattern } from "@swc/wasm-web";

export function findParameterByName(
  pattern: ObjectPattern | undefined,
  paramName: string
): AssignmentPatternProperty | undefined {
  if (!pattern?.properties) {
    return undefined;
  }

  const properties = pattern.properties;

  // Skip RestElement items (like ...restProps) which don't have a key property
  return properties.find((p) => {
    if (p.type === "RestElement" || !("key" in p) || !p.key) {
      return false;
    }
    const assignmentParam = p as AssignmentPatternProperty;
    return assignmentParam.key && "value" in assignmentParam.key && assignmentParam.key.value === paramName;
  }) as AssignmentPatternProperty | undefined;
}
