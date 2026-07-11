import type { Meta, StoryObj } from "@storybook/react-vite";
import UserAvatars from "./UserAvatars";

const meta: Meta<typeof UserAvatars> = {
  title: "UI/UserAvatars",
  component: UserAvatars,
  args: {
    size: "md",
    maxVisible: 4,
  },
};

export default meta;
type Story = StoryObj<typeof UserAvatars>;

const users = [
  { _id: "1" } as any,
  { _id: "2", name: "Alice Figma" } as any,
  { _id: "3", name: "Ben React" } as any,
  { _id: "4", name: "Cara Ops" } as any,
  { _id: "5", name: "Dev UX" } as any,
];

export const Default: Story = {
  args: {
    users,
  },
};

export const LargeOverlap: Story = {
  args: {
    users,
    size: "lg",
    maxVisible: 3,
  },
};

