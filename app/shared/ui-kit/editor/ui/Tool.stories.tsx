import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cursor, Magnet, TextT } from "@phosphor-icons/react";
import { Tool } from "./Tool";

const meta: Meta<typeof Tool> = {
  title: "Editor/Tool",
  component: Tool,
  args: {
    label: "Select",
    icon: Cursor,
    isActive: true,
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Tool>;

export const Default: Story = {};

export const SecondaryTool: Story = {
  args: {
    label: "Snap",
    icon: Magnet,
    isActive: false,
  },
};

export const TextTool: Story = {
  args: {
    label: "Text",
    icon: TextT,
    isActive: false,
  },
};

