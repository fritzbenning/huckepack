import type { TreeItem } from "@hooks/repo/useRepositoryTree";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { RepositoryTree } from "./RepositoryTree";

const mockItems: TreeItem[] = [
  { path: "app", type: "tree" },
  { path: "app/main.tsx", type: "blob" },
  { path: "app/components", type: "tree" },
  { path: "app/components/Button.tsx", type: "blob" },
  { path: "app/components/Card.tsx", type: "blob" },
  { path: "docs", type: "tree" },
  { path: "docs/README.md", type: "blob" },
];

const meta: Meta<typeof RepositoryTree> = {
  title: "Inputs/RepositoryTree",
  component: RepositoryTree,
  args: {
    items: mockItems,
  },
};

export default meta;
type Story = StoryObj<typeof RepositoryTree>;

export const SelectableFolders: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string[]>(["app"]);
    const [root, setRoot] = useState<string | null>(null);

    return (
      <div className="w-80 rounded-lg border border-neutral-200 p-3 text-sm dark:border-neutral-850">
        <RepositoryTree
          {...args}
          selectedFolders={selected}
          onSelectedFoldersChange={setSelected}
          onRootFolderChange={(folder) => setRoot(folder)}
        />
        <div className="mt-3 space-y-1 text-xs text-neutral-600 dark:text-neutral-300">
          <div>Selected: {selected.join(", ") || "none"}</div>
          <div>Last toggled: {root ?? "none"}</div>
        </div>
      </div>
    );
  },
};
