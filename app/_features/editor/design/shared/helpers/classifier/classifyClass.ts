import { classifyBackgroundClass } from "@editor/design/shared/helpers/classifier/background";
import { classifyTextClass } from "@editor/design/shared/helpers/classifier/text";

/**
 * Classifies a Tailwind class to determine which feature/property it belongs to.
 * Uses specialized classifiers for background and text classes.
 *
 * @param className - The Tailwind class name to classify
 * @returns The feature key the class belongs to, or null if unknown
 * @example
 * // Classify background color class
 * classifyClass("bg-red-500")
 * // Returns: "backgroundColor"
 *
 * @example
 * // Classify text color class
 * classifyClass("text-blue-500")
 * // Returns: "textColor"
 *
 * @example
 * // Return null for unclassified class
 * classifyClass("w-10")
 * // Returns: null
 */
export function classifyClass(className: string): string | null {
  if (
    className.startsWith("bg-") ||
    className.startsWith("from-") ||
    className.startsWith("via-") ||
    className.startsWith("to-")
  ) {
    return classifyBackgroundClass(className);
  }

  if (className.startsWith("text-")) {
    return classifyTextClass(className);
  }

  return null;
}
