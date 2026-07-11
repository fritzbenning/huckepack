import { FileText, House } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import Tab from "./Tab";

const meta: Meta<typeof Tab> = {
  title: "Layout/Tab",
  component: Tab,
  args: {
    variant: "file",
    isActive: false,
  },
  argTypes: {
    variant: { control: "radio", options: ["icon", "file"] },
    isActive: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tab>;

export const FileTab: Story = {
  render: (args) => (
    <Tab {...args}>
      <div className="flex items-center gap-1 text-xs text-neutral-750 dark:text-neutral-200">
        <FileText className="size-3.5 text-neutral-500 dark:text-neutral-400" weight="duotone" />
        <span>DesignSystem.tsx</span>
      </div>
      <span className="text-2xs text-neutral-400">modified</span>
    </Tab>
  ),
};

export const IconTab: Story = {
  args: {
    variant: "icon",
    isActive: true,
  },
  render: (args) => (
    <Tab {...args}>
      <House className="size-4 text-primary-500 dark:text-primary-300" weight="duotone" />
    </Tab>
  ),
};
