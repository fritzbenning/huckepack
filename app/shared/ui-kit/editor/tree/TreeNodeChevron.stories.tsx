import type { Meta, StoryObj } from "@storybook/react-vite";
import { TreeNodeChevron } from "./TreeNodeChevron";

const meta: Meta<typeof TreeNodeChevron> = {
  title: "Editor/Tree/TreeNodeChevron",
  component: TreeNodeChevron,
  args: {
    isExpanded: false,
    isSelected: false,
  },
  argTypes: {
    onToggleExpanded: { action: "toggle" },
  },
};

export default meta;
type Story = StoryObj<typeof TreeNodeChevron>;

export const Default: Story = {};

export const ExpandedSelected: Story = {
  args: {
    isExpanded: true,
    isSelected: true,
  },
};

