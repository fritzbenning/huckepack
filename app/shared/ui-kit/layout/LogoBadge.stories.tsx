import type { Meta, StoryObj } from "@storybook/react-vite";
import { LogoBadge } from "./LogoBadge";

const meta: Meta<typeof LogoBadge> = {
  title: "Layout/LogoBadge",
  component: LogoBadge,
  args: {
    size: "small",
    content: "alpha v1.0.0",
  },
  argTypes: {
    size: { control: "radio", options: ["small", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof LogoBadge>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: "large", content: "beta" },
};

