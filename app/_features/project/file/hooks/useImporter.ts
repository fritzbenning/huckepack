import type { CodeClassification } from "@ast/code-detection";
import { renameComponent as renameComponentAST } from "@ast/component";
import { manipulateCodeAST } from "@ast/utils";
import { addTab } from "@editor/tabs";
import { prepareProjectFileRoute } from "@project/file";
import { useAsyncAction } from "@shared/action";
import { toSlug } from "@shared/utils/format";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { classifyCode } from "../modals/classifyCode";
import { DEFAULT_REACT_TEMPLATE } from "../modals/constants";
import type { File } from "../types";
import { useSlugValidator } from "./useSlugValidator";

interface UseImporterOptions {
  projectId: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export function useImporter({ projectId, onSuccess, onError }: UseImporterOptions) {
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [codeType, setCodeType] = useState<CodeClassification | null>(null);
  const [componentName, setComponentName] = useState<string | null>(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const navigate = useNavigate();

  const fileNameError = useSlugValidator({ fileName, projectId });

  const { action: createFileAction, loading: creatingFile } = useAsyncAction("file.create", {
    onSuccess: (result: File) => {
      // Convex queries are reactive - no manual cache invalidation needed
      toast.success("File imported successfully!");
      resetForm();

      // Navigate to the newly created file
      const fullFileName = result.extension ? `${result.name}.${result.extension}` : result.name;
      const route = prepareProjectFileRoute(projectId, result.id);
      addTab(result.id, fullFileName, projectId, "file");
      navigate(route);

      onSuccess?.();
    },
    onError: (error: string) => {
      console.error("Error importing file:", error);
      toast.error("Failed to import file. Please try again.");
      onError?.(error);
    },
  });

  useEffect(() => {
    const checkCode = async () => {
      if (!code.trim()) {
        setCodeType(null);
        return;
      }

      setIsClassifying(true);

      try {
        const { classification, componentName: extractedComponentName } = await classifyCode(code);
        setCodeType(classification);
        setComponentName(extractedComponentName);

        if (classification === "react" && !fileName && extractedComponentName) {
          setFileName(extractedComponentName);
        }
      } catch (error) {
        console.info("Error detecting code type:", error);
        setCodeType("unsupported");
        setComponentName(null);
      } finally {
        setIsClassifying(false);
      }
    };

    checkCode();
  }, [code, fileName]);

  const resetForm = useCallback(() => {
    setCode("");
    setFileName("");
    setCodeType(null);
    setComponentName(null);
  }, []);

  const handleImport = useCallback(async () => {
    if (!projectId || !code.trim() || !fileName.trim()) {
      return;
    }

    // Validate fileName is not taken
    if (fileNameError) {
      toast.error("File name already exists", {
        description: "Please choose a different file name.",
      });
      return;
    }

    // Validate code type
    switch (codeType) {
      case "unsupported": {
        toast.error("Unsupported code type", {
          description: "Please provide valid React component code or HTML.",
        });
        return;
      }
      case null: {
        toast.error("Please enter code to import");
        return;
      }
      default:
        // Valid code type, continue
        break;
    }

    let finalCode = code.trim();

    switch (codeType) {
      case "html": {
        // If it's HTML, wrap it in React component template
        const htmlContent = code.trim();
        const componentName = toSlug(fileName) || "Component";
        finalCode = DEFAULT_REACT_TEMPLATE.replace("ComponentName", componentName).replace(
          "{/* Your HTML content here */}",
          htmlContent
        );
        break;
      }
      case "react": {
        // For React components, rename the component to match the file slug before creating the file
        if (componentName) {
          const componentSlug = toSlug(fileName);

          if (componentSlug && componentName !== componentSlug) {
            const result = await manipulateCodeAST(finalCode, (ast) =>
              renameComponentAST(ast, componentName, componentSlug)
            );

            if (result.success && result.code) {
              finalCode = result.code;
            } else {
              throw new Error(result.error);
            }
          }
        }
        break;
      }
      default:
        break;
    }

    createFileAction({
      name: fileName,
      projectId,
      code: finalCode,
    });
  }, [projectId, code, fileName, codeType, fileNameError, createFileAction]);

  const isValid = code.trim().length > 0 && fileName.trim().length > 0 && codeType !== "unsupported" && !fileNameError;
  const loading = creatingFile;

  return {
    code,
    setCode,
    fileName,
    setFileName,
    codeType,
    isClassifying,
    loading,
    isValid,
    fileNameError,
    resetForm,
    handleImport,
  };
}
