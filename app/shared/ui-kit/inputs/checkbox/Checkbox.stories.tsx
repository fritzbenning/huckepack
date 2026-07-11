import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof Checkbox> = {
  title: "Inputs/Checkbox",
  component: Checkbox,
  args: {
    label: "Remember my choice",
    size: "small",
  },
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Basic: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
  },
};

export const LargeWithDescription: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return (
      <div className="space-y-1">
        <Checkbox {...args} size="large" label="Include beta features" checked={checked} onChange={setChecked} />
        <p className="text-xs text-neutral-500">Adds experimental UI to your workspace.</p>
      </div>
    );
  },
};
