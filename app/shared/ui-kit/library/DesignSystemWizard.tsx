import { useRepositoryFile } from "@hooks/repo/useRepositoryFile";
import { useRepositoryTree } from "@hooks/repo/useRepositoryTree";
import { ArrowLeft, GithubLogo, Swatches, Trash, Upload } from "@phosphor-icons/react";
import { setComponentFolders, setRootComponentFolder, useActiveProjectStore } from "@stores/activeProjectStore";
import { setTailwindTheme, useThemeStore } from "@stores/themeStore";
import { AnimatePresence } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { FadeIn } from "../animations/FadeIn";
import { SectionTitle } from "../editor/SectionTitle";
import { CSSFileTree } from "../inputs/repository-tree/CSSFileTree";
import { RepositoryTree } from "../inputs/repository-tree/RepositoryTree";
import { Upload } from "../inputs/upload/Upload";
import { Heading } from "../typo";
import Button from "../ui/Button";
import { Jumbotron } from "../ui/Jumbotron";
import { Spinner } from "../ui/Spinner";
import Tabs, { type TabItem } from "../ui/Tabs";

export function DesignSystemWizard() {
  const { componentFolders } = useActiveProjectStore();
  const { tailwindTheme, tailwindThemeFilename } = useThemeStore();
  const { tree: repositoryTree, loading: treeLoading, error: treeError } = useRepositoryTree();

  const [step, setStep] = useState<1 | 2>(1);
  const [localSelectedFolders, setLocalSelectedFolders] = useState<string[]>(componentFolders);
  const [selectedCSSFile, setSelectedCSSFile] = useState<string>("");
  const [activeThemeTab, setActiveThemeTab] = useState<"repository" | "upload">("repository");
  const [isCreatingDesignSystem, setIsCreatingDesignSystem] = useState(false);

  const themeTabItems: TabItem[] = [
    { id: "repository", label: "From repository", icon: GithubLogo },
    { id: "upload", label: "Upload file", icon: Upload },
  ];

  const {
    content: cssFileContent,
    filename: cssFilename,
    loading: cssFileLoading,
    error: cssFileError,
  } = useRepositoryFile(selectedCSSFile);

  const handleContinueToThemeSelection = () => {
    setStep(2);
  };

  const handleBackToFolderSelection = () => {
    setStep(1);
  };

  const handleCSSFileSelect = (filePath: string) => {
    setSelectedCSSFile(filePath);
  };

  const handleUploadTheme = (content: string, filename: string) => {
    setTailwindTheme(content, filename);
    toast.success("Tailwind theme uploaded successfully");
  };

  const handleRemoveTheme = () => {
    setTailwindTheme("", "");
    setSelectedCSSFile("");
    toast.success("Tailwind theme removed");
  };

  const handleCreateDesignSystem = async () => {
    setIsCreatingDesignSystem(true);

    try {
      setComponentFolders(localSelectedFolders);

      if (selectedCSSFile && cssFileContent && cssFilename && !tailwindTheme) {
        setTailwindTheme(cssFileContent, cssFilename);
      }
    } catch (error) {
      toast.error("Failed to create design system");
      console.error("Error creating design system:", error);
    } finally {
      setIsCreatingDesignSystem(false);
    }
  };

  if (componentFolders.length === 0) {
    return (
      <div className="mx-auto flex w-full max-w-2xl flex-col items-center gap-8 p-8 text-center text-neutral-500">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <FadeIn key="step1" duration={0.25} className="flex w-full flex-col items-center gap-8">
              <div className="space-y-2">
                <div className="flex flex-col items-center">
                  <SectionTitle variant="highlight">Step 1</SectionTitle>
                  <Heading className="mb-3">Let's create your UI Design System</Heading>
                </div>
                <p className="max-w-lg">
                  Please first select the folders from the repository that contain your design components. You can
                  change this later at any time.
                </p>
              </div>
              <Jumbotron className="w-full">
                {treeLoading ? (
                  <div className="p-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                    <Spinner />
                  </div>
                ) : treeError ? (
                  <div className="p-4 text-center text-red-500 text-xs">Error loading repository: {treeError}</div>
                ) : (
                  <RepositoryTree
                    items={repositoryTree}
                    selectedFolders={localSelectedFolders}
                    onSelectedFoldersChange={setLocalSelectedFolders}
                    onRootFolderChange={setRootComponentFolder}
                  />
                )}
              </Jumbotron>
              <Button
                size="large"
                onClick={handleContinueToThemeSelection}
                disabled={localSelectedFolders.length === 0}
              >
                Continue
              </Button>
            </FadeIn>
          )}

          {step === 2 && (
            <FadeIn key="step2" duration={0.25} className="flex w-full flex-col items-center gap-8">
              <div className="space-y-2">
                <div className="flex flex-col items-center">
                  <SectionTitle variant="highlight">Step 2</SectionTitle>
                  <Heading className="mb-3">Select your Tailwind Theme</Heading>
                </div>
                <p className="max-w-lg">
                  Choose a Tailwind CSS theme file from your repository or upload a custom theme file. This is optional
                  and can be configured later.
                </p>
              </div>

              {tailwindThemeFilename && (
                <>
                  <div className="flex items-center gap-2 text-sm text-neutral-750 dark:text-white">
                    <Swatches className="size-4" weight="duotone" />
                    Current theme: {tailwindThemeFilename}
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Button size="small" variant="outline" security="secondary" onClick={handleRemoveTheme}>
                      <Trash className="size-3" weight="duotone" />
                      Remove Theme
                    </Button>
                  </div>
                </>
              )}

              <div className="w-full space-y-5">
                <div className="flex justify-center">
                  <Tabs
                    items={themeTabItems}
                    activeTab={activeThemeTab}
                    onTabChange={(tabId) => setActiveThemeTab(tabId as "repository" | "upload")}
                  />
                </div>

                <AnimatePresence mode="wait">
                  {activeThemeTab === "repository" && (
                    <>
                      <Jumbotron className="w-full">
                        {treeLoading ? (
                          <div className="p-4 text-center text-xs text-neutral-500 dark:text-neutral-400">
                            <Spinner />
                          </div>
                        ) : treeError ? (
                          <div className="p-4 text-center text-red-500 text-xs">
                            Error loading repository: {treeError}
                          </div>
                        ) : (
                          <CSSFileTree
                            items={repositoryTree}
                            selectedFile={selectedCSSFile}
                            onFileSelect={handleCSSFileSelect}
                          />
                        )}
                      </Jumbotron>

                      {cssFileError && selectedCSSFile && (
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-red-500 text-xs">{cssFileError}</span>
                        </div>
                      )}
                    </>
                  )}

                  {activeThemeTab === "upload" && (
                    <Upload
                      onFileSelect={handleUploadTheme}
                      onFileRemove={handleRemoveTheme}
                      currentFile={tailwindThemeFilename}
                      placeholder="Upload Tailwind v4 CSS theme file"
                      acceptedTypes={[".css"]}
                    />
                  )}
                </AnimatePresence>
              </div>

              <div className="flex gap-3">
                <Button size="large" variant="outline" security="secondary" onClick={handleBackToFolderSelection}>
                  <ArrowLeft className="size-4" weight="duotone" />
                  Back
                </Button>
                <Button
                  size="large"
                  onClick={handleCreateDesignSystem}
                  disabled={isCreatingDesignSystem || (!!selectedCSSFile && cssFileLoading)}
                >
                  {isCreatingDesignSystem || (!!selectedCSSFile && cssFileLoading)
                    ? "Loading..."
                    : "Create design system"}
                </Button>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>
      </div>
    );
  }
}
