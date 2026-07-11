import type { TreeItem } from "@hooks/repo/useRepositoryTree";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CSSFileTree } from "./CSSFileTree";

const mockItems: TreeItem[] = [
  { path: "styles", type: "tree" },
  { path: "styles/global.css", type: "blob" },
  { path: "styles/theme.scss", type: "blob" },
  { path: "styles/nested", type: "tree" },
  { path: "styles/nested/buttons.css", type: "blob" },
  { path: "README.md", type: "blob" },
];

const meta: Meta<typeof CSSFileTree> = {
  title: "Inputs/RepositoryTree/CSSFileTree",
  component: CSSFileTree,
  args: {
    items: mockItems,
  },
};

export default meta;
type Story = StoryObj<typeof CSSFileTree>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string>("styles/global.css");
    return (
      <div className="w-80 rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-850">
        <CSSFileTree {...args} selectedFile={selected} onFileSelect={setSelected} />
        <p className="mt-3 text-xs text-neutral-600 dark:text-neutral-300">Selected: {selected || "none"}</p>
      </div>
    );
  },
};
