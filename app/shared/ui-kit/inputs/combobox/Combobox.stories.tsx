import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Combobox } from "./Combobox";
import type { ComboboxOption } from "./useCombobox";

const cityOptions: ComboboxOption[] = [
  { value: "berlin", label: "Berlin" },
  { value: "london", label: "London" },
  { value: "paris", label: "Paris" },
  { value: "san-francisco", label: "San Francisco" },
  { value: "new-york", label: "New York" },
  { value: "tokyo", label: "Tokyo" },
];

const meta: Meta<typeof Combobox> = {
  title: "Inputs/Combobox",
  component: Combobox,
  args: {
    options: cityOptions,
    placeholder: "Search cities",
    tone: "emphasized",
  },
};

export default meta;
type Story = StoryObj<typeof Combobox>;

export const Searchable: Story = {
  render: (args) => {
    const [value, setValue] = useState<string>();
    return <Combobox {...args} value={value} onValueChange={setValue} />;
  },
};

export const AllowCustomValues: Story = {
  render: (args) => {
    const [value, setValue] = useState("remote");
    return <Combobox {...args} allowCustom value={value} onValueChange={setValue} placeholder="Add a workplace" />;
  },
};

