import type { Meta, StoryObj } from "@storybook/react-vite";
import { FolderOpen, Tag } from "@phosphor-icons/react";
import Breadcrumb from "./Breadcrumb";

const meta: Meta<typeof Breadcrumb> = {
  title: "UI/Breadcrumb",
  component: Breadcrumb,
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

export const Basic: Story = {
  args: {
    items: [
      { label: "Projects", href: "/projects", icon: <FolderOpen className="size-3.5" weight="duotone" /> },
      { label: "Huckepack", href: "/projects/huckepack" },
      { label: "Design System", icon: <Tag className="size-3.5" weight="duotone" /> },
    ],
  },
};

export const LimitedItems: Story = {
  args: {
    maxItems: 3,
    items: [
      { label: "Home", href: "/" },
      { label: "Workspace", href: "/workspace" },
      { label: "Teams", href: "/teams" },
      { label: "Design System" },
    ],
  },
};

