import type { Meta, StoryObj } from "@storybook/react-vite";
import { Badge } from "./Badge";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  args: {
    children: "New",
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: "secondary", children: "Beta" },
};

export const Destructive: Story = {
  args: { variant: "destructive", children: "Breaking" },
};

export const Outline: Story = {
  args: { variant: "outline", children: "Draft" },
};

export const Subtle: Story = {
  args: { variant: "subtle", children: "Muted" },
};

