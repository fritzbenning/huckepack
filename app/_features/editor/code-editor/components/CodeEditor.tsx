import { useApplicationThemeStore } from "@application/theme";
import { javascript } from "@codemirror/lang-javascript";
import { syntaxHighlighting } from "@codemirror/language";
import { useActiveCode } from "@codesandbox/sandpack-react";
import { useParamIds } from "@hooks/useParamIds";
import { saveFileCode } from "@project/file/actions/saveFileCode";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";
import { toast } from "sonner";
import { isCodeEditorWritable } from "../constants";
import { useSelectedNodeHighlight } from "../hooks/useSelectedNodeHighlight";
import { darkTheme } from "../themes/dark";
import { darkHighlightStyle } from "../themes/darkHighlight";
import { lightTheme } from "../themes/light";
import { lightHighlightStyle } from "../themes/lightHighlight";

export function CodeEditor() {
  const { projectId, fileId } = useParamIds();

  const { code } = useActiveCode();

  const themeMode = useApplicationThemeStore((state) => state.themeMode);
  const theme = useMemo(() => (themeMode === "dark" ? darkTheme : lightTheme), [themeMode]);

  const highlightStyle = useMemo(() => (themeMode === "dark" ? darkHighlightStyle : lightHighlightStyle), [themeMode]);
  const highlightExtension = useSelectedNodeHighlight(code, projectId, fileId, themeMode);

  const handleCodeChange = (value: string) => {
    if (!fileId || !projectId) return;

    saveFileCode({
      projectId,
      fileId,
      code: value,
    }).catch((error) => {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";

      console.error(`[CodeEditor] Error saving file ${fileId}:`, error);

      toast.error("Failed to save changes", {
        description: errorMessage,
        duration: 5000,
      });
    });
  };

  return (
    <CodeMirror
      value={code}
      height="100vh"
      extensions={[javascript({ jsx: true }), syntaxHighlighting(highlightStyle), ...highlightExtension]}
      onChange={handleCodeChange}
      theme={theme}
      readOnly={!isCodeEditorWritable}
    />
  );
}
