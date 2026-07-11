import type { Meta, StoryObj } from "@storybook/react-vite";
import { TextareaLabel } from "./TextareaLabel";

const meta: Meta<typeof TextareaLabel> = {
  title: "Inputs/TextareaLabel",
  component: TextareaLabel,
  args: {
    children: "Description",
    dimension: "small",
  },
  argTypes: {
    dimension: { control: "radio", options: ["small", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof TextareaLabel>;

export const Default: Story = {};

