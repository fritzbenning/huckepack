import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { AnimatedSkeleton } from "./AnimatedSkeleton";
import { AnimatedSuspense } from "./AnimatedSuspense";
import { FadeIn } from "./FadeIn";

const meta: Meta<typeof AnimatedSkeleton> = {
  title: "Animations/States",
  component: AnimatedSkeleton,
};

export default meta;
type Story = StoryObj<typeof AnimatedSkeleton>;

export const LoadingPlaceholder: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 1200);
      return () => clearTimeout(timer);
    }, []);

    return (
      <AnimatedSkeleton loading={loading} skeletonItems={3} itemClassName="h-3 w-full" containerClassName="space-y-2">
        <div className="space-y-2 rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-750 dark:bg-neutral-850">
          <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Component documentation</p>
          <p className="text-xs text-neutral-600 dark:text-neutral-300">
            Include usage, props, and best practices for this UI element.
          </p>
        </div>
      </AnimatedSkeleton>
    );
  },
};

export const SuspenseFallback: Story = {
  render: () => (
    <AnimatedSuspense skeletonItems={4} itemClassName="h-3 w-full" containerClassName="space-y-2">
      <FadeIn className="space-y-3 rounded-md border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-750 dark:bg-neutral-850">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-950 dark:text-neutral-50">Async content</p>
          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-2xs text-emerald-700">Ready</span>
        </div>
        <p className="text-xs text-neutral-600 dark:text-neutral-300">
          Loaded content gracefully fades in once data resolves.
        </p>
      </FadeIn>
    </AnimatedSuspense>
  ),
};

export const FadeInStandalone: Story = {
  render: () => (
    <FadeIn className="space-y-2 rounded-lg bg-gradient-to-r from-primary-500 to-purple-500 p-6 text-white shadow-lg">
      <p className="text-sm font-semibold">Animated banner</p>
      <p className="text-xs text-white/80">Use FadeIn for quick, natural entrance transitions.</p>
    </FadeIn>
  ),
};
