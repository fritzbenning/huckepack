import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { type SelectOption, VirtualizedSelectList } from "./VirtualizedSelectList";

const options: SelectOption[] = Array.from({ length: 100 }, (_, i) => ({
  value: `option-${i + 1}`,
  label: `Option ${i + 1}`,
}));

const meta: Meta<typeof VirtualizedSelectList> = {
  title: "UI/VirtualizedSelectList",
  component: VirtualizedSelectList,
};

export default meta;
type Story = StoryObj<typeof VirtualizedSelectList>;

export const LargeDataset: Story = {
  render: () => {
    const [value, setValue] = useState<string>();
    return (
      <div className="w-72">
        <VirtualizedSelectList
          options={options}
          value={value}
          onSelect={setValue}
          highlightedIndex={5}
          listboxId="demo-list"
        />
        <p className="mt-2 text-xs text-neutral-600 dark:text-neutral-300">Selected: {value ?? "None"}</p>
      </div>
    );
  },
};
