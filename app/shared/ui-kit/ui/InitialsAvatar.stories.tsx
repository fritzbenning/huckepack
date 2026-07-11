import type { Meta, StoryObj } from "@storybook/react-vite";
import InitialsAvatar from "./InitialsAvatar";

const meta: Meta<typeof InitialsAvatar> = {
  title: "UI/InitialsAvatar",
  component: InitialsAvatar,
  args: {
    name: "Alex Doe",
    size: "md",
  },
};

export default meta;
type Story = StoryObj<typeof InitialsAvatar>;

export const Default: Story = {};

export const Large: Story = {
  args: {
    size: "xl",
    name: "Pat Lee",
  },
};

