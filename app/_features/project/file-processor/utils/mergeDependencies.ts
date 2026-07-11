import type { ExternalDependency } from "@project/ast-parser";

export function mergeDependencies(existing: ExternalDependency[], newDeps: ExternalDependency[]): ExternalDependency[] {
  const dependencyMap = new Map<string, ExternalDependency>();

  existing.forEach((dep) => {
    dependencyMap.set(dep.name, { ...dep });
  });

  newDeps.forEach((dep) => {
    if (dependencyMap.has(dep.name)) {
      const existingDep = dependencyMap.get(dep.name)!;
      existingDep.importedNames.push(...dep.importedNames);
      existingDep.importedNames = [...new Set(existingDep.importedNames)];

      if (existingDep.importType === "side-effect" && dep.importType !== "side-effect") {
        existingDep.importType = dep.importType;
      }
    } else {
      dependencyMap.set(dep.name, { ...dep });
    }
  });

  return Array.from(dependencyMap.values());
}
