import * as RepoFileHook from "@hooks/repo/useRepositoryFile";
import * as RepoTreeHook from "@hooks/repo/useRepositoryTree";
import * as ActiveProjectStore from "@stores/activeProjectStore";
import * as ThemeStore from "@stores/themeStore";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { DesignSystemWizard } from "./DesignSystemWizard";

// Mocks
(RepoTreeHook as any).useRepositoryTree = () => ({
  tree: [
    { path: "components/button", type: "tree" },
    { path: "components/card", type: "tree" },
    { path: "styles/theme.css", type: "blob" },
  ],
  loading: false,
  error: null,
});
(RepoFileHook as any).useRepositoryFile = () => ({
  content: ":root { --primary: #6366f1; }",
  filename: "theme.css",
  loading: false,
  error: null,
});
(ActiveProjectStore as any).useActiveProjectStore = (selector?: any) =>
  selector
    ? selector({ componentFolders: ["components"], rootComponentFolder: "components", currentComponentFolder: "" })
    : { componentFolders: ["components"], rootComponentFolder: "components", currentComponentFolder: "" };
(ActiveProjectStore as any).setComponentFolders = () => {};
(ActiveProjectStore as any).setRootComponentFolder = () => {};
(ThemeStore as any).useThemeStore = (selector?: any) =>
  selector
    ? selector({ tailwindTheme: "", tailwindThemeFilename: "" })
    : { tailwindTheme: "", tailwindThemeFilename: "" };
(ThemeStore as any).setTailwindTheme = () => {};

const meta: Meta<typeof DesignSystemWizard> = {
  title: "Library/DesignSystemWizard",
  component: DesignSystemWizard,
  parameters: { layout: "fullscreen" },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="min-h-screen bg-neutral-50 p-6 dark:bg-neutral-950">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof DesignSystemWizard>;

export const Default: Story = {};
