import type { Meta, StoryObj } from "@storybook/react-vite";
import { DesignValueInput } from "./DesignValueInput";

const meta: Meta<typeof DesignValueInput> = {
  title: "Editor/DesignValueInput",
  component: DesignValueInput,
  args: {
    label: "Border radius",
    value: "8px",
  },
  argTypes: {
    onChange: { action: "changed" },
  },
};

export default meta;
type Story = StoryObj<typeof DesignValueInput>;

export const Default: Story = {};

