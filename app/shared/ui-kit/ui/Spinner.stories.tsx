import type { Meta, StoryObj } from "@storybook/react-vite";
import { Spinner } from "./Spinner";
import { DotsSpinner } from "./spinners/DotsSpinner";
import Orb from "./spinners/Orb";

const meta: Meta<typeof Spinner> = {
  title: "UI/Spinner",
  component: Spinner,
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
  args: {
    size: "md",
  },
};

export const Compact: Story = {
  args: {
    size: "sm",
  },
};

export const Dots: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <DotsSpinner />
      <span className="text-sm text-neutral-600 dark:text-neutral-300">Syncing changes…</span>
    </div>
  ),
};

export const Orbital: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Orb />
      <span className="text-sm text-neutral-600 dark:text-neutral-300">Generating preview</span>
    </div>
  ),
};
