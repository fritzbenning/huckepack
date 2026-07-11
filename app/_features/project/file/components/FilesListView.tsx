import { AnimatedSkeleton } from "@shared/ui-kit/animations/AnimatedSkeleton";
import { useFiles } from "../hooks";
import { FileListItem } from "./FileListItem";

export interface FilesListViewProps {
  projectId: string | null | undefined;
  className?: string;
}

export function FilesListView({ projectId, className = "" }: FilesListViewProps) {
  const { files, loading } = useFiles(projectId);

  if (!projectId) {
    return null;
  }

  return (
    <AnimatedSkeleton
      loading={loading}
      skeletonItems={3}
      containerClassName="flex flex-col gap-2"
      itemClassName="h-14 rounded-lg"
    >
      <div className={`flex flex-col gap-2 ${className}`}>
        {files && files.length > 0
          ? files.map((file) => {
              return (
                <FileListItem
                  key={file._id}
                  fileId={file._id}
                  fileName={file.name}
                  fileType={file.type}
                  projectId={projectId}
                  updatedAt={file.updatedAt}
                  lastEditor={file.lastEditor}
                />
              );
            })
          : null}
      </div>
    </AnimatedSkeleton>
  );
}
