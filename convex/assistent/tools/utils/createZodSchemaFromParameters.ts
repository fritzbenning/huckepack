import { z } from "zod";

interface ParameterDefinition {
  type: string;
  description: string;
}

export function createZodSchemaFromParameters(
  parameters: Record<string, ParameterDefinition>
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
