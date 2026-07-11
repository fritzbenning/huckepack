import type { Meta, StoryObj } from "@storybook/react-vite";
import { CheckboxRoot } from "./CheckboxRoot";
import { Checkbox } from "./Checkbox";

const meta: Meta<typeof CheckboxRoot> = {
  title: "Inputs/CheckboxRoot",
  component: CheckboxRoot,
};

export default meta;
type Story = StoryObj<typeof CheckboxRoot>;

export const Group: Story = {
  render: () => (
    <CheckboxRoot className="flex flex-col gap-2">
      <Checkbox label="Alpha" checked onChange={() => {}} />
      <Checkbox label="Beta" onChange={() => {}} />
    </CheckboxRoot>
  ),
};

