export interface BaseEditorBodyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface EditorBodyModalPropsMap {
  "history.timeline": BaseEditorBodyModalProps & { projectId: string; fileId: string };
}

export type EditorBodyModalName = keyof EditorBodyModalPropsMap;

export type EditorBodyModalProps<T extends EditorBodyModalName> = T extends keyof EditorBodyModalPropsMap
  ? EditorBodyModalPropsMap[T]
  : never;

export type EditorBodyModalContentProps<T extends EditorBodyModalName> = Omit<
  EditorBodyModalProps<T>,
  "isOpen" | "onClose"
>;

export type EditorBodyModalComponent<T extends EditorBodyModalName> = React.ComponentType<
  EditorBodyModalProps<T>
>;

