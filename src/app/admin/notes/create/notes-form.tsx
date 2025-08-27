"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  FileText,
  Link,
  Loader2,
  Paperclip,
  Type,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import DNDFileUploader from "@/components/dnd-file-uploader/uploader";
import RichTextEditor from "@/components/rich-text-editor/editor";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { generateSlug } from "@/lib/utils";
import { NoteCreationSchema } from "@/lib/zod-schema";
import { IconImageInPicture, IconSparkles } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const NotesForm = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof NoteCreationSchema>>({
    resolver: zodResolver(NoteCreationSchema),
    defaultValues: {
      title: "",
      content: "<p>Start writing your note...</p>",
      slug: "",
      isPublished: false,
      attachments: [],
    },
  });

  const { mutate: createNote, isPending: isCreatingNote } = useMutation({
    mutationKey: ["create-note"],
    mutationFn: async (data: z.infer<typeof NoteCreationSchema>) => {
      const response = await fetch("/api/admin/note/create", {
        method: "POST",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      return response.json();
    },
  });

  const onSubmit = (values: z.infer<typeof NoteCreationSchema>) => {
    createNote(values, {
      onSuccess: () => {
        toast.success("Note created successfully!");
        router.push("/admin/notes");
      },
      onError: () => {
        toast.error("Failed to create note");
      },
    });
  };

  const handleAttachmentAdd = (
    fileKey: string,
    fileName: string,
    fileSize: number
  ) => {
    const currentAttachments = form.getValues("attachments") || [];
    const newAttachment = {
      fileName,
      fileKey,
      fileSize,
    };
    form.setValue("attachments", [...currentAttachments, newAttachment]);
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Title Field */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Type className="w-4 h-4" />
                  Note Title
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter note title"
                    {...field}
                    onChange={(e) => {
                      field.onChange(e);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Slug Field */}
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Link className="w-4 h-4" />
                  URL Slug
                </FormLabel>
                <div className="flex items-center gap-2">
                  <FormControl>
                    <Input placeholder="note-url-slug" {...field} disabled />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      form.setValue(
                        "slug",
                        generateSlug(form.getValues("title"))
                      )
                    }
                  >
                    <IconSparkles />
                    Generate Slug
                  </Button>
                </div>
                <FormDescription>
                  This will be used in the URL. Use lowercase letters, numbers,
                  and hyphens only.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Content Field */}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="w-4 h-4" />
                  Note Content
                </FormLabel>
                <FormControl>
                  <RichTextEditor
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Note Thumbnail */}
          <FormField
            control={form.control}
            name="thumbnailKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <IconImageInPicture className="w-4 h-4" />
                  Note Thumbnail
                </FormLabel>
                <FormControl>
                  <DNDFileUploader
                    value={field.value}
                    onChange={field.onChange}
                    fileType="image"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Attachments Field */}
          <FormField
            control={form.control}
            name="attachments"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center gap-2 text-sm font-medium">
                  <Paperclip className="w-4 h-4" />
                  PDF Attachments
                </FormLabel>
                <FormControl>
                  <DNDFileUploader
                    value=""
                    onChange={(
                      fileKey: string,
                      fileName?: string,
                      fileSize?: number
                    ) => {
                      if (fileKey && fileName && fileSize) {
                        handleAttachmentAdd(fileKey, fileName, fileSize);
                      }
                    }}
                    fileType="document"
                  />
                </FormControl>
                <FormDescription>
                  Upload PDF files as attachments. Maximum file size: 10MB per
                  file.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Published Status */}
          <FormField
            control={form.control}
            name="isPublished"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="flex items-center gap-2 text-sm font-medium">
                    <FileText className="w-4 h-4" />
                    Publish Note
                  </FormLabel>
                  <FormDescription>
                    Make this note visible to users. You can change this later.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="flex justify-end pt-6">
            <Button
              type="submit"
              size="lg"
              className="px-8"
              disabled={isCreatingNote}
            >
              {isCreatingNote && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isCreatingNote ? "Creating..." : "Create Note"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NotesForm;
