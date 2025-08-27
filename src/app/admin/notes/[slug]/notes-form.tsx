"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  FileText,
  Link,
  Loader2,
  Paperclip,
  Type,
  X,
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
import { ListNote } from "@/lib/type";
import { generateSlug } from "@/lib/utils";
import { NoteCreationSchema } from "@/lib/zod-schema";
import { IconSparkles } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface NotesFormProps {
  slug: string;
}

const fetchNoteContent = async (slug: string): Promise<{ note: ListNote }> => {
  const response = await fetch(`/api/admin/note/by-slug?slug=${slug}`);
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(
        "Note not found. The requested note may have been deleted or moved."
      );
    }
    if (response.status === 403) {
      throw new Error(
        "Access denied. You don't have permission to view this note."
      );
    }
    throw new Error("Failed to load note content. Please try again later.");
  }
  const data = await response.json();
  return data;
};

const NotesForm = ({ slug }: NotesFormProps) => {
  const [noteId, setNoteId] = useState<string | null>(null);
  const editorRef = useRef<any>(null);
  const queryClient = useQueryClient();

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

  const { data, isError, isLoading } = useQuery({
    queryKey: ["adminNoteContent", slug],
    queryFn: () => fetchNoteContent(slug),
    retry: 1,
  });

  const { mutate: updateNote, isPending: isUpdatingNote } = useMutation({
    mutationKey: ["update-note"],
    mutationFn: async (
      data: z.infer<typeof NoteCreationSchema> & { id: string }
    ) => {
      const response = await fetch("/api/admin/note/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update note");
      }

      return response.json();
    },
  });

  const { mutate: deleteAttachment, isPending: isDeletingAttachment } =
    useMutation({
      mutationKey: ["delete-attachment"],
      mutationFn: async (attachmentId: string) => {
        const response = await fetch("/api/admin/note/attachment/delete", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            attachmentId,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to delete attachment");
        }

        return response.json();
      },
      onSuccess: () => {
        toast.success("Attachment deleted successfully");
        // Invalidate and refetch the note data
        queryClient.invalidateQueries({ queryKey: ["adminNoteContent", slug] });
      },
      onError: () => {
        toast.error("Failed to delete attachment");
      },
    });

  const onSubmit = (values: z.infer<typeof NoteCreationSchema>) => {
    if (noteId) {
      updateNote(
        { ...values, id: noteId },
        {
          onSuccess: () => {
            toast.success("Note updated successfully!");
          },
          onError: () => {
            toast.error("Failed to update note");
          },
        }
      );
    }
  };

  const deleteFile = async (attachmentId: string) => {
    deleteAttachment(attachmentId);
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

  useEffect(() => {
    console.log(data?.note);

    if (data?.note) {
      setNoteId(data.note.id);

      const noteContent =
        typeof data.note.content === "string"
          ? JSON.parse(data.note.content)
          : data.note.content;

      form.reset({
        title: data.note.title,
        content: JSON.stringify(noteContent),
        slug: data.note.slug,
        isPublished: data.note.isPublished,
        attachments:
          data.note.attachments?.map((att) => ({
            fileName: att.fileName,
            fileKey: att.fileKey,
            fileSize: Number(att.fileSize),
          })) || [],
      });

      // Manually set editor content
      if (editorRef.current) {
        editorRef.current.commands.setContent(noteContent);
      }
    }
  }, [data, form]);

  if (isLoading) return <div>Loading note data...</div>;
  if (isError) return <div>Error loading note data</div>;

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
                  and hyphens only. (Cannot be changed after creation)
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
                    ref={editorRef}
                    value={field.value}
                    onChange={field.onChange}
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

          {/* Render Attachments */}
          {data?.note?.attachments && data.note.attachments.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Current Attachments</h4>
              {data.note.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between border p-2 rounded"
                >
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4" />
                    <span className="text-sm line-clamp-1">
                      {attachment.fileName}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({Math.round(Number(attachment.fileSize) / 1024)} KB)
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => deleteFile(attachment.id)}
                    disabled={isDeletingAttachment}
                  >
                    <span className="sr-only">Remove attachment</span>
                    {isDeletingAttachment ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <X className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

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
              disabled={isUpdatingNote}
            >
              {isUpdatingNote && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isUpdatingNote ? "Updating..." : "Update Note"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NotesForm;
