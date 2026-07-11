import type { Meta, StoryObj } from "@storybook/react";
import { DesignRuleInputRow } from "./DesignRuleInputRow";

const meta: Meta<typeof DesignRuleInputRow> = {
  title: "Editor/DesignRuleInputRow",
  component: DesignRuleInputRow,
};

export default meta;
type Story = StoryObj<typeof DesignRuleInputRow>;

export const Default: Story = {
  render: () => (
    <DesignRuleInputRow>
      <input type="text" placeholder="Enter value" />
    </DesignRuleInputRow>
  ),
};

