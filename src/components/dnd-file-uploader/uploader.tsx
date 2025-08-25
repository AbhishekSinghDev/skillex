"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import {
  RenderEmptyState,
  RenderErrorState,
  RenderMultipleFilesState,
  RenderSuccessState,
  RenderUploadingState,
} from "./render-state";

import { v4 as uuid } from "uuid";

interface UploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video" | "document";
}

interface MultipleFileState {
  id: string;
  file: File;
  uploading: boolean;
  progress: number;
  key?: string;
  error: boolean;
  uploaded: boolean;
}

interface DNDFileUploaderProps {
  value?: string;
  onChange?: (value: string, fileName?: string, fileSize?: number) => void;
  fileType: "image" | "video" | "document";
}

const DNDFileUploader = ({
  value,
  onChange,
  fileType,
}: DNDFileUploaderProps) => {
  // Single file state (for image/video)
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    objectUrl: undefined,
    fileType: fileType,
    key: value,
  });

  // Multiple files state (for documents)
  const [multipleFiles, setMultipleFiles] = useState<MultipleFileState[]>([]);

  const isMultipleMode = fileType === "document";

  const uploadFile = async (file: File, fileId?: string) => {
    if (isMultipleMode && fileId) {
      setMultipleFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? { ...f, uploading: true, progress: 0, error: false }
            : f
        )
      );
    } else {
      setFileState((prev) => ({
        ...prev,
        uploading: true,
        progress: 0,
        error: false,
      }));
    }

    try {
      // 1. Request a presigned URL from the backend
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          fileSize: file.size,
          isImage: file.type.startsWith("image/"),
        }),
      });

      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");

        if (isMultipleMode && fileId) {
          setMultipleFiles((prev) =>
            prev.map((f) =>
              f.id === fileId
                ? { ...f, uploading: false, progress: 0, error: true }
                : f
            )
          );
        } else {
          setFileState((prev) => ({
            ...prev,
            uploading: false,
            progress: 0,
            error: true,
          }));
        }
        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      // 2. Upload the file to S3 with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentCompleted = (event.loaded / event.total) * 100;

            if (isMultipleMode && fileId) {
              setMultipleFiles((prev) =>
                prev.map((f) =>
                  f.id === fileId
                    ? { ...f, progress: Math.round(percentCompleted) }
                    : f
                )
              );
            } else {
              setFileState((prev) => ({
                ...prev,
                progress: Math.round(percentCompleted),
              }));
            }
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            if (isMultipleMode && fileId) {
              setMultipleFiles((prev) =>
                prev.map((f) =>
                  f.id === fileId
                    ? {
                        ...f,
                        uploading: false,
                        progress: 100,
                        key: key,
                        uploaded: true,
                      }
                    : f
                )
              );
              onChange?.(key, file.name, file.size);
            } else {
              setFileState((prev) => ({
                ...prev,
                uploading: false,
                progress: 100,
                key: key,
              }));
              onChange?.(key);
            }

            toast.success("File uploaded successfully");
            resolve();
          } else {
            reject(new Error(`Upload failed with status: ${xhr.status}`));
          }
        };

        xhr.onerror = () => {
          console.error("XMLHttpRequest error");
          reject(new Error("Upload failed..."));
        };

        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      console.error("File upload failed:", error);
      toast.error("Something went wrong");

      if (isMultipleMode && fileId) {
        setMultipleFiles((prev) =>
          prev.map((f) =>
            f.id === fileId
              ? { ...f, progress: 0, error: true, uploading: false }
              : f
          )
        );
      } else {
        setFileState((prev) => ({
          ...prev,
          progress: 0,
          error: true,
          uploading: false,
        }));
      }
    }
  };

  const deleteFile = async (fileId?: string) => {
    if (isMultipleMode && fileId) {
      const fileToDelete = multipleFiles.find((f) => f.id === fileId);
      if (!fileToDelete?.key) return;

      try {
        const response = await fetch("/api/s3/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: fileToDelete.key,
          }),
        });

        if (!response.ok) {
          toast.error("Failed to delete file");
          return;
        }

        setMultipleFiles((prev) => prev.filter((f) => f.id !== fileId));
        toast.success("File deleted successfully");
      } catch (error) {
        console.error("File deletion failed:", error);
        toast.error("Failed to delete file");
      }
    } else {
      if (!fileState.key || fileState.isDeleting || !fileState.objectUrl)
        return;

      setFileState((prev) => ({
        ...prev,
        isDeleting: true,
      }));

      try {
        const response = await fetch("/api/s3/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            key: fileState.key,
          }),
        });

        if (!response.ok) {
          toast.error("Failed to delete file");
          return;
        }

        // Clean up object URL
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        onChange?.(fileState.key);

        setFileState({
          error: false,
          file: null,
          id: null,
          uploading: false,
          progress: 0,
          isDeleting: false,
          objectUrl: undefined,
          fileType: fileType,
        });

        toast.success("File deleted successfully");
      } catch (error) {
        console.error("File deletion failed:", error);
        toast.error("Failed to delete file");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
        }));
      }
    }
  };

  const retryUpload = (fileId?: string) => {
    if (isMultipleMode && fileId) {
      const fileToRetry = multipleFiles.find((f) => f.id === fileId);
      if (fileToRetry) {
        uploadFile(fileToRetry.file, fileId);
      }
    } else if (fileState.file) {
      uploadFile(fileState.file);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (isMultipleMode) {
        // Handle multiple files for documents
        const newFiles: MultipleFileState[] = acceptedFiles.map((file) => ({
          id: uuid(),
          file: file,
          uploading: false,
          progress: 0,
          error: false,
          uploaded: false,
        }));

        setMultipleFiles((prev) => [...prev, ...newFiles]);

        // Upload all files
        newFiles.forEach((fileState) => {
          uploadFile(fileState.file, fileState.id);
        });
      } else {
        // Handle single file for images/videos
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        const file = acceptedFiles[0];
        const fileTypeDetected = file.type.startsWith("image/")
          ? "image"
          : "video";

        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuid(),
          isDeleting: false,
          fileType: fileTypeDetected,
        });

        uploadFile(file);
      }
    },
    [fileState.objectUrl, isMultipleMode, multipleFiles]
  );

  const rejectedFiles = (fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((error) => {
        toast.error(`File ${file.name} rejected: ${error.message}`);
      });
    });
  };

  const renderContent = () => {
    if (isMultipleMode) {
      return (
        <RenderMultipleFilesState
          files={multipleFiles}
          onRetry={retryUpload}
          onDelete={deleteFile}
          isDragActive={isDragActive}
        />
      );
    }

    // Single file mode rendering (existing logic)
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          fileName={fileState.file?.name || ""}
        />
      );
    }

    if (fileState.error) {
      return (
        <RenderErrorState
          onRetry={() => retryUpload()}
          fileName={fileState.file?.name}
        />
      );
    }

    if (fileState.objectUrl && fileState.key) {
      return (
        <RenderSuccessState
          objectUrl={fileState.objectUrl}
          fileName={fileState.file?.name || ""}
          fileType={fileState.fileType}
          onDelete={() => deleteFile()}
          isDeleting={fileState.isDeleting}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} fileType={fileType} />;
  };

  const getAcceptedTypes = () => {
    switch (fileType) {
      case "image":
        return { "image/*": [] };
      case "video":
        return { "video/*": [] };
      case "document":
        return { "application/pdf": [".pdf"] };
      default:
        return {
          "image/*": [],
          "video/*": [],
          "application/pdf": [".pdf"],
        };
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    // @ts-ignore
    accept: getAcceptedTypes(),
    maxFiles: isMultipleMode ? undefined : 1,
    multiple: isMultipleMode,
    maxSize: 10485760, // 10 MB
    onDropRejected(fileRejections) {
      rejectedFiles(fileRejections);
    },
    disabled:
      !isMultipleMode &&
      (fileState.uploading || fileState.isDeleting || !!fileState.objectUrl),
  });

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const isInteractive =
    isMultipleMode ||
    (!fileState.uploading && !fileState.isDeleting && !fileState.objectUrl);

  return (
    <Card
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full",
        isMultipleMode ? "min-h-64" : "h-64",
        isDragActive && isInteractive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary",
        !isInteractive && "cursor-default"
      )}
      {...(isInteractive ? getRootProps() : {})}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        {isInteractive && <input {...getInputProps()} />}
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default DNDFileUploader;
