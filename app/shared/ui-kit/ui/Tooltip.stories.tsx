import type { Meta, StoryObj } from "@storybook/react-vite";
import Button from "./Button";
import { Tooltip } from "./Tooltip";

const meta: Meta<typeof Tooltip> = {
  title: "UI/Tooltip",
  component: Tooltip,
  args: {
    content: "Quick action",
    position: "top",
    align: "center",
    trigger: "hover",
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

export const Hover: Story = {
  render: (args) => (
    <div className="flex items-center justify-center p-12">
      <Tooltip {...args}>
        <Button variant="outline">Hover me</Button>
      </Tooltip>
    </div>
  ),
};

export const ClickToToggle: Story = {
  render: (args) => (
    <div className="flex items-center justify-center p-12">
      <Tooltip
        {...args}
        trigger="click"
        content={
          <div className="space-y-1">
            <p className="font-semibold text-xs">Pro tip</p>
            <p className="text-2xs text-neutral-200">Press ⌘/Ctrl+P to jump anywhere.</p>
          </div>
        }
      >
        <Button severity="secondary">Click me</Button>
      </Tooltip>
    </div>
  ),
};
