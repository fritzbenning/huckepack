import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboboxOverflowMessage } from "./ComboboxOverflowMessage";

const meta: Meta<typeof ComboboxOverflowMessage> = {
  title: "Inputs/Combobox/OverflowMessage",
  component: ComboboxOverflowMessage,
  args: {
    displayedCount: 1500,
    totalCount: 3200,
  },
};

export default meta;
type Story = StoryObj<typeof ComboboxOverflowMessage>;

export const Default: Story = {};

