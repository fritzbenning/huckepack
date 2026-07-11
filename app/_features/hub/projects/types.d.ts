import type { SandpackPredefinedTemplate } from "@codesandbox/sandpack-react";

export interface ProjectRoute {
  component: string;
  path: string;
  fileId?: string;
}

export interface ImportDefinition {
  from: string;
  default?: string;
  what?: string[];
}

export interface Project {
  id: string;
  team_id: string;
  name: string;
  description: string | null;
  created_at: string;
  sandpack_template: SandpackPredefinedTemplate;
  tsconfig: string;
}

export interface ProjectData {
  team_id: string;
  name: string;
  description: string | null;
}

export interface ProjectCardProps {
  repoName: string;
  projectId: string;
  buttonLabel?: string;
  className?: string;
  demo?: boolean;
}

import type { Id } from "@convex/_generated/dataModel";

export interface ProjectsProps {
  teamId: Id<"teams"> | null | undefined;
  createProjectAction: () => void;
  className?: string;
  onReady?: () => void;
}
