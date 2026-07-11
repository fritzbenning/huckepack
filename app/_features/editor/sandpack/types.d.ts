export type SandpackTemplate = "react-ts" | "vue-ts" | "static";
export type SandpackFramework = "react" | "vue" | "vanilla";

export interface SandpackProviderState {
  instanceId: string;
  template: SandpackTemplate;
  framework: SandpackFramework;
  packageJson: string;
  tsconfig: string;
  prettierc: string;
  externalResources: string[];
  referenceFiles: string[];
  augmentedFiles: string[];
  statefulFiles: string[];
  previewRef: RefObject<SandpackPreviewRef> | null;
}
