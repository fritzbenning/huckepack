import type { Meta, StoryObj } from "@storybook/react-vite";
import Orb from "./Orb";

const meta: Meta<typeof Orb> = {
  title: "UI/Spinner/Orb",
  component: Orb,
  args: {
    size: "md",
  },
  argTypes: {
    size: { control: "radio", options: ["xs", "sm", "md", "lg"] },
  },
};

export default meta;
type Story = StoryObj<typeof Orb>;

export const Default: Story = {};

export const Large: Story = {
  args: { size: "lg" },
};

