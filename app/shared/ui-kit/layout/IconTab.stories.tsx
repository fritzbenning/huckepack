import type { Meta, StoryObj } from "@storybook/react-vite";
import { GearSix } from "@phosphor-icons/react";
import IconTab from "./IconTab";

const meta: Meta<typeof IconTab> = {
  title: "Layout/IconTab",
  component: IconTab,
  args: {
    to: "#",
    icon: GearSix,
    isActive: false,
    iconSize: "size-4",
  },
  argTypes: {
    isActive: { control: "boolean" },
    iconSize: { control: "text" },
  },
};

export default meta;
type Story = StoryObj<typeof IconTab>;

export const Default: Story = {};

