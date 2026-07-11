import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModalContent } from "./ModalContent";

const meta: Meta<typeof ModalContent> = {
  title: "UI/Modal/Content",
  component: ModalContent,
};

export default meta;
type Story = StoryObj<typeof ModalContent>;

export const Default: Story = {
  args: {
    children: (
      <div className="space-y-2 text-sm text-neutral-750 dark:text-neutral-200">
        <p>Place form fields or descriptions here.</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">Supports padding inherited from parent Modal.</p>
      </div>
    ),
  },
};
