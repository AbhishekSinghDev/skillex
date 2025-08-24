import { cn } from "@/lib/utils";
import {
  IconCloudUpload,
  IconImageInPicture,
  IconRefresh,
  IconTrash,
  IconVideo,
} from "@tabler/icons-react";
import { Button } from "../ui/button";
import { Progress } from "../ui/progress";

export const RenderEmptyState = ({
  isDragActive,
}: {
  isDragActive: boolean;
}) => {
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
        Drop your files here or{" "}
        <span className="text-primary font-bold">click to upload</span>
      </p>
      <p className="text-sm text-muted-foreground mt-1">
        Images and videos up to 10MB
      </p>
      <Button className="mt-4" type="button">
        Select File
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
  fileType: "image" | "video";
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
        ) : (
          <div className="flex flex-col items-center gap-2">
            <IconVideo className="size-12 text-muted-foreground" />
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
