import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import BuntyExperience from "@/components/bunty/BuntyExperience";

export const metadata: Metadata = {
  title: "Bunty - e-Yantra AI Assistant | e-Yantra MSIT",
  description: "Meet Bunty, your calm and curious guide to e-Yantra MSIT.",
};

export default function BuntyPage() {
  return (
    <>
      <Navbar />
      <main className="bunty-page">
        <div className="bunty-page-glow" aria-hidden="true" />
        <BuntyExperience />
      </main>
    </>
  );
}
