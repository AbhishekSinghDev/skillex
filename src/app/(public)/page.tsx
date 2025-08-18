import Footer from "@/components/landing-page/footer";
import Header from "@/components/landing-page/header";
import Hero from "@/components/landing-page/hero";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-[#111111]">
      <Header />
      <div className="pt-4 max-w-2xl mx-auto px-4">
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
