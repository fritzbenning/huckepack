import type { Meta, StoryObj } from "@storybook/react-vite";
import { SwitchRoot } from "./SwitchRoot";
import { Switch } from "./Switch";

const meta: Meta<typeof SwitchRoot> = {
  title: "Inputs/SwitchRoot",
  component: SwitchRoot,
};

export default meta;
type Story = StoryObj<typeof SwitchRoot>;

export const Stack: Story = {
  render: () => (
    <SwitchRoot className="flex flex-col gap-3">
      <Switch label="Notifications" checked onCheckedChange={() => {}} />
      <Switch label="Auto-save" onCheckedChange={() => {}} />
    </SwitchRoot>
  ),
};

