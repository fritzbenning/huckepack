import type { Meta, StoryObj } from "@storybook/react-vite";
import { Magnet } from "@phosphor-icons/react";
import { useState } from "react";
import { IconToggle } from "./IconToggle";

const meta: Meta<typeof IconToggle> = {
  title: "Editor/IconToggle",
  component: IconToggle,
  args: {
    icon: Magnet,
    size: "small",
  },
  argTypes: {
    size: { control: "radio", options: ["small", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof IconToggle>;

export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState(false);
    return <IconToggle {...args} isActive={active} onChange={() => setActive((v) => !v)} />;
  },
};

