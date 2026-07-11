import { Tabs } from "@shared/ui-kit/ui/Tabs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsideHeader } from "./AsideHeader";

const meta: Meta<typeof AsideHeader> = {
  title: "Layout/AsideHeader",
  component: AsideHeader,
};

export default meta;
type Story = StoryObj<typeof AsideHeader>;

export const WithTabs: Story = {
  render: () => (
    <AsideHeader
      tabsSlot={
        <Tabs
          items={[
            { id: "overview", label: "Overview" },
            { id: "activity", label: "Activity" },
          ]}
          activeTab="overview"
          onTabChange={() => {}}
          className="px-3 pb-3"
        />
      }
    >
      <div className="flex h-full items-center px-4 text-sm font-semibold text-neutral-850 dark:text-neutral-100">
        Team
      </div>
    </AsideHeader>
  ),
};
