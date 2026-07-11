import type { Meta, StoryObj } from "@storybook/react-vite";
import * as ConvexReact from "convex/react";
import { UserAvatar } from "./UserAvatar";

// Mock convex useQuery for Storybook
(ConvexReact as any).useQuery = () => ({
  image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
  name: "Avery neutral",
});

const meta: Meta<typeof UserAvatar> = {
  title: "UI/UserAvatar",
  component: UserAvatar,
};

export default meta;
type Story = StoryObj<typeof UserAvatar>;

export const Default: Story = {};
