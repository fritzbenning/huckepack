import { ApplicationModal } from "@application/modals";
import { InstanceSelectModal } from "@editor/floating-toolbar/modals/InstanceSelectModal";
import { ProjectModal } from "@hub/projects/modals";
import { TeamModal } from "@hub/teams/modals";
import { WorkspaceModal } from "@hub/workspace/modals";
import { FileModal } from "@project/file/modals";
import { ConnectRepository } from "@repo/github-app/modals";
import type { ModalComponent, ModalContentProps, ModalName } from "./types";

interface ModalRegistryEntry<T extends ModalName> {
  component: ModalComponent<T>;
  defaultProps: Partial<ModalContentProps<T>>;
}

export const modalRegistry = {
  "workspace.new": {
    component: WorkspaceModal.New,
    defaultProps: {},
  },
  "workspace.settings": {
    component: WorkspaceModal.Settings,
    defaultProps: {},
  },
  "team.new": {
    component: TeamModal.New,
    defaultProps: {},
  },
  "team.settings": {
    component: TeamModal.Settings,
    defaultProps: {},
  },
  "project.new": {
    component: ProjectModal.New,
    defaultProps: {},
  },
  "project.settings": {
    component: ProjectModal.Settings,
    defaultProps: {},
  },
  "file.new": {
    component: FileModal.New,
    defaultProps: {},
  },
  "file.settings": {
    component: FileModal.Settings,
    defaultProps: {},
  },
  "file.delete": {
    component: FileModal.Delete,
    defaultProps: {},
  },
  "file.import": {
    component: FileModal.Import,
    defaultProps: {},
  },
  "repo.connect": {
    component: ConnectRepository,
    defaultProps: {},
  },
  "component.select": {
    component: InstanceSelectModal,
    defaultProps: {},
  },
  "application.notImplemented": {
    component: ApplicationModal.NotImplemented,
    defaultProps: {},
  },
} as const satisfies {
  [K in ModalName]: ModalRegistryEntry<K>;
};
