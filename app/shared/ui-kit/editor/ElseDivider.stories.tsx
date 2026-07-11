import type { Meta, StoryObj } from "@storybook/react-vite";
import { ElseDivider } from "./ElseDivider";

const meta: Meta<typeof ElseDivider> = {
  title: "Editor/ElseDivider",
  component: ElseDivider,
};

export default meta;
type Story = StoryObj<typeof ElseDivider>;

export const Default: Story = {};

