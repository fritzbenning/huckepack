import type { Meta, StoryObj } from "@storybook/react-vite";
import { ModalContainer } from "./ModalContainer";

const meta: Meta<typeof ModalContainer> = {
  title: "UI/Modal/Container",
  component: ModalContainer,
  args: {
    children: (
      <div className="rounded-lg border border-dashed border-neutral-300 p-6 text-sm text-neutral-600 dark:border-neutral-750 dark:text-neutral-200">
        Your modal content
      </div>
    ),
  },
};

export default meta;
type Story = StoryObj<typeof ModalContainer>;

export const Default: Story = {};
