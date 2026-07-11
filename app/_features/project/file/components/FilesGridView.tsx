import { openModal } from "@shared/modal";
import EmptyCard from "@shared/ui-kit/cards/EmptyCard";
import { CardGrid } from "@shared/ui-kit/ui/CardGrid";
import { toSlug } from "@shared/utils/format";
import { useFilesWithVersion } from "../hooks";
import { FilePreviewCard } from "./FilePreviewCard";

export interface FilesGridViewProps {
  projectId: string | null | undefined;
  className?: string;
}

export function FilesGridView({ projectId, className = "" }: FilesGridViewProps) {
  const { files } = useFilesWithVersion(projectId);

  if (!projectId) {
    return null;
  }

  return (
    <CardGrid className={className} variant="col-4">
      {files && files.length > 0
        ? files.map((file) => {
            const fileId = file._id;
            const fileSlug = toSlug(file.name);
            const filePath = file.extension ? `/trav/${fileSlug}.${file.extension}` : `/trav/${fileSlug}`;

            return (
              <FilePreviewCard
                key={fileId}
                fileId={fileId}
                fileName={file.name}
                filePath={filePath}
                fileType={file.type}
                projectId={projectId}
              />
            );
          })
        : null}
      <EmptyCard headline="New file" onClick={() => openModal("file.new", { projectId })} />
    </CardGrid>
  );
}
