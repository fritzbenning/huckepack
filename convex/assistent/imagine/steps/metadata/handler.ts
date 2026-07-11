import { projectMetaAgent } from "../../../agents/projectMetaAgent";
import type { MetadataInput, WorkflowContext, WorkflowYield } from "../../types";
import { createErrorMessage } from "../../utils/errorHandlers";
import type { Metadata } from "./schema";

export async function* executeMetadata(
  _context: WorkflowContext,
  input: MetadataInput
): AsyncGenerator<WorkflowYield, Metadata> {
  try {
    const result = await projectMetaAgent(input.prompt);

    yield { type: "meta", projectName: result.object.name };

    return result.object;
  } catch (error) {
    throw new Error(createErrorMessage("generate project name", error));
  }
}
