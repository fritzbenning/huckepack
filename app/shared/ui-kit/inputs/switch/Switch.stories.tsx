import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Switch } from "./Switch";

const meta: Meta<typeof Switch> = {
  title: "Inputs/Switch",
  component: Switch,
  args: {
    label: "Enable notifications",
    size: "small",
  },
};

export default meta;
type Story = StoryObj<typeof Switch>;

export const Controlled: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(true);
    return <Switch {...args} checked={checked} onCheckedChange={setChecked} />;
  },
};

export const LargeWithLabel: Story = {
  render: (args) => {
    const [checked, setChecked] = useState(false);
    return <Switch {...args} size="large" label="Dark mode" checked={checked} onCheckedChange={setChecked} />;
  },
};

