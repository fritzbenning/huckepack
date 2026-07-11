import { useApplicationThemeStore } from "@application/theme/stores/applicationThemeStore";
import { javascript } from "@codemirror/lang-javascript";
import { syntaxHighlighting } from "@codemirror/language";
import { darkTheme } from "@editor/code-editor/themes/dark";
import { darkHighlightStyle } from "@editor/code-editor/themes/darkHighlight";
import { lightTheme } from "@editor/code-editor/themes/light";
import { lightHighlightStyle } from "@editor/code-editor/themes/lightHighlight";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";
import { Input } from "@shared/ui-kit/inputs/input/Input";
import { InlineNotification } from "@shared/ui-kit/ui/InlineNotification";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalContent } from "@shared/ui-kit/ui/ModalContent";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo } from "react";
import { useImporter } from "../hooks/useImporter";

interface ImportProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

export function Import({ projectId, isOpen, onClose }: ImportProps) {
  const themeMode = useApplicationThemeStore((state) => state.themeMode);

  const theme = useMemo(() => (themeMode === "dark" ? darkTheme : lightTheme), [themeMode]);
  const highlightStyle = useMemo(() => (themeMode === "dark" ? darkHighlightStyle : lightHighlightStyle), [themeMode]);

  const {
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
  } = useImporter({
    projectId,
    onSuccess: () => {
      onClose();
    },
  });

  const closeModal = () => {
    onClose();
    resetForm();
  };

  return (
    <Modal isOpen={isOpen} onClose={closeModal} contentPadding={false} title="Import react component" size="xl">
      <div className="border-neutral-100 border-b dark:border-neutral-750">
        <CodeMirror
          value={code}
          height="400px"
          extensions={[javascript({ jsx: true }), syntaxHighlighting(highlightStyle)]}
          onChange={setCode}
          theme={theme}
          placeholder="Paste your react component code here..."
          aria-label="Code editor"
        />
      </div>
      <ModalContent padding="lg">
        <Input
          id="fileName"
          type="text"
          value={fileName}
          onChange={setFileName}
          placeholder="Enter file name (e.g., Button)"
          className="w-full"
          instant
          tone="emphasized"
          dimension="large"
          label="File Name"
          error={fileNameError || undefined}
        />
      </ModalContent>

      <ModalFooter
        primaryAction={{
          action: handleImport,
          label: loading ? "Importing..." : "Import as File",
          disabled: !isValid || loading || isClassifying,
        }}
        secondaryAction={{
          action: closeModal,
          label: "Cancel",
          variant: "outline",
        }}
      >
        <div className="space-between flex flex-1 items-center gap-2">
          {codeType && !isClassifying && (
            <>
              {codeType === "react" && (
                <InlineNotification icon={CheckCircleIcon} severity="success">
                  Valid react component
                </InlineNotification>
              )}
              {codeType === "html" && (
                <InlineNotification icon={CheckCircleIcon} severity="success">
                  Valid HTML
                </InlineNotification>
              )}
              {codeType === "unsupported" && (
                <InlineNotification icon={XCircleIcon} severity="error">
                  Oops! We don't support this type of code just yet.
                </InlineNotification>
              )}
            </>
          )}
        </div>
      </ModalFooter>
    </Modal>
  );
}
