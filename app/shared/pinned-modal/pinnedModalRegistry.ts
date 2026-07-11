import { ColorPickerModal } from "@editor/design/ui/color-modal/ColorPickerModal";
import { DesignRulesHelpModal } from "@editor/design/ui/design-panel/modals/DesignRulesHelpModal";
import { ViewportSettingsModal } from "@editor/design/ui/design-panel/modals/ViewportSettingsModal";
import { FileTreeHelpModal } from "@editor/file-tree/modals/FileTreeHelpModal";
import { PropertyPanelHelpModal } from "@editor/property-panel/modals/PropertyPanelHelpModal";
import type { PinnedModalComponent, PinnedModalContentProps, PinnedModalName } from "./types";

interface PinnedModalRegistryEntry<T extends PinnedModalName> {
  component: PinnedModalComponent<T>;
  defaultProps: Partial<PinnedModalContentProps<T>>;
}

export const pinnedModalRegistry = {
  "property-panel.help": {
    component: PropertyPanelHelpModal,
    defaultProps: {},
  },
  "design-panel.help": {
    component: DesignRulesHelpModal,
    defaultProps: {},
  },
  "design-panel.viewport-settings": {
    component: ViewportSettingsModal,
    defaultProps: {},
  },
  "file-tree.help": {
    component: FileTreeHelpModal,
    defaultProps: {},
  },
  "design-panel.color-picker": {
    component: ColorPickerModal,
    defaultProps: { featurePrefix: "backgroundColor", title: "Background Color" },
  },
  "design-panel.text-color-picker": {
    component: ColorPickerModal,
    defaultProps: { featurePrefix: "textColor", title: "Text Color" },
  },
} as const satisfies {
  [K in PinnedModalName]: PinnedModalRegistryEntry<K>;
};
