export function formatArchitectureOutput(partialObject: { components?: unknown; pages?: unknown }): string {
  const parts: string[] = [];

  if (Array.isArray(partialObject.pages) && partialObject.pages.length > 0) {
    parts.push("\n## Pages\n");
    partialObject.pages.forEach((page: unknown) => {
      if (
        page &&
        typeof page === "object" &&
        "name" in page &&
        "purpose" in page &&
        typeof page.name === "string" &&
        typeof page.purpose === "string"
      ) {
        parts.push(`- **${page.name}**: ${page.purpose}`);
        if ("dependencies" in page && Array.isArray(page.dependencies) && page.dependencies.length > 0) {
          parts.push(`  - Uses: ${page.dependencies.join(", ")}`);
        }
      }
    });
  }

  if (Array.isArray(partialObject.components) && partialObject.components.length > 0) {
    parts.push("## Components\n");
    partialObject.components.forEach((component: unknown) => {
      if (
        component &&
        typeof component === "object" &&
        "name" in component &&
        "purpose" in component &&
        typeof component.name === "string" &&
        typeof component.purpose === "string"
      ) {
        parts.push(`- **${component.name}**: ${component.purpose}`);
      }
    });
  }

  return parts.join("\n");
}
