import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import { SandpackCodeEditorWrapper } from "./SandpackCodeEditorWrapper";

const meta: Meta<typeof SandpackCodeEditorWrapper> = {
  title: "Editor/Sandbox/SandpackCodeEditorWrapper",
  component: SandpackCodeEditorWrapper,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter>
        <div className="h-96">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SandpackCodeEditorWrapper>;

export const Default: Story = {};

