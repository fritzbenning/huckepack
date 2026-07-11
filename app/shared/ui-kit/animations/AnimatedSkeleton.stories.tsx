import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedSkeleton } from "./AnimatedSkeleton";

const meta: Meta<typeof AnimatedSkeleton> = {
  title: "Animations/AnimatedSkeleton",
  component: AnimatedSkeleton,
  args: {
    loading: true,
    skeletonItems: 3,
    itemClassName: "h-3 w-full",
    containerClassName: "space-y-2",
  },
  argTypes: {
    loading: { control: "boolean" },
    skeletonItems: { control: { type: "number", min: 1, max: 8, step: 1 } },
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedSkeleton>;

export const ListPlaceholder: Story = {
  args: {
    contentClassName:
      "space-y-2 rounded-lg border border-neutral-200 bg-white p-4 dark:border-neutral-850 dark:bg-neutral-950",
    children: (
      <div className="space-y-2 text-sm text-neutral-750 dark:text-neutral-200">
        <div className="font-semibold">Loaded content</div>
        <p>Once loading is false, content fades in with a smooth transition.</p>
      </div>
    ),
  },
};

export const SingleLine: Story = {
  args: {
    skeletonItems: 1,
    itemClassName: "h-4 w-48",
  },
};
