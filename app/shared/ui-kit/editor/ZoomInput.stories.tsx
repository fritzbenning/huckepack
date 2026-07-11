import type { Meta, StoryObj } from "@storybook/react-vite";
import * as CanvasStore from "@editor/canvas";
import { useState } from "react";
import { ZoomInput } from "./ZoomInput";

// Mock canvas store
(CanvasStore as any).useCanvasStore = (selector?: any) =>
  selector
    ? selector({ canvases: { "proj-1": { zoom: 1 } } })
    : { canvases: { "proj-1": { zoom: 1 } } };

const meta: Meta<typeof ZoomInput> = {
  title: "Editor/ZoomInput",
  component: ZoomInput,
  args: {
    projectId: "proj-1",
  },
};

export default meta;
type Story = StoryObj<typeof ZoomInput>;

export const Default: Story = {
  render: (args) => {
    const [zoom, setZoom] = useState(1);
    (CanvasStore as any).useCanvasStore = (selector?: any) =>
      selector
        ? selector({ canvases: { [args.projectId]: { zoom } } })
        : { canvases: { [args.projectId]: { zoom } } };
    return <ZoomInput {...args} setZoomToValue={setZoom} />;
  },
};
import type { Meta, StoryObj } from "@storybook/react-vite";
import * as CanvasStore from "@editor/canvas";
import { useState } from "react";
import { ZoomInput } from "./ZoomInput";

// Mock canvas store
(CanvasStore as any).useCanvasStore = (selector?: any) =>
  selector
    ? selector({ canvases: { "proj-1": { zoom: 1 } } })
    : { canvases: { "proj-1": { zoom: 1 } } };

const meta: Meta<typeof ZoomInput> = {
  title: "Editor/ZoomInput",
  component: ZoomInput,
  args: {
    projectId: "proj-1",
  },
};

export default meta;
type Story = StoryObj<typeof ZoomInput>;

export const Default: Story = {
  render: (args) => {
    const [zoom, setZoom] = useState(1);
    (CanvasStore as any).useCanvasStore = (selector?: any) =>
      selector
        ? selector({ canvases: { [args.projectId]: { zoom } } })
        : { canvases: { [args.projectId]: { zoom } } };
    return <ZoomInput {...args} setZoomToValue={setZoom} />;
  },
};

