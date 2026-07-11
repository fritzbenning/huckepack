import type { Meta, StoryObj } from "@storybook/react-vite";
import { DynamicGradientCard } from "./DynamicGradientCard";

const meta: Meta<typeof DynamicGradientCard> = {
  title: "UI/DynamicGradientCard",
  component: DynamicGradientCard,
};

export default meta;
type Story = StoryObj<typeof DynamicGradientCard>;

export const Interactive: Story = {
  args: {
    children: (
      <div className="rounded-2xl border border-primary-100 bg-primary-50 p-6 shadow-sm dark:border-primary-900/60 dark:bg-primary-950/40">
        <p className="text-xs uppercase tracking-wide text-primary-500">Premium</p>
        <h3 className="mt-2 text-lg font-semibold text-neutral-950 dark:text-white">AI-assisted brief</h3>
        <p className="mt-1 text-sm text-neutral-750 dark:text-neutral-200">
          Hover to see the spotlight follow your cursor.
        </p>
      </div>
    ),
  },
};
