import * as TabStore from "@editor/tabs";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { MemoryRouter } from "react-router-dom";
import TitleBar from "./TitleBar";

// Mock tab store
(TabStore as any).useTabStore = (selector?: any) =>
  selector
    ? selector({
        openTabs: [
          { id: "file-1", title: "Dashboard.tsx", projectId: "proj-1" },
          { id: "file-2", title: "Button.tsx", projectId: "proj-1" },
        ],
      })
    : {
        openTabs: [
          { id: "file-1", title: "Dashboard.tsx", projectId: "proj-1" },
          { id: "file-2", title: "Button.tsx", projectId: "proj-1" },
        ],
      };

const meta: Meta<typeof TitleBar> = {
  title: "Layout/TitleBar",
  component: TitleBar,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/dashboard"]}>
        <div className="bg-neutral-100 dark:bg-neutral-950">
          <Story />
        </div>
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof TitleBar>;

export const Default: Story = {};
