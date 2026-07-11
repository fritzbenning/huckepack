import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./Skeleton";
import { SkeletonItem } from "./SkeletonItem";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
};

export default meta;
type Story = StoryObj<typeof Skeleton>;

export const SingleLine: Story = {
  args: {
    itemClassName: "h-4 w-40",
  },
};

export const CardPlaceholder: Story = {
  render: () => (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-750 dark:bg-neutral-850">
      <SkeletonItem className="h-5 w-1/3" />
      <Skeleton skeletonItems={3} itemClassName="h-3 w-full" />
      <SkeletonItem className="h-8 w-24 rounded-full" />
    </div>
  ),
};

export const AvatarList: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <SkeletonItem variant="circle" className="size-10" />
      <div className="space-y-2">
        <SkeletonItem className="h-4 w-32" />
        <SkeletonItem className="h-3 w-44" />
      </div>
    </div>
  ),
};
