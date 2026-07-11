import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputErrorMessage } from "./InputErrorMessage";

const meta: Meta<typeof InputErrorMessage> = {
  title: "Inputs/InputErrorMessage",
  component: InputErrorMessage,
  args: {
    children: "This field is required",
  },
};

export default meta;
type Story = StoryObj<typeof InputErrorMessage>;

export const Default: Story = {};

