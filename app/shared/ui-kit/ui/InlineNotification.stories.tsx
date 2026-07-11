import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckCircle, Info, WarningCircle, XCircle } from "@phosphor-icons/react";
import { InlineNotification } from "./InlineNotification";

const meta: Meta<typeof InlineNotification> = {
  title: "UI/InlineNotification",
  component: InlineNotification,
  args: {
    children: "Draft saved",
    severity: "neutral",
  },
};

export default meta;
type Story = StoryObj<typeof InlineNotification>;

export const Neutral: Story = {};

export const Success: Story = {
  args: {
    severity: "success",
    icon: CheckCircle,
    children: "Changes published to production",
  },
};

export const Warning: Story = {
  args: {
    severity: "warning",
    icon: WarningCircle,
    children: "API rate limits are close to the threshold",
  },
};

export const Error: Story = {
  args: {
    severity: "error",
    icon: XCircle,
    children: "Deployment failed. Please re-run the pipeline.",
  },
};

export const InfoNote: Story = {
  args: {
    severity: "info",
    icon: Info,
    children: "Your teammate is viewing this page in real time.",
  },
};

