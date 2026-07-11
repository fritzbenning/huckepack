import type { Meta, StoryObj } from "@storybook/react-vite";
import { ArrowRight, Check, Trash } from "@phosphor-icons/react";
import Button from "./Button";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  args: {
    severity: "primary",
    variant: "solid",
    size: "small",
    children: "Save changes",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Primary: Story = {};

export const SecondaryOutline: Story = {
  args: {
    severity: "secondary",
    variant: "outline",
    children: "Invite teammate",
  },
};

export const WithIcon: Story = {
  args: {
    severity: "primary",
    variant: "solid",
    size: "large",
    icon: ArrowRight,
    children: "Continue",
  },
};

export const IconOnly: Story = {
  args: {
    severity: "secondary",
    variant: "solid",
    icon: Check,
    iconOnly: true,
    "aria-label": "Confirm selection",
  },
};

export const Destructive: Story = {
  args: {
    severity: "error",
    variant: "solid",
    icon: Trash,
    children: "Delete environment",
  },
};

