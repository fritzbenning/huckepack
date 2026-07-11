import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputField } from "./InputField";

const meta: Meta<typeof InputField> = {
  title: "Inputs/InputField",
  component: InputField,
  args: {
    value: "Hello world",
    placeholder: "Type here",
    dimension: "small",
    tone: "subtle",
    align: "left",
    showUnitSelector: false,
  },
  argTypes: {
    dimension: { control: "radio", options: ["tiny", "small", "medium", "large"] },
    tone: { control: "radio", options: ["subtle", "emphasized", "transparent", "glass"] },
    align: { control: "radio", options: ["left", "center", "right"] },
  },
};

export default meta;
type Story = StoryObj<typeof InputField>;

export const Default: Story = {};

export const NumberAligned: Story = {
  args: {
    type: "number",
    align: "right",
    value: "128",
    placeholder: "0",
  },
};

