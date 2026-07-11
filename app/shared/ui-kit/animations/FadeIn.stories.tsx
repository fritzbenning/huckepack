import type { Meta, StoryObj } from "@storybook/react-vite";
import { FadeIn } from "./FadeIn";

const meta: Meta<typeof FadeIn> = {
  title: "Animations/FadeIn",
  component: FadeIn,
  args: {
    duration: 0.2,
    delay: 0,
  },
  argTypes: {
    duration: { control: { type: "number", min: 0, max: 1, step: 0.05 } },
    delay: { control: { type: "number", min: 0, max: 1, step: 0.05 } },
  },
};

export default meta;
type Story = StoryObj<typeof FadeIn>;

export const Default: Story = {
  render: (args) => (
    <FadeIn {...args} className="rounded-lg bg-primary-500/90 p-6 text-white shadow-lg">
      <p className="text-sm font-semibold">Fade-in content</p>
      <p className="text-xs text-white/80">Tweak duration and delay via controls.</p>
    </FadeIn>
  ),
};
