import { useProject } from "../hooks/useProject";

export function ProjectName({ projectId }: { projectId: string }) {
  const { project } = useProject(projectId);

  return (
    <span className="flex h-3.75 items-center font-bold text-sm text-neutral-850 leading-1 dark:text-neutral-200">
      {project?.name}
    </span>
  );
}
