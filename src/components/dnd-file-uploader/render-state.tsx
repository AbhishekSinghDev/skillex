import { cn } from "@/lib/utils";
import { IconCloudUpload, IconImageInPicture } from "@tabler/icons-react";
import { Button } from "../ui/button";

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
      <Button className="mt-4" type="button">
        Select File
      </Button>
    </div>
  );
};

export const RenderErrorState = () => {
  return (
    <div className="text-destructive text-center">
      <IconImageInPicture className="size-10 mx-auto mb-3" />
      <p className="text-base font-semibold">
        Something went wrong. Please try again.
      </p>
    </div>
  );
};
