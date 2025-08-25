"use client";

import RichTextRenderer from "@/components/rich-text-editor/renderer";
import PDFViewer from "@/components/shared/pdf-viewer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ListNote } from "@/lib/type";
import { constructFileUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Eye, FileText } from "lucide-react";
import ErrorState from "./error-state";
import NoteContentSkeleton from "./note-content-skeleton";

const fetchNoteContent = async (slug: string): Promise<{ note: ListNote }> => {
  const response = await fetch(`/api/note?slug=${slug}`);
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

const NoteContent = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["noteContent", slug],
    queryFn: () => fetchNoteContent(slug),
    retry: 1,
  });

  const isMobile = useIsMobile();

  if (isLoading) return <NoteContentSkeleton />;
  if (error) return <ErrorState message={error.message} />;
  if (!data?.note)
    return <ErrorState message="Note content is not available." />;

  const { note } = data;
  const pdfAttachments =
    note.attachments?.filter((attachment) =>
      attachment.fileKey?.toLowerCase().endsWith(".pdf")
    ) || [];

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <header className="space-y-4 border-b pb-6">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
            {note.title}
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>Created {formatDate(note.createdAt)}</span>
            </div>

            {note.updatedAt && note.updatedAt !== note.createdAt && (
              <div className="flex items-center gap-1">
                <FileText className="h-4 w-4" />
                <span>Updated {formatDate(note.updatedAt)}</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  note.isPublished
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                }`}
              >
                {note.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Content Section */}
      <section className="space-y-6">
        <div className="prose-container">
          {note.content ? (
            <RichTextRenderer
              content={note.content}
              className="prose-lg max-w-none"
            />
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No content available for this note.</p>
            </div>
          )}
        </div>
      </section>

      {/* Attachments Section */}
      {note.attachments && note.attachments.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold text-foreground flex items-center gap-2">
              <FileText className="h-6 w-6" />
              Attachments ({note.attachments.length})
            </h2>
          </div>

          {pdfAttachments.length > 0 ? (
            <div className="space-y-6">
              {pdfAttachments.map((attachment, index) => (
                <div key={attachment.id} className="space-y-4">
                  <PDFViewer
                    pdfUrl={constructFileUrl(attachment.fileKey)}
                    width="100%"
                    height={isMobile ? 500 : 1000}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground border border-dashed rounded-lg">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No PDF attachments available for this note.</p>
              {note.attachments.length > 0 && (
                <p className="text-sm mt-2">
                  This note has {note.attachments.length} non-PDF attachment(s).
                </p>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
};

export default NoteContent;
