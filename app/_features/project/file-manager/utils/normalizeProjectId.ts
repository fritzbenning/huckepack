import type { Id } from "@convex/_generated/dataModel";

export function normalizeProjectId(projectId?: Id<"projects">): Id<"projects"> {
  return (projectId ?? ("" as Id<"projects">)) as Id<"projects">;
}
