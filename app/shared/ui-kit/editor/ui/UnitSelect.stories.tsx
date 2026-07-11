import type { Meta, StoryObj } from "@storybook/react-vite";
import { UnitSelect } from "./UnitSelect";

const meta: Meta<typeof UnitSelect> = {
  title: "Editor/UnitSelect",
  component: UnitSelect,
  args: {
    unit: "px",
  },
  argTypes: {
    onUnitChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof UnitSelect>;

export const Default: Story = {};

