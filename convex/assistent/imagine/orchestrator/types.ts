import type { Id } from "@convex/_generated/dataModel";

export interface WorkflowConfig {
  ctx: any;
  userId: Id<"users">;
  teamId: Id<"teams">;
  prompt: string;
}

export interface WorkflowResult {
  projectId: Id<"projects">;
  projectName: string;
}
