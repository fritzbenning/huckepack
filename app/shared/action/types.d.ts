import type { actionRegistry } from "./actionRegistry";

// Extract action names as union type
export type ActionName = keyof typeof actionRegistry;

// Extract parameter types for each action
export type ActionParams<T extends ActionName> = Parameters<(typeof actionRegistry)[T]["handler"]>[0];

// Extract return types for each action
export type ActionResult<T extends ActionName> = Awaited<ReturnType<(typeof actionRegistry)[T]["handler"]>>;
