export interface FileCanvasState {
  selectedNode: string | null;
}

export interface CanvasState {
  projectId: string;
  zoom: number;
  breakpoint: { viewport: "mobile" | "desktop" | "stretch" | "custom" | "auto"; width: number | "100%" | "auto" };
  inspectorWidth: string;
  showCodeEditor: boolean;
  focusMode: boolean;
  activeTool: string;
  viewportHeight: number;
  files: Record<string, FileCanvasState>;
}
