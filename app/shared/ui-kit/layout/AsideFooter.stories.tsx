import { Info } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsideFooter } from "./AsideFooter";

const meta: Meta<typeof AsideFooter> = {
  title: "Layout/AsideFooter",
  component: AsideFooter,
  args: {
    children: <span className="text-xs text-neutral-500 dark:text-neutral-400">2.3 GB of 5 GB used</span>,
  },
};

export default meta;
type Story = StoryObj<typeof AsideFooter>;

export const WithIconAction: Story = {
  args: {
    icon: Info,
    onIconClick: () => {},
  },
};
