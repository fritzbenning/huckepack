import type { Meta, StoryObj } from "@storybook/react-vite";
import { ComingSoon } from "./ComingSoon";

const meta: Meta<typeof ComingSoon> = {
  title: "UI/ComingSoon",
  component: ComingSoon,
  args: {
    children: "Migration assistant in progress",
  },
};

export default meta;
type Story = StoryObj<typeof ComingSoon>;

export const Default: Story = {};

export const MutedSmall: Story = {
  args: {
    size: "sm",
    variant: "muted",
    children: "SAML SSO planned",
  },
};

export const Loud: Story = {
  args: {
    size: "lg",
    variant: "default",
    children: "Realtime cursors shipping next sprint",
  },
};
