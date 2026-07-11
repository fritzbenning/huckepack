import type { Meta, StoryObj } from "@storybook/react-vite";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Input } from "./Input";

const meta: Meta<typeof Input> = {
  title: "Inputs/Input",
  component: Input,
  args: {
    placeholder: "Enter a project name",
    dimension: "medium",
    tone: "subtle",
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const TextField: Story = {
  render: (args) => {
    const [value, setValue] = useState("Landing page");
    return <Input {...args} value={value} onChange={setValue} />;
  },
};

export const WithIcon: Story = {
  render: (args) => {
    const [value, setValue] = useState("Design system");
    return <Input {...args} icon={MagnifyingGlassIcon} value={value} onChange={setValue} placeholder="Search components" />;
  },
};

export const NumberWithUnit: Story = {
  render: (args) => {
    const [value, setValue] = useState<string | number>(32);
    const [unit, setUnit] = useState<"px" | "rem" | "scale">("px");
    return (
      <Input
        {...args}
        type="number"
        value={value}
        onChange={setValue}
        unit={unit}
        onUnitChange={(u) => setUnit(u as typeof unit)}
        showUnitSelector
        availableUnits={["px", "rem", "scale"]}
        placeholder="Spacing"
        width="slim"
      />
    );
  },
};

export const WithValidation: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    const hasError = value.trim().length < 3;
    return (
      <Input
        {...args}
        label="Workspace name"
        value={value}
        onChange={setValue}
        error={hasError ? "Name must be at least 3 characters" : undefined}
      />
    );
  },
};

