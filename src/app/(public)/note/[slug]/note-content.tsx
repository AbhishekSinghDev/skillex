"use client";

import PDFViewer from "@/components/shared/pdf-viewer";
import { ListNote } from "@/lib/type";
import { constructFileUrl } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

const fetchNoteContent = async (slug: string): Promise<{ note: ListNote }> => {
  const response = await fetch(`/api/note?slug=${slug}`);
  if (!response.ok) {
    throw new Error("Failed to fetch note content");
  }
  const data = await response.json();
  return data;
};

const NoteContent = ({ slug }: { slug: string }) => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["noteContent", slug],
    queryFn: () => fetchNoteContent(slug),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const pdfUrl = constructFileUrl(data?.note.attachments[1]?.fileKey || "");

  return (
    <div>
      NoteContent {slug}: {JSON.stringify(data)}
      <PDFViewer pdfUrl={pdfUrl} width="800px" height={600} />
    </div>
  );
};

export default NoteContent;
