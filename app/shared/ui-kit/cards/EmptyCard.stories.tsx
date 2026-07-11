import type { Meta, StoryObj } from "@storybook/react-vite";
import { CloudArrowUp } from "@phosphor-icons/react";
import EmptyCard from "./EmptyCard";

const meta: Meta<typeof EmptyCard> = {
  title: "Cards/EmptyCard",
  component: EmptyCard,
  args: {
    headline: "Create your first component",
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof EmptyCard>;

export const Default: Story = {};

export const WithCustomIcon: Story = {
  args: {
    icon: CloudArrowUp,
    headline: "Upload design tokens",
  },
};

