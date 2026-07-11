import { cn } from "@lib/utils";
import { FileText, Upload as UploadIcon } from "@phosphor-icons/react";
import { IconAction } from "@shared/ui-kit/ui/IconAction";
import type React from "react";
import { useRef, useState } from "react";

export interface UploadProps {
  onFileSelect: (content: string, filename: string) => void;
  onFileRemove?: () => void;
  acceptedTypes?: string[];
  maxSize?: number; // in MB
  currentFile?: string;
  placeholder?: string;
  className?: string;
}

export const Upload: React.FC<UploadProps> = ({
  onFileSelect,
  onFileRemove,
  acceptedTypes = [".css", ".txt"],
  maxSize = 5,
  currentFile,
  placeholder = "Upload or drag & drop a CSS file",
  className = "",
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileRead = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size must be less than ${maxSize}MB`);
      return;
    }

    const fileExtension = file.name.toLowerCase().split(".").pop();
    const isValidType = acceptedTypes.some((type) => type.includes(fileExtension || ""));

    if (!isValidType) {
      alert(`File type not supported. Please select: ${acceptedTypes.join(", ")}`);
      return;
    }

    setIsLoading(true);
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      onFileSelect(content, file.name);
      setIsLoading(false);
    };
    reader.onerror = () => {
      alert("Error reading file");
      setIsLoading(false);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileRead(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileRead(files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    onFileRemove?.();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
        className="hidden"
      />

      {currentFile ? (
        <div className="flex items-center justify-between rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-600 dark:bg-neutral-850">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-neutral-500 dark:text-neutral-400" weight="duotone" />
            <span className="max-w-xs truncate text-sm text-neutral-750 dark:text-neutral-300">{currentFile}</span>
          </div>
          <IconAction onClick={handleRemoveFile} size="md" className="text-neutral-500 dark:text-neutral-400" />
        </div>
      ) : (
        <button
          type="button"
          className={cn(
            "relative w-full cursor-pointer rounded-md border border-dashed bg-white p-8 text-center transition-colors dark:bg-neutral-850",
            isDragOver
              ? "border-primary-400 bg-primary-50 dark:bg-primary-900/20"
              : "border-neutral-300 hover:border-neutral-400 dark:border-neutral-600 dark:hover:border-neutral-500",
            isLoading && "pointer-events-none opacity-50"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleClick}
        >
          <div className="flex flex-col items-center gap-3">
            <UploadIcon className="size-7 text-neutral-400 dark:text-neutral-500" weight="duotone" />
            <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
              <h4 className="font-medium">Click to upload or drag and drop</h4>
              <div className="text-xs text-neutral-500 dark:text-neutral-500">{placeholder}</div>
            </div>

            {/* <div className="text-xs text-neutral-400 dark:text-neutral-500">{acceptedTypes.join(", ")}</div> */}
          </div>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center rounded-md bg-white/80 dark:bg-neutral-850/80">
              <div className="h-6 w-6 animate-spin rounded-full border-neutral-950 border-b-2 dark:border-neutral-100"></div>
            </div>
          )}
        </button>
      )}
    </div>
  );
};
