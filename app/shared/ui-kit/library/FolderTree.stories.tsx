import type { Meta, StoryObj } from "@storybook/react-vite";
import * as ActiveProjectStore from "@stores/activeProjectStore";
import { FolderTree } from "./FolderTree";

// Mock store for Storybook
(ActiveProjectStore as any).useActiveProjectStore = (selector?: any) =>
  selector
    ? selector({
        componentFolders: ["components/ui", "components/layout", "components/forms"],
        rootComponentFolder: "components",
        currentComponentFolder: "",
      })
    : {
        componentFolders: ["components/ui", "components/layout", "components/forms"],
        rootComponentFolder: "components",
        currentComponentFolder: "",
      };
(ActiveProjectStore as any).setCurrentComponentFolder = () => {};

const meta: Meta<typeof FolderTree> = {
  title: "Library/FolderTree",
  component: FolderTree,
};

export default meta;
type Story = StoryObj<typeof FolderTree>;

export const Default: Story = {};

