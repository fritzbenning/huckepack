import { actionRegistry } from "./actionRegistry";
import type { ActionName, ActionParams } from "./types";

export const executeAction = async <T extends ActionName>(actionName: T, args: ActionParams<T>) => {
  try {
    const actionDef = actionRegistry[actionName];
    if (!actionDef) {
      throw new Error(`Action ${actionName} not found in registry`);
    }
    const result = await (actionDef.handler as (params: typeof args) => Promise<unknown>)(args);
    return result;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error";
    console.error(`Action ${actionName} failed:`, errorMsg);
    throw new Error(errorMsg);
  }
};
