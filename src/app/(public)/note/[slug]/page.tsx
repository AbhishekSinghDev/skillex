import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import NoteContent from "./note-content";

interface NoteDetailPageProps {
  params: Promise<{ slug: string }>;
}

const NoteDetailPage = async ({ params }: NoteDetailPageProps) => {
  const slug = (await params).slug;

  return (
    <main className="min-h-screen bg-white dark:bg-[#111111]">
      <Header />
      <div className="pt-4 max-w-2xl mx-auto px-4">
        <NoteContent slug={slug} />
      </div>
      <Footer />
    </main>
  );
};

export default NoteDetailPage;
