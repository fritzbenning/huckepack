import type { Meta, StoryObj } from "@storybook/react-vite";
import { Cursor, Hand, TextT } from "@phosphor-icons/react";
import { useState } from "react";
import { IconTabs } from "./IconTabs";

const meta: Meta<typeof IconTabs> = {
  title: "Editor/IconTabs",
  component: IconTabs,
  args: {
    size: "small",
  },
  argTypes: {
    size: { control: "radio", options: ["small", "large"] },
  },
};

export default meta;
type Story = StoryObj<typeof IconTabs>;

export const Default: Story = {
  render: (args) => {
    const [active, setActive] = useState("cursor");
    return (
      <IconTabs
        {...args}
        items={[
          { value: "cursor", icon: Cursor, label: "Select" },
          { value: "hand", icon: Hand, label: "Pan" },
          { value: "text", icon: TextT, label: "Text" },
        ]}
        activeValue={active}
        onChange={setActive}
      />
    );
  },
};

