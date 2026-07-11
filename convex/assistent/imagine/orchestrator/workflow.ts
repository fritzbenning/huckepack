import { executeArchitecture } from "../steps/architecture";
import { executeFiles } from "../steps/files";
import { executeMetadata } from "../steps/metadata";
import { executePlanning } from "../steps/planning";
import { executeRebriefing } from "../steps/rebriefing";
import { executeSetup } from "../steps/setup";
import type { WorkflowYield } from "../types";
import type { WorkflowConfig, WorkflowResult } from "./types";

export async function* runImagineWorkflow(config: WorkflowConfig): AsyncGenerator<WorkflowYield, WorkflowResult> {
  const context = { ctx: config.ctx, userId: config.userId };

  // Step 1: Generate project metadata from prompt
  const metadata = yield* executeMetadata(context, {
    prompt: config.prompt,
  });

  // Step 2: Create design briefing
  const rebriefing = yield* executeRebriefing({ prompt: config.prompt });

  // Step 3: Analyze project architecture
  const architecture = yield* executeArchitecture(context, {
    prompt: config.prompt,
    briefing: rebriefing.briefing,
  });

  // Step 4: Create project (setup)
  const projectId = yield* executeSetup(context, {
    teamId: config.teamId,
    projectName: metadata.name,
    description: `Project created from: ${config.prompt}`,
  });

  yield {
    type: "meta",
    projectId,
    projectName: metadata.name,
  };

  // Step 5: Plan file structure
  const orderedFiles = yield* executePlanning(context, { architecture });

  // Step 6: Create files
  yield* executeFiles(context, {
    projectId,
    orderedFiles,
    briefing: rebriefing.briefing,
  });

  return {
    projectId,
    projectName: metadata.name,
  };
}
