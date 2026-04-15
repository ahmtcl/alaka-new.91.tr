import { HeroSection } from "@/components/sections/HeroSection";
import { StatementDivider } from "@/components/sections/StatementDivider";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { UpcomingSection } from "@/components/sections/UpcomingSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ContactSection } from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatementDivider />
      <ProgramsSection />
      <ManifestoSection />
      <UpcomingSection />
      <TeamSection />
      <ContactSection />
    </>
  );
}
