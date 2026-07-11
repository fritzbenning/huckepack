import type { Meta, StoryObj } from "@storybook/react-vite";
import { Scissors, TextT } from "@phosphor-icons/react";
import { InlineIconButton } from "./InlineIconButton";

const meta: Meta<typeof InlineIconButton> = {
  title: "Editor/InlineIconButton",
  component: InlineIconButton,
  args: {
    icon: Scissors,
    isActive: false,
    title: "Cut",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof InlineIconButton>;

export const Default: Story = {};

export const ActiveText: Story = {
  args: {
    icon: TextT,
    isActive: true,
    title: "Text tool",
  },
};

