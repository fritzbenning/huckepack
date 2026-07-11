import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import EmptyCard from "@shared/ui-kit/cards/EmptyCard";
import { CardGrid } from "@shared/ui-kit/ui/CardGrid";
import { useEffect } from "react";
import { useProjects } from "../hooks/useProjects";
import type { ProjectsProps } from "../types";
import ProjectCard from "./ProjectCard";

export function Projects({ teamId, createProjectAction, className = "", onReady }: ProjectsProps) {
  const { projects, loading } = useProjects(teamId);

  useEffect(() => {
    if (!loading && onReady) {
      onReady();
    }
  }, [loading, onReady]);

  if (!teamId) {
    return null;
  }

  return (
    <AnimatedSkeleton
      loading={loading}
      skeletonItems={3}
      skeletonHeight={160}
      containerClassName="grid auto-rows-fr grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 3xl:grid-cols-5 2xl:grid-cols-4"
      itemClassName="h-40 w-full"
      rounded="xl"
    >
      <CardGrid className={className}>
        {projects && projects.length > 0
          ? projects.map((project) => (
              <ProjectCard key={project.id} projectId={project.id} projectName={project.name} />
            ))
          : null}
        <EmptyCard headline="New project" onClick={createProjectAction} weight="regular" />
      </CardGrid>
    </AnimatedSkeleton>
  );
}
