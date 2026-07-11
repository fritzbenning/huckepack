import { Plus } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { InlineAction } from "./InlineAction";

const meta: Meta<typeof InlineAction> = {
  title: "UI/InlineAction",
  component: InlineAction,
  args: {
    label: "Add field",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof InlineAction>;

export const Subtle: Story = {};

export const CustomIcon: Story = {
  args: {
    icon: <Plus className="size-3" weight="bold" />,
    label: "Invite teammate",
    wrapperClassName: "flex items-center gap-2 p-2 rounded bg-neutral-50 dark:bg-neutral-850",
  },
};
