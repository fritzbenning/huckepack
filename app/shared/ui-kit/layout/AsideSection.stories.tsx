import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsideSection } from "./AsideSection";

const meta: Meta<typeof AsideSection> = {
  title: "Layout/AsideSection",
  component: AsideSection,
  args: {
    title: "Collections",
  },
};

export default meta;
type Story = StoryObj<typeof AsideSection>;

export const Default: Story = {
  args: {
    children: (
      <ul className="space-y-2 text-sm text-neutral-750 dark:text-neutral-200">
        <li>Marketing</li>
        <li>Docs</li>
        <li>Sandbox</li>
      </ul>
    ),
  },
};
