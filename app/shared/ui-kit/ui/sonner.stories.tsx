import type { Meta, StoryObj } from "@storybook/react-vite";
import { Toaster } from "./sonner";
import Button from "./Button";
import { toast } from "sonner";

const meta: Meta<typeof Toaster> = {
  title: "UI/Sonner",
  component: Toaster,
};

export default meta;
type Story = StoryObj<typeof Toaster>;

export const Default: Story = {
  render: () => (
    <>
      <Button onClick={() => toast("Notification", { description: "This uses the Sonner toaster." })}>Show toast</Button>
      <Toaster />
    </>
  ),
};

