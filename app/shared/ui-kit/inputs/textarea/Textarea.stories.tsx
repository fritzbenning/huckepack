import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Textarea } from "./Textarea";

const meta: Meta<typeof Textarea> = {
  title: "Inputs/Textarea",
  component: Textarea,
  args: {
    placeholder: "Share context for your team...",
    dimension: "large",
    tone: "subtle",
    rows: 5,
  },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Basic: Story = {
  render: (args) => {
    const [value, setValue] = useState("We need a hero section with animation.");
    return <Textarea {...args} value={value} onChange={setValue} />;
  },
};

export const WithSendButton: Story = {
  render: (args) => {
    const [value, setValue] = useState("");
    return (
      <Textarea
        {...args}
        value={value}
        onChange={setValue}
        showSendButton
        onSend={() => alert(`Send: ${value}`)}
        placeholder="Press the send icon or ⌘/Ctrl+Enter"
      />
    );
  },
};

