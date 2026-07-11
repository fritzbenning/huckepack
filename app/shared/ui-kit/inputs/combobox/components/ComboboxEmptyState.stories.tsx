import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComboboxEmptyState } from "./ComboboxEmptyState";

const meta: Meta<typeof ComboboxEmptyState> = {
  title: "Inputs/Combobox/EmptyState",
  component: ComboboxEmptyState,
  args: {
    emptyText: "No matching items",
  },
};

export default meta;
type Story = StoryObj<typeof ComboboxEmptyState>;

export const Default: Story = {};

