import type { Meta, StoryObj } from "@storybook/react-vite";
import { InputLabel } from "./InputLabel";

const meta: Meta<typeof InputLabel> = {
  title: "Inputs/InputLabel",
  component: InputLabel,
  args: {
    children: "Label",
    dimension: "small",
  },
  argTypes: {
    dimension: { control: "radio", options: ["tiny", "small", "medium", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof InputLabel>;

export const Default: Story = {};

