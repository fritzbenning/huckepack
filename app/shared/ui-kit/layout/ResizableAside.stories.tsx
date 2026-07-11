import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { ResizableAside } from "./ResizableAside";

const meta: Meta<typeof ResizableAside> = {
  title: "Layout/ResizableAside",
  component: ResizableAside,
  args: {
    position: "left",
    width: 280,
    minWidth: 200,
    maxWidth: 480,
  },
  argTypes: {
    position: { control: "radio", options: ["left", "right"] },
    width: { control: { type: "number", min: 180, max: 600, step: 10 } },
  },
};

export default meta;
type Story = StoryObj<typeof ResizableAside>;

export const Playground: Story = {
  render: (args) => {
    const [width, setWidth] = useState(args.width);
    return (
      <div className="flex h-64 items-start border border-dashed border-neutral-300 p-2 dark:border-neutral-750">
        <ResizableAside {...args} width={width} onResize={setWidth}>
          <div className="h-full rounded-md border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-750 dark:bg-neutral-950">
            Width: {Math.round(width ?? 0)}px
          </div>
        </ResizableAside>
        <div className="flex-1 p-4 text-sm text-neutral-600 dark:text-neutral-300">Main content</div>
      </div>
    );
  },
};
