import { CheckCircle, Lightning } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectItem } from "./SelectItem";

const meta: Meta<typeof SelectItem> = {
  title: "UI/Select/Item",
  component: SelectItem,
  args: {
    value: "option-1",
    label: "Performance",
    selected: false,
    highlighted: false,
  },
};

export default meta;
type Story = StoryObj<typeof SelectItem>;

export const Default: Story = {};

export const WithIconAndStates: Story = {
  args: {
    icon: Lightning,
    highlighted: true,
    selected: true,
    iconClassName: "text-primary-500",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    label: "Unavailable option",
  },
};
