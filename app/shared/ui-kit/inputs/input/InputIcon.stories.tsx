import type { Meta, StoryObj } from "@storybook/react-vite";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { InputIcon } from "./InputIcon";

const meta: Meta<typeof InputIcon> = {
  title: "Inputs/InputIcon",
  component: InputIcon,
  args: {
    icon: MagnifyingGlassIcon,
    dimension: "small",
  },
  argTypes: {
    dimension: { control: "radio", options: ["tiny", "small", "medium", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof InputIcon>;

export const Default: Story = {};

