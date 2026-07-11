import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderItem, type TreeNode } from "./FolderItem";

const tree: TreeNode = {
  name: "components",
  path: "components",
  isExpanded: true,
  children: [
    { name: "buttons", path: "components/buttons", children: [], isExpanded: false },
    { name: "cards", path: "components/cards", children: [], isExpanded: false },
  ],
};

const meta: Meta<typeof FolderItem> = {
  title: "Library/FolderItem",
  component: FolderItem,
  args: {
    node: tree,
    selectedFolder: "",
  },
};

export default meta;
type Story = StoryObj<typeof FolderItem>;

export const Default: Story = {
  args: {
    onToggle: () => {},
  },
};

export const Selected: Story = {
  args: {
    selectedFolder: "components",
    onToggle: () => {},
  },
};

