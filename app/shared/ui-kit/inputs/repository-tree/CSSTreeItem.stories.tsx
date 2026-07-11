import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { CSSTreeItem, type CSSTreeNode } from "./CSSTreeItem";

const node: CSSTreeNode = {
  path: "styles/global.css",
  name: "global.css",
  type: "blob",
  isCSS: true,
};

const folderNode: CSSTreeNode = {
  path: "styles",
  name: "styles",
  type: "tree",
  children: [node],
};

const meta: Meta<typeof CSSTreeItem> = {
  title: "Inputs/RepositoryTree/CSSTreeItem",
  component: CSSTreeItem,
  args: {
    node: folderNode,
    depth: 0,
    expandedNodes: new Set(["styles"]),
    selectedFile: "styles/global.css",
  },
};

export default meta;
type Story = StoryObj<typeof CSSTreeItem>;

export const FolderWithFile: Story = {
  render: (args) => {
    const [expanded, setExpanded] = useState(new Set(args.expandedNodes));
    const [selected, setSelected] = useState(args.selectedFile);
    return (
      <CSSTreeItem
        {...args}
        expandedNodes={expanded}
        selectedFile={selected}
        onToggleExpanded={(path) => {
          const next = new Set(expanded);
          next.has(path) ? next.delete(path) : next.add(path);
          setExpanded(next);
        }}
        onFileSelect={setSelected}
      />
    );
  },
};

