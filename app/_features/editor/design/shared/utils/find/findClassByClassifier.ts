import { classifyClass } from "../../helpers/classifier";

/**
 * Finds a class in classTokens that is classified as the given feature prefix.
 * Uses the class classifier to match classes to features.
 *
 * @param classTokens - Array of Tailwind class tokens to search
 * @param featurePrefix - The feature prefix to match against
 * @returns The matching class name, or undefined if not found
 * @example
 * // Simple: Find class by feature classifier
 * findClassByClassifier(["bg-red-500", "w-10"], "backgroundColor"); // "bg-red-500"
 *
 * @example
 * // Comprehensive: Classifier distinguishes similar classes
 * findClassByClassifier(["text-red-500", "text-sm"], "textColor"); // "text-red-500"
 * findClassByClassifier(["text-red-500", "text-sm"], "fontSize"); // "text-sm"
 * findClassByClassifier(["w-10", "h-20"], "width"); // "w-10"
 * findClassByClassifier(["p-4"], "backgroundColor"); // undefined - no match
 */
export function findClassByClassifier(classTokens: string[], featurePrefix: string): string | undefined {
  return classTokens.find((className) => classifyClass(className) === featurePrefix);
}
