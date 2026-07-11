import type { Meta, StoryObj } from "@storybook/react";
import { DesignRuleHead } from "./DesignRuleHead";

const meta: Meta<typeof DesignRuleHead> = {
  title: "Editor/DesignRuleHead",
  component: DesignRuleHead,
};

export default meta;
type Story = StoryObj<typeof DesignRuleHead>;

export const Default: Story = {
  render: () => (
    <DesignRuleHead onDelete={() => console.log("Delete clicked")}>
      Design Rule Title
    </DesignRuleHead>
  ),
};

