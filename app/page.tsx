import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import HomeCoreSection from "@/components/home-v2/HomeCoreSection";
import HomeEventsSection from "@/components/home-v2/HomeEventsSection";
import HomeFeaturedSection from "@/components/home-v2/HomeFeaturedSection";
import HomeProjectsSection from "@/components/home-v2/HomeProjectsSection";
import HomeV2Hero from "@/components/home-v2/HomeV2Hero";

export const revalidate = 60;

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10">
        <HomeV2Hero />
        <HomeFeaturedSection />
        <HomeCoreSection />
        <HomeProjectsSection />
        <HomeEventsSection />
      </main>
      <Footer />
    </>
  );
}
