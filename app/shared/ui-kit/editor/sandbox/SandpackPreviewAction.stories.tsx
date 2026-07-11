import type { Meta, StoryObj } from "@storybook/react-vite";
import { Play } from "@phosphor-icons/react";
import { SandpackPreviewAction } from "./SandpackPreviewAction";

const meta: Meta<typeof SandpackPreviewAction> = {
  title: "Editor/Sandbox/SandpackPreviewAction",
  component: SandpackPreviewAction,
  args: {
    children: (
      <>
        <Play className="size-4" weight="duotone" /> Run preview
      </>
    ),
  },
  argTypes: {
    onClick: { action: "clicked" },
  },
};

export default meta;
type Story = StoryObj<typeof SandpackPreviewAction>;

export const Default: Story = {};

