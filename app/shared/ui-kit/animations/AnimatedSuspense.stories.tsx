import type { Meta, StoryObj } from "@storybook/react-vite";
import { AnimatedSuspense } from "./AnimatedSuspense";

const meta: Meta<typeof AnimatedSuspense> = {
  title: "Animations/AnimatedSuspense",
  component: AnimatedSuspense,
  args: {
    skeletonItems: 4,
    itemClassName: "h-3 w-full",
    containerClassName: "space-y-2",
  },
};

export default meta;
type Story = StoryObj<typeof AnimatedSuspense>;

export const WithFallback: Story = {
  render: (args) => (
    <AnimatedSuspense {...args}>
      <div className="space-y-2 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-850 dark:bg-neutral-950">
        <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-100">Async content resolved</p>
        <p className="text-xs text-neutral-600 dark:text-neutral-300">Replace with your Suspense-wrapped feature.</p>
      </div>
    </AnimatedSuspense>
  ),
};
