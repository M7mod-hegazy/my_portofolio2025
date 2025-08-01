import { Navigation } from "@/components/Navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { HeroSection } from "@/components/sections/HeroSection";
import { AboutSection } from "@/components/sections/AboutSection";
import { ProjectsSection } from "@/components/sections/ProjectsSection";
import { CertificationsSection } from "@/components/sections/CertificationsSection";
import { RoadmapSection } from "@/components/sections/RoadmapSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { Footer } from "@/components/sections/Footer";
import { AnimatedPage } from "@/components/AnimatedPage";
import { AnimatedSection } from "@/components/AnimatedSection";

const Index = () => {
  return (
    <AnimatedPage>
      <div className="min-h-screen">
        <Navigation />
        <ThemeToggle />

        <main>
          <AnimatedSection>
            <HeroSection />
          </AnimatedSection>
          <AnimatedSection>
            <AboutSection />
          </AnimatedSection>
          <AnimatedSection>
            <RoadmapSection />
          </AnimatedSection>
          <AnimatedSection>
            <ProjectsSection />
          </AnimatedSection>
          <AnimatedSection>
            <CertificationsSection />
          </AnimatedSection>
          <AnimatedSection>
            <ContactSection />
          </AnimatedSection>
        </main>

        <Footer />
      </div>
    </AnimatedPage>
  );
};

export default Index;
