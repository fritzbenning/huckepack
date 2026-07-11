import { type ActionDefinition, actionRegistry } from "@shared/action/actionRegistry";
import { type Tool, tool } from "ai";
import { z } from "zod";

export function createClientTools(): Record<string, Tool> {
  const tools: Record<string, Tool> = {};

  for (const [actionName, actionDef] of Object.entries(actionRegistry)) {
    const zodSchema = createZodSchemaFromParameters(actionDef.parameters);

    tools[actionName] = tool({
      description: actionDef.description,
      inputSchema: zodSchema,
      execute: async (params: z.infer<typeof zodSchema>) => {
        try {
          const result = await (actionDef.handler as (params: unknown) => Promise<unknown>)(params);
          return JSON.stringify(result);
        } catch (error) {
          return JSON.stringify({
            error: error instanceof Error ? error.message : "Unknown error",
            action: actionName,
          });
        }
      },
    });
  }

  return tools;
}

function createZodSchemaFromParameters(
  parameters: ActionDefinition["parameters"]
): z.ZodObject<Record<string, z.ZodTypeAny>> {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const [key, param] of Object.entries(parameters)) {
    switch (param.type) {
      case "string":
        shape[key] = z.string().describe(param.description);
        break;
      case "number":
        shape[key] = z.number().describe(param.description);
        break;
      case "array":
        shape[key] = z.array(z.string()).describe(param.description);
        break;
      case "object":
        shape[key] = z.record(z.string(), z.unknown()).describe(param.description);
        break;
      default:
        shape[key] = z.unknown().describe(param.description);
    }
  }

  return z.object(shape);
}
