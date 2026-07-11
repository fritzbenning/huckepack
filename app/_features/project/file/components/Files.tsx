import { openModal } from "@shared/modal";
import EmptyCard from "@shared/ui-kit/cards/EmptyCard";
import { CardGrid } from "@shared/ui-kit/ui/CardGrid";
import { toSlug } from "@shared/utils/format";
import { useFiles } from "../hooks";
import { FilePreviewCard } from "./FilePreviewCard";

export interface FilesProps {
  projectId: string | null | undefined;
  className?: string;
}

export function Files({ projectId, className = "" }: FilesProps) {
  const { files } = useFiles(projectId);

  if (!projectId) {
    return;
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
