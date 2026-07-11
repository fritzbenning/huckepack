import type { Meta, StoryObj } from "@storybook/react-vite";
import { SelectRoot } from "./SelectRoot";
import { SelectTrigger } from "./SelectTrigger";

const meta: Meta<typeof SelectRoot> = {
  title: "Inputs/SelectRoot",
  component: SelectRoot,
  args: {
    dimension: "small",
    tone: "subtle",
    width: "full",
  },
  argTypes: {
    dimension: { control: "radio", options: ["tiny", "small", "medium", "large"] },
    tone: { control: "radio", options: ["subtle", "emphasized", "transparent"] },
    width: { control: "radio", options: ["full", "slim"] },
  },
};

export default meta;
type Story = StoryObj<typeof SelectRoot>;

export const TriggerPreview: Story = {
  render: (args) => (
    <SelectRoot {...args}>
      <SelectTrigger placeholder="Choose option" isOpen={false} dimension={args.dimension} tone={args.tone} />
    </SelectRoot>
  ),
};

