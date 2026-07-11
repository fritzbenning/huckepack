import { DotsThreeVertical, Eye, PencilSimple, Trash } from "@phosphor-icons/react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import Button from "./Button";
import { PopoverMenu } from "./PopoverMenu";

const meta: Meta<typeof PopoverMenu> = {
  title: "UI/PopoverMenu",
  component: PopoverMenu,
};

export default meta;
type Story = StoryObj<typeof PopoverMenu>;

export const HoverTrigger: Story = {
  render: () => {
    const [last, setLast] = useState("None");
    return (
      <div className="flex items-center gap-3">
        <PopoverMenu
          items={[
            { icon: Eye, label: "Preview", onClick: () => setLast("Preview") },
            { icon: PencilSimple, label: "Rename", onClick: () => setLast("Rename") },
            { icon: Trash, label: "Delete", onClick: () => setLast("Delete") },
          ]}
        >
          <Button
            size="tiny"
            severity="secondary"
            variant="outline"
            icon={DotsThreeVertical}
            iconOnly
            aria-label="Open menu"
          />
        </PopoverMenu>
        <span className="text-xs text-neutral-600 dark:text-neutral-300">Last action: {last}</span>
      </div>
    );
  },
};

export const ClickTrigger: Story = {
  render: () => {
    const [last, setLast] = useState("None");
    return (
      <PopoverMenu
        trigger="click"
        x="left"
        y="top"
        items={[
          { icon: Eye, label: "Open", onClick: () => setLast("Open") },
          { icon: PencilSimple, label: "Edit", onClick: () => setLast("Edit") },
        ]}
      >
        <Button size="small" severity="primary">
          Click me
        </Button>
      </PopoverMenu>
    );
  },
};
