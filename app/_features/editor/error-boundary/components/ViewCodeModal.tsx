import { useApplicationThemeStore } from "@application/theme/stores/applicationThemeStore";
import { javascript } from "@codemirror/lang-javascript";
import { syntaxHighlighting } from "@codemirror/language";
import type { Id } from "@convex/_generated/dataModel";
import { darkTheme } from "@editor/code-editor/themes/dark";
import { darkHighlightStyle } from "@editor/code-editor/themes/darkHighlight";
import { lightTheme } from "@editor/code-editor/themes/light";
import { lightHighlightStyle } from "@editor/code-editor/themes/lightHighlight";
import { useParamIds } from "@hooks/useParamIds";
import { Check, Copy } from "@phosphor-icons/react";
import { useStoreFile } from "@project/file-manager";
import { useAppSource } from "@sandpack/router";
import { Modal } from "@shared/ui-kit/ui/Modal";
import { ModalFooter } from "@shared/ui-kit/ui/ModalFooter";
import Tabs, { type TabItem } from "@shared/ui-kit/ui/Tabs";
import CodeMirror from "@uiw/react-codemirror";
import { useMemo, useState } from "react";

interface ViewCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ViewCodeModal({ isOpen, onClose }: ViewCodeModalProps) {
  const themeMode = useApplicationThemeStore((state) => state.themeMode);
  const [activeTab, setActiveTab] = useState<"component" | "app">("component");
  const [isCopied, setIsCopied] = useState(false);
  const { projectId, fileId } = useParamIds();

  // Get current file data from route params
  const { file: currentFile } = useStoreFile(fileId, projectId ?? ("" as Id<"projects">));
  const { appSource } = useAppSource(projectId ?? null);

  const componentCode = currentFile?.code?.reference ?? "";
  const appCode = appSource ?? "";
  const fileName = currentFile?.slug ?? "Component";

  const theme = useMemo(() => (themeMode === "dark" ? darkTheme : lightTheme), [themeMode]);
  const highlightStyle = useMemo(() => (themeMode === "dark" ? darkHighlightStyle : lightHighlightStyle), [themeMode]);

  const tabItems: TabItem[] = useMemo(
    () => [
      {
        id: "component",
        label: `${fileName}.tsx`,
      },
      {
        id: "app",
        label: "App.tsx",
      },
    ],
    [fileName]
  );

  const currentCode = activeTab === "component" ? componentCode : appCode;

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="View Code" size="xl" contentPadding={false}>
      <div className="flex items-center justify-center border-neutral-100 border-b px-5 py-3 dark:border-neutral-750">
        <Tabs
          items={tabItems}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as "component" | "app")}
        />
      </div>
      <div className="border-neutral-100 border-b dark:border-neutral-750">
        <CodeMirror
          value={currentCode}
          height="500px"
          extensions={[javascript({ jsx: true }), syntaxHighlighting(highlightStyle)]}
          theme={theme}
          editable={false}
          aria-label={`Code viewer for ${activeTab === "component" ? "component" : "App.tsx"}`}
        />
      </div>
      <ModalFooter
        primaryAction={{
          action: handleCopyCode,
          label: isCopied ? "Copied" : "Copy code",
          icon: isCopied ? Check : Copy,
        }}
        secondaryAction={{
          action: onClose,
          label: "Close",
        }}
      />
    </Modal>
  );
}
