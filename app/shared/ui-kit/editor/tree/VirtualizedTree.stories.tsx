import type { Meta, StoryObj } from "@storybook/react-vite";
import type { TreeNode as TreeNodeType } from "@lib/parser/react/convertToTreeNode";
import { useMemo, useState } from "react";
import { VirtualizedTree } from "./VirtualizedTree";

const treeData: TreeNodeType[] = [
  {
    path: "root",
    name: "Root",
    children: [
      { path: "root/nav", name: "Nav", children: [] },
      {
        path: "root/content",
        name: "Content",
        children: [
          { path: "root/content/card", name: "Card", children: [] },
          { path: "root/content/footer", name: "Footer", children: [] },
        ],
      },
    ],
  },
];

const flatten = (nodes: TreeNodeType[], depth = 0) =>
  nodes.flatMap((node, index) => [
    { node, depth, index },
    ...(node.children ? flatten(node.children, depth + 1) : []),
  ]);

const meta: Meta<typeof VirtualizedTree> = {
  title: "Editor/Tree/VirtualizedTree",
  component: VirtualizedTree,
  args: {
    flatTreeItems: flatten(treeData),
    selectedNode: "root/content/card",
    expandedNodes: new Set<string>(["root", "root/content"]),
  },
};

export default meta;
type Story = StoryObj<typeof VirtualizedTree>;

export const Default: Story = {
  render: (args) => {
    const [selected, setSelected] = useState<string | null>(args.selectedNode ?? null);
    const [expanded, setExpanded] = useState(new Set<string>(args.expandedNodes));
    const data = useMemo(() => args.flatTreeItems, [args.flatTreeItems]);

    return (
      <VirtualizedTree
        {...args}
        flatTreeItems={data}
        selectedNode={selected}
        expandedNodes={expanded}
        onNodeClick={(node) => setSelected(node.path)}
        onToggleExpanded={(path) =>
          setExpanded((prev) => {
            const next = new Set(prev);
            next.has(path) ? next.delete(path) : next.add(path);
            return next;
          })
        }
      />
    );
  },
};

