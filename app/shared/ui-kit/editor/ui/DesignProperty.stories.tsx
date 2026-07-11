import type { Meta, StoryObj } from "@storybook/react-vite";
import { DesignProperty } from "./DesignProperty";

const meta: Meta<typeof DesignProperty> = {
  title: "Editor/DesignProperty",
  component: DesignProperty,
  args: {
    title: "Spacing",
    children: <div className="h-16 rounded-md bg-neutral-100 dark:bg-neutral-850" />,
  },
  argTypes: {
    onDelete: { action: "delete" },
  },
};

export default meta;
type Story = StoryObj<typeof DesignProperty>;

export const Default: Story = {};
