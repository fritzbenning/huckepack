import type { Meta, StoryObj } from "@storybook/react-vite";
import { CaretDown } from "@phosphor-icons/react";
import { SelectTrigger } from "./SelectTrigger";

const meta: Meta<typeof SelectTrigger> = {
  title: "Inputs/SelectTrigger",
  component: SelectTrigger,
  args: {
    placeholder: "Select item",
    selectedLabel: "Performance",
    isOpen: false,
    dimension: "small",
    tone: "subtle",
    align: "left",
    icon: false,
  },
  argTypes: {
    dimension: { control: "radio", options: ["tiny", "small", "medium", "large"] },
    tone: { control: "radio", options: ["subtle", "emphasized", "transparent"] },
    align: { control: "radio", options: ["left", "center", "right"] },
    isOpen: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof SelectTrigger>;

export const Default: Story = {};

export const WithIcon: Story = {
  args: {
    icon: true,
    placeholder: "Pick a severity",
  },
  render: (args) => <SelectTrigger {...args} icon={!!args.icon} />,
};

export const OpenState: Story = {
  args: { isOpen: true },
};

