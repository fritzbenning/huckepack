import { addTab } from "@editor/tabs";
import type { ComponentType } from "@lib/parser";
import { ElementIcon } from "@shared/ui-kit/library/ElementIcon";
import { Badge } from "@shared/ui-kit/ui/Badge";
import Button from "@shared/ui-kit/ui/Button";
import { DynamicGradientCard } from "@shared/ui-kit/ui/DynamicGradientCard";
import { useNavigate } from "react-router-dom";
import { FilePreview } from "./FilePreview";

interface FilePreviewCardProps {
  fileId: string;
  fileName: string;
  filePath: string;
  fileType: string;
  projectId: string;
}

export function FilePreviewCard({ fileId, fileName, filePath, fileType, projectId }: FilePreviewCardProps) {
  const navigate = useNavigate();

  const openFile = () => {
    addTab(fileId, fileName, projectId, "file");
    navigate(`/project/${projectId}/file/${fileId}`);
  };

  return (
    <DynamicGradientCard
      onClick={openFile}
      className="rounded-lg border border-neutral-200 bg-neutral-50 transition-colors hover:bg-neutral-10 dark:border-neutral-750 dark:bg-neutral-950"
    >
      <div className="editor-background pointer-events-none relative aspect-video shadow-inset transition-all">
        {/* <Badge variant="subtle" className="absolute top-4 left-4 z-10">
          {fileType}
        </Badge> */}
        <FilePreview fileId={fileId} filePath={filePath} />
      </div>
      <div className="flex items-center justify-between space-x-2 border-gray-200 border-t bg-white px-4 py-2.5 dark:border-neutral-750 dark:bg-neutral-850">
        <div className="flex items-center gap-2 text-gray-900 dark:text-neutral-300">
          <ElementIcon type={fileType as ComponentType} />
          <h3 className="font-semibold text-xs">{fileName}</h3>
        </div>
        <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
          <Button onClick={openFile}>Edit</Button>
          {/* <Button onClick={handleCopyCode} severity="secondary" variant="outline">
            <CodeXml className="size-3" strokeWidth={2.5} />
          </Button> */}
        </div>
      </div>
    </DynamicGradientCard>
  );
}
