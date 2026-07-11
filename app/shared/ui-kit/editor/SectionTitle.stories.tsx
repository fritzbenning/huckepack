import type { Meta, StoryObj } from "@storybook/react-vite";
import { SectionTitle } from "./SectionTitle";

const meta: Meta<typeof SectionTitle> = {
  title: "Editor/SectionTitle",
  component: SectionTitle,
  args: {
    children: "Design tokens",
    variant: "default",
  },
  argTypes: {
    variant: { control: "radio", options: ["default", "highlight"] },
  },
};

export default meta;
type Story = StoryObj<typeof SectionTitle>;

export const Default: Story = {};

export const Highlight: Story = {
  args: { variant: "highlight", children: "Step 1" },
};

