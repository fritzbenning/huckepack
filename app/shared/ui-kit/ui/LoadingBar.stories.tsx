import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { LoadingBar } from "./LoadingBar";

const meta: Meta<typeof LoadingBar> = {
  title: "UI/LoadingBar",
  component: LoadingBar,
  args: {
    loading: true,
  },
  argTypes: {
    loading: { control: "boolean" },
    className: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof LoadingBar>;

export const Controls: Story = {
  render: ({ loading = true, className }: NonNullable<Story["args"]>) => (
    <div className="relative h-20 w-full border border-neutral-300 border-dashed p-4 dark:border-neutral-750">
      <LoadingBar loading={loading} className={className} />
      <p className="text-sm text-neutral-600 dark:text-neutral-300">
        Loading state: {loading ? "in progress" : "complete"}
      </p>
    </div>
  ),
};

export const Simulated: Story = {
  render: () => {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => setLoading(false), 2500);
      return () => clearTimeout(timer);
    }, []);

    return (
      <div className="relative h-20 w-full border border-neutral-300 border-dashed p-4 dark:border-neutral-750">
        <LoadingBar loading={loading} />
        <p className="text-sm text-neutral-600 dark:text-neutral-300">
          Loading state: {loading ? "in progress" : "complete"}
        </p>
      </div>
    );
  },
};
