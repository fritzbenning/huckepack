import type { Meta, StoryObj } from "@storybook/react-vite";
import { Folder, GearSix, Plus, Star } from "@phosphor-icons/react";
import AsideItem from "./AsideItem";

const meta: Meta<typeof AsideItem> = {
  title: "UI/AsideItem",
  component: AsideItem,
  args: {
    children: "Design System",
    icon: Folder,
    isActive: false,
    disabled: false,
    avatar: false,
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof AsideItem>;

export const Default: Story = {};

export const WithActions: Story = {
  args: {
    primaryAction: { icon: Star, title: "Pin" },
    secondaryAction: { icon: Plus, title: "Add" },
    icon: GearSix,
    children: "Workspace settings",
  },
};

export const AvatarItem: Story = {
  args: {
    avatar: true,
    children: "Alex Doe",
    icon: undefined,
    isActive: true,
  },
};

