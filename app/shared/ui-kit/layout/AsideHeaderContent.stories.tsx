import type { Meta, StoryObj } from "@storybook/react-vite";
import { AsideHeaderContent } from "./AsideHeaderContent";

const meta: Meta<typeof AsideHeaderContent> = {
  title: "Layout/AsideHeaderContent",
  component: AsideHeaderContent,
  args: {
    title: "Components",
    subtitle: "17 files",
  },
};

export default meta;
type Story = StoryObj<typeof AsideHeaderContent>;

export const Default: Story = {};

