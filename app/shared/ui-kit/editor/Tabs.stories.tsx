import type { Meta, StoryObj } from "@storybook/react-vite";
import Tabs from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Editor/Tabs",
  component: Tabs,
  args: {
    items: [
      { id: "props", label: "Props" },
      { id: "styles", label: "Styles" },
      { id: "state", label: "State" },
    ],
    activeTab: "props",
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Default: Story = {
  args: {
    onTabChange: () => {},
  },
};

