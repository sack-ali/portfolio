import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import GuideSection from "@/components/MotionCharacter";
import ProjectArchaeology from "@/components/ProjectArchaeology";
import TechDNA from "@/components/TechDNA";
import ProofOfDepth from "@/components/ProofOfDepth";
import Terminal from "@/components/Terminal";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="grid-bg">
        <Hero />
        <GuideSection />
        <ProjectArchaeology />
        <TechDNA />
        <ProofOfDepth />
        <Terminal />
      </main>
    </>
  );
}
