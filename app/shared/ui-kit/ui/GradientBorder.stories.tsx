import type { Meta, StoryObj } from "@storybook/react-vite";
import GradientBorder from "./GradientBorder";

const meta: Meta<typeof GradientBorder> = {
  title: "UI/GradientBorder",
  component: GradientBorder,
};

export default meta;
type Story = StoryObj<typeof GradientBorder>;

export const Default: Story = {
  args: {
    children: (
      <div className="rounded-2xl p-6 text-sm text-neutral-850 dark:text-neutral-100">
        Wrap any content to add a soft animated gradient frame.
      </div>
    ),
  },
};

export const BoldColors: Story = {
  args: {
    gradientColors: "from-emerald-400 via-cyan-400 to-blue-500",
    animationDuration: "4s",
    children: (
      <div className="rounded-2xl p-6 text-sm text-neutral-850 dark:text-neutral-100">
        Fast, saturated animation for hero elements.
      </div>
    ),
  },
};
