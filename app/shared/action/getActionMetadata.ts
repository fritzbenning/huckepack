import { actionRegistry } from "./actionRegistry";
import type { ActionName } from "./types";

export interface ActionMetaInfo {
  description: string;
  parameters: Record<
    string,
    {
      type: string;
      description: string;
    }
  >;
}

export type ActionRegistryMetaMap = Record<ActionName, ActionMetaInfo>;

export function getActionRegistryMetaMap(): ActionRegistryMetaMap {
  return Object.fromEntries(
    Object.entries(actionRegistry).map(([name, definition]) => [
      name,
      {
        description: definition.description,
        parameters: definition.parameters,
      },
    ])
  ) as ActionRegistryMetaMap;
}

export function getActionMeta(actionName: ActionName): ActionMetaInfo | undefined {
  const action = actionRegistry[actionName as keyof typeof actionRegistry];
  if (!action) return undefined;

  return {
    description: action.description,
    parameters: action.parameters,
  };
}

export function formatActionsForAI(): string {
  return Object.entries(actionRegistry)
    .map(([actionName, definition]) => {
      const params = Object.entries(definition.parameters)
        .map(([paramName, paramInfo]) => `    - ${paramName} (${paramInfo.type}): ${paramInfo.description}`)
        .join("\n");

      return `  - ${actionName}: ${definition.description}${
        Object.keys(definition.parameters).length > 0 ? `\n    Parameters:\n${params}` : "\n    Parameters: None"
      }`;
    })
    .join("\n\n");
}
