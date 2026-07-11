import type { Meta, StoryObj } from "@storybook/react-vite";
import { Gear, GitPullRequest, Upload } from "@phosphor-icons/react";
import { NavigatorButton } from "./NavigatorButton";

const meta: Meta<typeof NavigatorButton> = {
  title: "Layout/NavigatorButton",
  component: NavigatorButton,
  args: {
    iconName: "Settings",
    title: "Settings",
    isActive: true,
  },
  argTypes: {
    iconName: { control: "radio", options: ["File", "Shapes", "SwatchBook", "Folder", "BookOpen", "GitPullRequest", "Settings", "Ellipsis", "User"] },
    isActive: { control: "boolean" },
    subMenuPosition: { control: "radio", options: ["top", "bottom"] },
  },
};

export default meta;
type Story = StoryObj<typeof NavigatorButton>;

export const Default: Story = {};

export const WithSubmenu: Story = {
  args: {
    iconName: "GitPullRequest",
    isActive: false,
    title: "GitHub",
    subItems: [
      { icon: GitPullRequest, label: "Pull updates", onClick: () => {} },
      { icon: Upload, label: "Import", onClick: () => {} },
      { icon: Gear, label: "Settings", onClick: () => {} },
    ],
  },
};

export const AvatarButton: Story = {
  args: {
    iconName: "User",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&q=60",
    subItems: [
      { icon: Gear, label: "User settings", onClick: () => {} },
      { icon: GitPullRequest, label: "Switch account", onClick: () => {} },
    ],
    subMenuPosition: "top",
  },
};

