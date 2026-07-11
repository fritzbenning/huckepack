import type { ExternalDependency } from "@project/ast-parser";

export const prepareDepsForPackageJson = (
  defaultDependencies: Record<string, string>,
  dependencies: ExternalDependency[]
): Record<string, string> => {
  return dependencies.reduce(
    (acc, dependency) => {
      if (dependency.name in defaultDependencies) {
        return acc;
      }

      // Use provided version or default to "latest" if no version is specified
      const version = dependency.version || "latest";

      // Add the dependency to the accumulator object
      acc[dependency.name] = version;

      return acc;
    },
    {} as Record<string, string>
  );
};
