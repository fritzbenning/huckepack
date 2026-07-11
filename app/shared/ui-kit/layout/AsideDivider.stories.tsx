import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsideDivider } from "./AsideDivider";

const meta: Meta<typeof AsideDivider> = {
  title: "Layout/AsideDivider",
  component: AsideDivider,
};

export default meta;
type Story = StoryObj<typeof AsideDivider>;

export const Default: Story = {};

