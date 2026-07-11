import type { Meta, StoryObj } from "@storybook/react-vite";
import Card from "./Card";

const meta: Meta<typeof Card> = {
  title: "Cards/Card",
  component: Card,
  args: {
    variant: "solid",
    children: (
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-neutral-950 dark:text-neutral-50">Design tokens</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-300">
          Manage your theme colors, typography, and spacing.
        </p>
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Solid: Story = {};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Draft: Story = {
  args: {
    variant: "draft",
    children: (
      <div className="space-y-1">
        <h3 className="font-semibold text-sm text-neutral-950 dark:text-neutral-50">Draft component</h3>
        <p className="text-xs text-neutral-600 dark:text-neutral-400">Drop-in placeholder ready to be filled.</p>
      </div>
    ),
  },
};
