import type { Meta, StoryObj } from "@storybook/react";
import { DesignRuleBody } from "./DesignRuleBody";

const meta: Meta<typeof DesignRuleBody> = {
  title: "Editor/DesignRuleBody",
  component: DesignRuleBody,
};

export default meta;
type Story = StoryObj<typeof DesignRuleBody>;

export const Default: Story = {
  render: () => (
    <DesignRuleBody>
      <div>Content goes here</div>
    </DesignRuleBody>
  ),
};

