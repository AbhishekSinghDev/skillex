import NotesForm from "./notes-form";

interface NotesUpdatePageProps {
  params: Promise<{ slug: string }>;
}

const NotesUpdatePage = async ({ params }: NotesUpdatePageProps) => {
  const slug = (await params).slug;

  return <NotesForm slug={slug} />;
};

export default NotesUpdatePage;
