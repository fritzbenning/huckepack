import { EditorBodyModalContainer } from "@editor/history-timeline/components/EditorBodyModalContainer";
import type { EditorBodyModalComponent, EditorBodyModalContentProps, EditorBodyModalName } from "./types";

interface EditorBodyModalRegistryEntry<T extends EditorBodyModalName> {
  component: EditorBodyModalComponent<T>;
  defaultProps: Partial<EditorBodyModalContentProps<T>>;
}

export const editorBodyModalRegistry = {
  "history.timeline": {
    component: EditorBodyModalContainer,
    defaultProps: {},
  },
} as const satisfies {
  [K in EditorBodyModalName]: EditorBodyModalRegistryEntry<K>;
};
