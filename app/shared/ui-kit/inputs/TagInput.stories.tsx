import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { TagInput } from "./TagInput";

const meta: Meta<typeof TagInput> = {
  title: "Inputs/TagInput",
  component: TagInput,
  args: {
    placeholder: "Add tech tags",
    label: "Stack",
  },
};

export default meta;
type Story = StoryObj<typeof TagInput>;

export const Default: Story = {
  render: (args) => {
    const [tags, setTags] = useState(["React", "Tailwind", "Convex"]);
    return <TagInput {...args} value={tags} onChange={setTags} />;
  },
};

export const EmptyState: Story = {
  render: (args) => {
    const [tags, setTags] = useState<string[]>([]);
    return <TagInput {...args} value={tags} onChange={setTags} placeholder="Add keywords" />;
  },
};

