import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "./Heading";

const meta: Meta<typeof Heading> = {
  title: "Typography/Heading",
  component: Heading,
  args: {
    children: "Build better products faster",
  },
};

export default meta;
type Story = StoryObj<typeof Heading>;

export const Hero: Story = {
  args: { variant: "hero", as: "h1" },
};

export const H2: Story = {
  args: { variant: "h2", as: "h2", children: "Design tokens" },
};

export const H4Muted: Story = {
  args: {
    variant: "h4",
    as: "h4",
    children: "Release notes",
    className: "text-neutral-600 dark:text-neutral-300",
  },
};
