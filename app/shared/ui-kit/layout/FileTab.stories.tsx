import type { Meta, StoryObj } from "@storybook/react-vite";
import * as TabStore from "@editor/tabs";
import * as ProjectFile from "@project/file";
import { MemoryRouter } from "react-router-dom";
import FileTab from "./FileTab";

// Mocks
(TabStore as any).useTabStore = (selector?: any) =>
  selector
    ? selector({ openTabs: [{ id: "file-1", title: "Button.tsx", projectId: "proj-1" }] })
    : { openTabs: [{ id: "file-1", title: "Button.tsx", projectId: "proj-1" }] };
(TabStore as any).removeTab = () => {};
(ProjectFile as any).prepareProjectFileRoute = (projectId: string, fileId: string) => `/project/${projectId}/file/${fileId}`;

const meta: Meta<typeof FileTab> = {
  title: "Layout/FileTab",
  component: FileTab,
  args: {
    fileId: "file-1",
    fileName: "Button.tsx",
    isActive: true,
  },
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={["/project/proj-1/file/file-1"]}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileTab>;

export const Default: Story = {};

