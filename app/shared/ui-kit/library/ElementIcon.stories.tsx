import type { Meta, StoryObj } from "@storybook/react-vite";
import { ElementIcon } from "./ElementIcon";

const meta: Meta<typeof ElementIcon> = {
  title: "Library/ElementIcon",
  component: ElementIcon,
  args: {
    type: "component",
  },
  argTypes: {
    type: { control: "radio", options: ["component", "block", "section", "page", null] },
  },
};

export default meta;
type Story = StoryObj<typeof ElementIcon>;

export const Default: Story = {};

export const Section: Story = {
  args: { type: "section" },
};

