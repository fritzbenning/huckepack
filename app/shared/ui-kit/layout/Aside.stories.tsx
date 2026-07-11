import { Info } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Aside } from "./Aside";
import { AsideFooter } from "./AsideFooter";
import { AsideHeader } from "./AsideHeader";

const meta: Meta<typeof Aside> = {
  title: "Layout/Aside",
  component: Aside,
  args: {
    position: "left",
    layout: "full",
    fixedWidth: true,
  },
  argTypes: {
    position: { control: "radio", options: ["left", "right"] },
    layout: { control: "radio", options: ["auto", "full"] },
    fixedWidth: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Aside>;

export const WithHeaderAndFooter: Story = {
  render: (args) => (
    <Aside {...args} width={280} className="border border-neutral-200 dark:border-neutral-850">
      <AsideHeader>
        <div className="flex h-full items-center px-4 text-sm font-semibold text-neutral-850 dark:text-neutral-100">
          Projects
        </div>
      </AsideHeader>
      <div className="flex-1 space-y-2 p-4 text-sm text-neutral-750 dark:text-neutral-200">
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-850">Sidebar content</div>
        <div className="rounded-md bg-neutral-100 p-3 dark:bg-neutral-850">Lists, trees, filters…</div>
      </div>
      <AsideFooter icon={Info} onIconClick={() => {}}>
        <span className="text-xs text-neutral-500 dark:text-neutral-400">Storage 72%</span>
      </AsideFooter>
    </Aside>
  ),
};
