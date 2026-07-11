import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaField } from "./TextareaField";

const meta: Meta<typeof TextareaField> = {
  title: "Inputs/TextareaField",
  component: TextareaField,
  args: {
    value: "Multiline input",
    rows: 4,
    dimension: "small",
    tone: "subtle",
  },
  argTypes: {
    dimension: { control: "radio", options: ["small", "large"] },
    tone: { control: "radio", options: ["subtle", "emphasized", "transparent", "glass"] },
    align: { control: "radio", options: ["left", "center"] },
  },
};

export default meta;
type Story = StoryObj<typeof TextareaField>;

export const Default: Story = {};

export const Centered: Story = {
  args: {
    align: "center",
    value: "Centered content",
  },
};

