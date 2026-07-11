import { ArrowUpRight, Lightning } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { Heading } from "../typo";
import CardTeaser from "./CardTeaser";

const meta: Meta<typeof CardTeaser> = {
  title: "Cards/CardTeaser",
  component: CardTeaser,
  args: {
    headline: "Performance insights",
    subline: "Updated 5 minutes ago",
    buttonLabel: "View report",
  },
};

export default meta;
type Story = StoryObj<typeof CardTeaser>;

export const WithIcons: Story = {
  args: {
    headlineIcon: Lightning,
    sublineIcon: ArrowUpRight,
    head: (
      <Heading as="h4" variant="h6">
        Weekly summary
      </Heading>
    ),
  },
};

export const GhostVariant: Story = {
  args: {
    variant: "ghost",
    headline: "Starter kit",
    subline: "Blueprints for new projects",
    buttonLabel: "Browse templates",
  },
};

export const WithActions: Story = {
  args: {
    actions: <button className="text-xs text-primary-500">Pin</button>,
    buttonLabel: "Open dashboard",
  },
};
