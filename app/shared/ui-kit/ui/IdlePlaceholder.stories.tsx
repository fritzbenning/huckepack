import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChatCircleDots, MagnifyingGlass } from "@phosphor-icons/react";
import IdlePlaceholder from "./IdlePlaceholder";

const meta: Meta<typeof IdlePlaceholder> = {
  title: "UI/IdlePlaceholder",
  component: IdlePlaceholder,
  args: {
    icon: ChatCircleDots,
    label: "Nothing to show yet",
  },
};

export default meta;
type Story = StoryObj<typeof IdlePlaceholder>;

export const Default: Story = {};

export const SearchEmptyState: Story = {
  args: {
    icon: MagnifyingGlass,
    label: "No results found",
  },
};

