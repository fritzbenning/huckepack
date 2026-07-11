import type { Meta, StoryObj } from "@storybook/react-vite";
import Logo from "./Logo";

const meta: Meta<typeof Logo> = {
  title: "Layout/Logo",
  component: Logo,
  args: {
    size: "small",
    showBadge: false,
  },
  argTypes: {
    size: { control: "radio", options: ["small", "large"] },
    showBadge: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Logo>;

export const Default: Story = {};

export const WithBadge: Story = {
  args: { showBadge: true, badgeContent: "beta" },
};

