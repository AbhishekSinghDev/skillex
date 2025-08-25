import { cn } from "@/lib/utils";
import {
  IconCloudUpload,
  IconFileText,
  IconImageInPicture,
  IconRefresh,
  IconTrash,
  IconVideo,
  IconX,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export const RenderEmptyState = ({
  isDragActive,
  fileType,
}: {
  isDragActive: boolean;
  fileType?: "image" | "video" | "document";
}) => {
  const getFileTypeText = () => {
    switch (fileType) {
      case "image":
        return "Images up to 10MB";
      case "video":
        return "Videos up to 10MB";
      case "document":
        return "PDF files up to 10MB";
      default:
        return "Images and videos up to 10MB";
    }
  };

  const getUploadText = () => {
    if (fileType === "document") {
      return "Drop your PDF files here or";
    }
    return "Drop your files here or";
  };

  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
        <IconCloudUpload
          className={cn(
            "size-6 text-muted-foreground",
            isDragActive && "text-primary"
          )}
        />
      </div>
      <p className="text-base font-semibold text-foreground cursor-pointer">
        {getUploadText()}{" "}
        <span className="text-primary font-bold">click to upload</span>
      </p>
      <p className="text-sm text-muted-foreground mt-1">{getFileTypeText()}</p>
      <Button className="mt-4" type="button">
        Select File{fileType === "document" ? "s" : ""}
      </Button>
    </div>
  );
};

export const RenderUploadingState = ({
  progress,
  fileName,
}: {
  progress: number;
  fileName: string;
}) => {
  return (
    <div className="text-center w-full max-w-sm">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-primary/10 mb-4">
        <IconCloudUpload className="size-6 text-primary animate-pulse" />
      </div>
      <p className="text-base font-semibold text-foreground mb-2">
        Uploading {fileName}
      </p>
      <div className="w-full mb-2">
        <Progress value={progress} className="h-2" />
      </div>
      <p className="text-sm text-muted-foreground">{progress}% complete</p>
    </div>
  );
};

export const RenderErrorState = ({
  onRetry,
  fileName,
}: {
  onRetry: () => void;
  fileName?: string;
}) => {
  return (
    <div className="text-center">
      <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-destructive/10 mb-4">
        <IconImageInPicture className="size-6 text-destructive" />
      </div>
      <p className="text-base font-semibold text-destructive mb-2">
        Upload failed
      </p>
      {fileName && (
        <p className="text-sm text-muted-foreground mb-3">{fileName}</p>
      )}
      <p className="text-sm text-muted-foreground mb-4">
        Something went wrong. Please try again.
      </p>
      <Button onClick={onRetry} variant="outline" size="sm" className="gap-2">
        <IconRefresh className="size-4" />
        Retry Upload
      </Button>
    </div>
  );
};

export const RenderSuccessState = ({
  objectUrl,
  fileName,
  fileType,
  onDelete,
  isDeleting,
}: {
  objectUrl: string;
  fileName: string;
  fileType: "image" | "video" | "document";
  onDelete: () => void;
  isDeleting: boolean;
}) => {
  return (
    <div className="relative w-full h-full flex flex-col">
      <div className="flex-1 flex items-center justify-center">
        {fileType === "image" ? (
          <img
            src={objectUrl}
            alt={fileName}
            className="max-w-full max-h-40 object-contain rounded-lg"
          />
        ) : fileType === "video" ? (
          <div className="flex flex-col items-center gap-2">
            <IconVideo className="size-12 text-muted-foreground" />
            <p className="text-sm font-medium text-center">{fileName}</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <IconFileText className="size-12 text-muted-foreground" />
            <p className="text-sm font-medium text-center">{fileName}</p>
          </div>
        )}
      </div>

      <div className="absolute top-2 right-2">
        <Button
          onClick={onDelete}
          variant="destructive"
          size="icon"
          className="size-8"
          disabled={isDeleting}
        >
          {isDeleting ? (
            <IconRefresh className="size-4 animate-spin" />
          ) : (
            <IconTrash className="size-4" />
          )}
        </Button>
      </div>

      <div className="mt-2 text-center">
        <p className="text-sm font-medium text-green-600">
          ✓ Upload successful
        </p>
        <p className="text-xs text-muted-foreground truncate">{fileName}</p>
      </div>
    </div>
  );
};

interface MultipleFileState {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  key?: string;
  error: boolean;
  uploaded: boolean;
}

export const RenderMultipleFilesState = ({
  files,
  onRetry,
  onDelete,
  isDragActive,
}: {
  files: MultipleFileState[];
  onRetry: (fileId: string) => void;
  onDelete: (fileId: string) => void;
  isDragActive: boolean;
}) => {
  if (files.length === 0) {
    return <RenderEmptyState isDragActive={isDragActive} fileType="document" />;
  }

  return (
    <div className="w-full space-y-4">
      {/* Upload area */}
      <div className="text-center border-b pb-4">
        <div className="flex items-center mx-auto justify-center size-12 rounded-full bg-muted mb-4">
          <IconCloudUpload
            className={cn(
              "size-6 text-muted-foreground",
              isDragActive && "text-primary"
            )}
          />
        </div>
        <p className="text-sm font-medium text-foreground cursor-pointer">
          Drop more PDF files here or{" "}
          <span className="text-primary font-bold">click to upload</span>
        </p>
      </div>

      {/* Files list */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {files.map((file) => (
          <div
            key={file.id}
            className="flex items-center justify-between p-3 bg-muted rounded-lg"
          >
            <div className="flex items-center gap-2 flex-1 min-w-0">
              <IconFileText className="w-4 h-4 text-red-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-2">
              {file.uploading && (
                <div className="w-16">
                  <Progress value={file.progress} className="h-1" />
                </div>
              )}

              {file.uploaded && (
                <span className="text-xs text-green-600 font-medium">
                  ✓ Done
                </span>
              )}

              {file.error && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => onRetry(file.id)}
                  className="text-orange-600 hover:text-orange-700 p-1"
                >
                  <IconRefresh className="w-3 h-3" />
                </Button>
              )}

              {(file.uploaded || file.error) && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                  className="text-destructive hover:text-destructive p-1"
                >
                  <IconX className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
