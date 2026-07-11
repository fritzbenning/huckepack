import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsideUser } from "./AsideUser";

const meta: Meta<typeof AsideUser> = {
  title: "Layout/AsideUser",
  component: AsideUser,
  args: {
    name: "Alex Doe",
    role: "Product Designer",
  },
};

export default meta;
type Story = StoryObj<typeof AsideUser>;

export const Default: Story = {};

