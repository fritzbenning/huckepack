import type { Meta, StoryObj } from "@storybook/react-vite";
import { Jumbotron } from "./Jumbotron";
import { ShimmerText } from "./ShimmerText";

const meta: Meta<typeof Jumbotron> = {
  title: "UI/Jumbotron",
  component: Jumbotron,
  args: {
    variant: "default",
    padding: "medium",
    border: true,
  },
};

export default meta;
type Story = StoryObj<typeof Jumbotron>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-neutral-950 dark:text-neutral-100">Welcome to Huckepack</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-300">
          Spin up new components, wire data, and ship to production without leaving the canvas.
        </p>
      </div>
    ),
  },
};

export const Emphasized: Story = {
  args: {
    variant: "emphasized",
    padding: "large",
    maxWidth: "narrow",
    children: (
      <div className="space-y-2">
        <ShimmerText className="text-xs">Early access</ShimmerText>
        <h3 className="font-semibold text-base text-neutral-50">AI design assistant</h3>
        <p className="text-xs text-neutral-200">
          Draft components in seconds and align them with your design tokens automatically.
        </p>
      </div>
    ),
  },
};
