import type { CodeClassification } from "@ast/code-detection";
import { classifyCodeFromAST } from "@ast/code-detection/classifyCodeFromAST";
import { extractComponentNameFromAST } from "@ast/code-detection/extractComponentName";
import { convertToAST } from "@ast/convert";

export interface ClassifyCodeResult {
  classification: CodeClassification;
  componentName: string | null;
}

export async function classifyCode(code: string): Promise<ClassifyCodeResult> {
  const trimmedCode = code.trim();

  if (
    trimmedCode.startsWith("<") &&
    !trimmedCode.includes("export") &&
    !trimmedCode.includes("function") &&
    !trimmedCode.includes("const") &&
    !trimmedCode.includes("import")
  ) {
    // Check if it contains HTML-like tags
    const htmlTagPattern = /<\/?[a-z][\s\S]*>/i;
    if (htmlTagPattern.test(trimmedCode)) {
      return {
        classification: "html",
        componentName: null,
      };
    }
  }

  // Try to parse as TypeScript/React code
  try {
    const ast = await convertToAST(code);
    const classification = classifyCodeFromAST(ast);
    const componentName = extractComponentNameFromAST(ast);

    return {
      classification,
      componentName,
    };
  } catch (error) {
    // If parsing fails, it's likely unsupported
    console.error("Failed to parse code:", error);
    return {
      classification: "unsupported",
      componentName: null,
    };
  }
}
