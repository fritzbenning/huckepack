import type { Meta, StoryObj } from "@storybook/react-vite";
import { DotsSpinner } from "./DotsSpinner";

const meta: Meta<typeof DotsSpinner> = {
  title: "UI/Spinner/Dots",
  component: DotsSpinner,
  args: {
    size: "md",
    color: "bg-primary-500",
  },
  argTypes: {
    size: { control: "radio", options: ["sm", "md", "lg"] },
    color: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof DotsSpinner>;

export const Default: Story = {};

export const LargeMuted: Story = {
  args: {
    size: "lg",
    color: "bg-neutral-400",
  },
};
