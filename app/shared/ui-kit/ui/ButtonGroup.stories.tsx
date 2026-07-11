import type { Meta, StoryObj } from "@storybook/react-vite";
import { Play, Sparkle, Stop } from "@phosphor-icons/react";
import Button from "./Button";
import ButtonGroup from "./ButtonGroup";

const meta: Meta<typeof ButtonGroup> = {
  title: "UI/ButtonGroup",
  component: ButtonGroup,
};

export default meta;
type Story = StoryObj<typeof ButtonGroup>;

export const Controls: Story = {
  render: () => (
    <ButtonGroup>
      <Button size="small" icon={Play}>
        Start
      </Button>
      <Button size="small" severity="secondary" icon={Stop}>
        Stop
      </Button>
      <Button size="small" variant="outline" icon={Sparkle}>
        Boost
      </Button>
    </ButtonGroup>
  ),
};

