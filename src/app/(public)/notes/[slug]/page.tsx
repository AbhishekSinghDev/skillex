import NoteContent from "./note-content";

interface NoteDetailPageProps {
  params: Promise<{ slug: string }>;
}

const NoteDetailPage = async ({ params }: NoteDetailPageProps) => {
  const slug = (await params).slug;

  return <NoteContent slug={slug} />;
};

export default NoteDetailPage;
