import type { Meta, StoryObj } from "@storybook/react-vite";
import { RepositoryTreeItem, type RepositoryTreeNode } from "./RepositoryTreeItem";

const node: RepositoryTreeNode = {
  path: "app/components",
  name: "components",
  type: "tree",
  children: [
    { path: "app/components/Button.tsx", name: "Button.tsx", type: "blob" },
    { path: "app/components/Card.tsx", name: "Card.tsx", type: "blob" },
  ],
};

const meta: Meta<typeof RepositoryTreeItem> = {
  title: "Inputs/RepositoryTree/Item",
  component: RepositoryTreeItem,
  args: {
    node,
    depth: 0,
    isExpanded: true,
    isSelected: true,
  },
  argTypes: {
    isExpanded: { control: "boolean" },
    isSelected: { control: "boolean" },
    depth: { control: { type: "number", min: 0, max: 5, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof RepositoryTreeItem>;

export const Folder: Story = {
  args: {
    onToggleExpanded: () => {},
    onToggleSelected: () => {},
  },
};

export const File: Story = {
  args: {
    node: { path: "README.md", name: "README.md", type: "blob" },
    isExpanded: false,
    isSelected: false,
  },
};

