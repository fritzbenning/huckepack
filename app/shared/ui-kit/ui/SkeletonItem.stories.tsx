import type { Meta, StoryObj } from "@storybook/react-vite";
import { SkeletonItem } from "./SkeletonItem";

const meta: Meta<typeof SkeletonItem> = {
  title: "UI/Skeleton/Item",
  component: SkeletonItem,
  args: {
    variant: "rectangle",
    rounded: "md",
    className: "h-4 w-40",
  },
  argTypes: {
    variant: { control: "radio", options: ["rectangle", "circle"] },
    rounded: { control: "select", options: ["xs", "sm", "md", "xl", "2xl", "full"] },
  },
};

export default meta;
type Story = StoryObj<typeof SkeletonItem>;

export const Rectangle: Story = {};

export const Circle: Story = {
  args: {
    variant: "circle",
    className: "h-10 w-10",
  },
};

