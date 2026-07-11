import type { Meta, StoryObj } from "@storybook/react-vite";
import { useRef, useState } from "react";
import Button from "./Button";
import { SelectPosition } from "./SelectPosition";

const meta: Meta<typeof SelectPosition> = {
  title: "UI/Select/Position",
  component: SelectPosition,
  args: {
    x: "right",
    y: "bottom",
    size: "medium",
    distance: "medium",
  },
  argTypes: {
    x: { control: "radio", options: ["left", "right"] },
    y: { control: "radio", options: ["top", "bottom"] },
    size: { control: "radio", options: ["tiny", "small", "medium", "large"] },
    distance: { control: "radio", options: ["small", "medium", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof SelectPosition>;

export const Playground: Story = {
  render: (args) => {
    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const [open, setOpen] = useState(true);

    return (
      <div className="flex h-64 items-center justify-center">
        <div className="relative">
          <Button ref={triggerRef} onClick={() => setOpen((v) => !v)} variant="outline" severity="secondary">
            Toggle dropdown
          </Button>
          {open && (
            <SelectPosition {...args} triggerRef={triggerRef} dropdownRef={dropdownRef}>
              <div
                ref={dropdownRef}
                className="rounded-md border border-neutral-200 bg-white p-3 text-sm shadow-lg dark:border-neutral-850 dark:bg-neutral-950"
              >
                Positioned content
              </div>
            </SelectPosition>
          )}
        </div>
      </div>
    );
  },
};
