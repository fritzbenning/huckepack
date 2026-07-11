import type { Meta, StoryObj } from "@storybook/react-vite";
import { Info } from "@phosphor-icons/react";
import { ModalHeader } from "./ModalHeader";

const meta: Meta<typeof ModalHeader> = {
  title: "UI/Modal/Header",
  component: ModalHeader,
  args: {
    title: "Create project",
    icon: Info,
  },
};

export default meta;
type Story = StoryObj<typeof ModalHeader>;

export const Default: Story = {};

