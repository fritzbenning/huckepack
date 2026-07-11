import type { Meta, StoryObj } from "@storybook/react-vite";
import { Lightning, Sparkle } from "@phosphor-icons/react";
import { SelectList, type SelectOption } from "./SelectList";

const options: SelectOption[] = [
  { value: "perform", label: "Performance", icon: Lightning },
  { value: "access", label: "Accessibility", icon: Sparkle },
  { value: "security", label: "Security", disabled: true },
  { value: "devexp", label: "Developer Experience" },
];

const meta: Meta<typeof SelectList> = {
  title: "UI/Select/List",
  component: SelectList,
  args: {
    options,
    value: "access",
    size: "small",
  },
  argTypes: {
    size: { control: "radio", options: ["tiny", "small", "medium", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof SelectList>;

export const Default: Story = {
  args: {
    onSelect: () => {},
  },
};

