import type { Meta, StoryObj } from "@storybook/react-vite";
import { Lightning } from "@phosphor-icons/react";
import { ActionButton } from "./ActionButton";

const meta: Meta<typeof ActionButton> = {
  title: "UI/ActionButton",
  component: ActionButton,
  args: {
    children: "Run action",
    icon: Lightning,
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof ActionButton>;

export const Default: Story = {};

export const WithCustomSize: Story = {
  args: {
    children: "Deploy",
    iconSize: 18,
  },
};

