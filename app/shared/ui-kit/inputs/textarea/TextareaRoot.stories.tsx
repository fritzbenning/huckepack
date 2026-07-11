import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaRoot } from "./TextareaRoot";
import { TextareaField } from "./TextareaField";

const meta: Meta<typeof TextareaRoot> = {
  title: "Inputs/TextareaRoot",
  component: TextareaRoot,
};

export default meta;
type Story = StoryObj<typeof TextareaRoot>;

export const Default: Story = {
  render: () => (
    <TextareaRoot>
      <TextareaField value="Root and field composed manually." onChange={() => {}} />
    </TextareaRoot>
  ),
};

