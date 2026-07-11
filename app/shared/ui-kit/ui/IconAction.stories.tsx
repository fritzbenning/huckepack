import type { Meta, StoryObj } from "@storybook/react-vite";
import { Eye, Gear, X } from "@phosphor-icons/react";
import { IconAction } from "./IconAction";

const meta: Meta<typeof IconAction> = {
  title: "UI/IconAction",
  component: IconAction,
  args: {
    size: "sm",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof IconAction>;

export const Close: Story = {
  args: {
    icon: X,
    title: "Close dialog",
  },
};

export const Inspect: Story = {
  args: {
    icon: Eye,
    title: "Preview component",
    size: "md",
  },
};

export const Settings: Story = {
  args: {
    icon: Gear,
    title: "Open settings",
    size: "lg",
  },
};

