import type { Id } from "@convex/_generated/dataModel";
import type { ActionCtx } from "@convex/_generated/server";
import type { Architecture } from "../steps/architecture/schema";

export interface WorkflowContext {
  ctx: ActionCtx;
  userId: Id<"users">;
}

export interface WorkflowYield {
  type: "step" | "text" | "meta";
  text?: string;
  status?: "in-progress" | "completed";
  stepId?: string;
  output?: string;
  reasoning?: string;
  projectId?: Id<"projects">;
  projectName?: string;
}

// Step-specific input types
export interface RebriefingInput {
  prompt: string;
}

export interface ArchitectureInput {
  prompt: string;
  briefing: string;
}

export interface MetadataInput {
  prompt: string;
  architecture?: Architecture;
  briefing?: string;
}

export interface SetupInput {
  teamId: Id<"teams">;
  projectName: string;
  description: string;
}

export interface PlanningInput {
  architecture: Architecture;
}

export interface FilesInput {
  projectId: Id<"projects">;
  orderedFiles: Array<{ name: string; isPage: boolean; dependencies: string[]; purpose: string }>;
  briefing: string;
}
