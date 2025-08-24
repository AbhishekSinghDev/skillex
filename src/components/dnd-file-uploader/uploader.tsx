"use client";

import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Card, CardContent } from "../ui/card";
import {
  RenderEmptyState,
  RenderErrorState,
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
  fileType: "image" | "video";
}

interface DNDFileUploaderProps {
  value?: string;
  onChange?: (value: string) => void;
}

const DNDFileUploader = ({ value, onChange }: DNDFileUploaderProps) => {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    isDeleting: false,
    objectUrl: undefined,
    fileType: "image",
    key: value,
  });

  const uploadFile = async (file: File) => {
    setFileState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
      error: false,
    }));

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
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));

        return;
      }

      const { presignedUrl, key } = await presignedResponse.json();

      // 2. Upload the file to S3 with progress tracking
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const percentCompleted = (event.loaded / event.total) * 100;

            setFileState((prev) => ({
              ...prev,
              progress: Math.round(percentCompleted),
            }));
          }
        };

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              uploading: false,
              progress: 100,
              key: key,
            }));

            onChange?.(key);

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
      setFileState((prev) => ({
        ...prev,
        progress: 0,
        error: true,
        uploading: false,
      }));
    }
  };

  const deleteFile = async () => {
    if (!fileState.key || fileState.isDeleting || !fileState.objectUrl) return;

    setFileState((prev) => ({
      ...prev,
      isDeleting: true,
    }));

    try {
      const response = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "app lication/json",
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
        fileType: "image",
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
  };

  const retryUpload = () => {
    if (fileState.file) {
      uploadFile(fileState.file);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }

      const file = acceptedFiles[0];
      const fileType = file.type.startsWith("image/") ? "image" : "video";

      setFileState({
        file: file,
        uploading: false,
        progress: 0,
        objectUrl: URL.createObjectURL(file),
        error: false,
        id: uuid(),
        isDeleting: false,
        fileType,
      });

      uploadFile(file);
    },
    [fileState.objectUrl]
  );

  const rejectedFiles = (fileRejections: FileRejection[]) => {
    fileRejections.forEach(({ file, errors }) => {
      errors.forEach((error) => {
        toast.error(`File ${file.name} rejected: ${error.message}`);
      });
    });
  };

  const renderContent = () => {
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
          onRetry={retryUpload}
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
          onDelete={deleteFile}
          isDeleting={fileState.isDeleting}
        />
      );
    }

    return <RenderEmptyState isDragActive={isDragActive} />;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    maxFiles: 1,
    multiple: false,
    maxSize: 10485760, // 10 MB
    onDropRejected(fileRejections) {
      rejectedFiles(fileRejections);
    },
    disabled:
      fileState.uploading || fileState.isDeleting || !!fileState.objectUrl,
  });

  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);

  const isInteractive =
    !fileState.uploading && !fileState.isDeleting && !fileState.objectUrl;

  return (
    <Card
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
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
