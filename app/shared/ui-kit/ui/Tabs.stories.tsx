import type { Meta, StoryObj } from "@storybook/react-vite";
import { ChartBar, GearSix, ListChecks } from "@phosphor-icons/react";
import { useState } from "react";
import Tabs, { type TabItem } from "./Tabs";

const items: TabItem[] = [
  { id: "overview", label: "Overview", icon: ChartBar },
  { id: "tasks", label: "Tasks", icon: ListChecks },
  { id: "settings", label: "Settings", icon: GearSix },
];

const meta: Meta<typeof Tabs> = {
  title: "UI/Tabs",
  component: Tabs,
  args: {
    items,
    activeTab: "overview",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState(args.activeTab);
    return <Tabs {...args} activeTab={active} onTabChange={setActive} />;
  },
};

export const EqualWidth: Story = {
  render: (args) => {
    const [active, setActive] = useState("tasks");
    return <Tabs {...args} items={items} activeTab={active} onTabChange={setActive} equalWidth />;
  },
};

