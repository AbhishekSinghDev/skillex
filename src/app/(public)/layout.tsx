import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";

interface PublicRoutesLayoutProps {
  children: React.ReactNode;
}

const PublicRoutesLayout = ({ children }: PublicRoutesLayoutProps) => {
  return (
    <main className="min-h-screen bg-white dark:bg-[#111111]">
      <Header />
      <div className="pt-4 max-w-2xl mx-auto px-4">{children}</div>
      <Footer />
    </main>
  );
};

export default PublicRoutesLayout;
