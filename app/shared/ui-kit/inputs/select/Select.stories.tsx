import type { Meta, StoryObj } from "@storybook/react-vite";
import { SquaresFour } from "@phosphor-icons/react";
import { useState } from "react";
import { Select } from "./Select";

const options = [
  { label: "Design", value: "design" },
  { label: "Frontend", value: "frontend" },
  { label: "Backend", value: "backend" },
  { label: "Product", value: "product" },
];

const meta: Meta<typeof Select> = {
  title: "Inputs/Select",
  component: Select,
  args: {
    options,
    placeholder: "Choose a team",
    dimension: "medium",
    tone: "subtle",
  },
};

export default meta;
type Story = StoryObj<typeof Select>;

export const Default: Story = {
  render: (args) => {
    const [value, setValue] = useState("design");
    return <Select {...args} value={value} onChange={setValue} />;
  },
};

export const WithIcon: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Select {...args} icon={SquaresFour} value={value} onChange={setValue} placeholder="Pick a category" />;
  },
};

export const RightAlignedMenu: Story = {
  render: (args) => {
    const [value, setValue] = useState("frontend");
    return <Select {...args} value={value} onChange={setValue} align="right" x="left" />;
  },
};

