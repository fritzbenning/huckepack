import type { Meta, StoryObj } from "@storybook/react-vite";
import { ShimmerText } from "./ShimmerText";

const meta: Meta<typeof ShimmerText> = {
  title: "UI/ShimmerText",
  component: ShimmerText,
  args: {
    children: "Deploying preview…",
  },
};

export default meta;
type Story = StoryObj<typeof ShimmerText>;

export const Default: Story = {};

export const InlineWithCopy: Story = {
  args: {
    children: "Syncing tokens across teams",
    className: "text-sm",
  },
};

