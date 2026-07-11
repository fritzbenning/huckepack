import type { Meta, StoryObj } from "@storybook/react-vite";
import * as InstanceStore from "@stores/instanceStoreManager";
import { TreeNode } from "./TreeNode";

(InstanceStore as any).getInstanceMetaStore = () => ({
  getState: () => ({ hiddenNodes: new Set(), lockedNodes: new Set() }),
});

const sampleNode = {
  path: "root/button",
  name: "Button",
  children: [],
  props: { className: "btn-primary" },
};

const meta: Meta<typeof TreeNode> = {
  title: "Editor/Tree/TreeNode",
  component: TreeNode,
  args: {
    node: sampleNode as any,
    depth: 1,
    selectedNode: "root/button",
    expandedNodes: new Set(),
    sortableId: undefined,
  },
  argTypes: {
    onNodeClick: { action: "click" },
    onToggleExpanded: { action: "expand" },
  },
};

export default meta;
type Story = StoryObj<typeof TreeNode>;

export const Default: Story = {};

export const HiddenLocked: Story = {
  args: {
    node: { ...sampleNode, path: "root/hidden" } as any,
  },
};

