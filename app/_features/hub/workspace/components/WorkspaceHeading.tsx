import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import { Heading } from "@shared/ui-kit/typo";
import { useWorkspace } from "../hooks/useWorkspace";

export function WorkspaceHeading({ workspaceId }: { workspaceId: string | undefined }) {
  const { workspace, loading } = useWorkspace(workspaceId);

  return (
    <AnimatedSkeleton loading={loading} skeletonHeight={28} itemClassName="h-7.5 w-48" rounded="sm">
      <Heading as="h1" variant="h1" className="flex items-center gap-4 text-neutral-850 dark:text-neutral-200">
        {workspace?.name}
      </Heading>
    </AnimatedSkeleton>
  );
}
