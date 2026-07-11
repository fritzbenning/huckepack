import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputRoot } from "./InputRoot";
import { InputIcon } from "./InputIcon";
import { InputField } from "./InputField";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

const meta: Meta<typeof InputRoot> = {
  title: "Inputs/InputRoot",
  component: InputRoot,
  args: {
    dimension: "small",
    tone: "subtle",
    width: "full",
    error: false,
    disabled: false,
  },
  argTypes: {
    dimension: { control: "radio", options: ["tiny", "small", "medium", "large"] },
    tone: { control: "radio", options: ["subtle", "emphasized", "transparent", "glass"] },
    width: { control: "radio", options: ["full", "slim"] },
    error: { control: "boolean" },
    disabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof InputRoot>;

export const WithIcon: Story = {
  render: (args) => (
    <InputRoot {...args}>
      <InputIcon icon={MagnifyingGlassIcon} dimension={args.dimension ?? "small"} />
      <InputField value="Search components" onChange={() => {}} dimension={args.dimension} tone={args.tone} />
    </InputRoot>
  ),
};

export const ErrorState: Story = {
  args: { error: true },
  render: (args) => (
    <InputRoot {...args}>
      <InputField value="Invalid value" onChange={() => {}} dimension={args.dimension} tone={args.tone} />
    </InputRoot>
  ),
};

