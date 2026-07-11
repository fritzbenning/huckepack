import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TreeNode as TreeNodeType } from "@lib/parser/react/convertToTreeNode";
import { TreeItem } from "./TreeItem";

const node: TreeNodeType = {
  path: "root/div",
  name: "div",
  children: [],
};

const meta: Meta<typeof TreeItem> = {
  title: "Editor/Tree/TreeItem",
  component: TreeItem,
  args: {
    index: 0,
    style: {},
    data: {
      items: [{ node, depth: 1, index: 0 }],
      selectedNode: "root/div",
      expandedNodes: new Set<string>(),
      onNodeClick: () => {},
      onToggleExpanded: () => {},
    },
  },
};

export default meta;
type Story = StoryObj<typeof TreeItem>;

export const Default: Story = {};

