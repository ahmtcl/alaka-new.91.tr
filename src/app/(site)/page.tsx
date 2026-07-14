import { HeroSection } from "@/components/sections/HeroSection";
import { StatementDivider } from "@/components/sections/StatementDivider";
import { ProgramsSection } from "@/components/sections/ProgramsSection";
import { ManifestoSection } from "@/components/sections/ManifestoSection";
import { UpcomingSection } from "@/components/sections/UpcomingSection";
import { TeamSection } from "@/components/sections/TeamSection";
import { ContactSection } from "@/components/sections/ContactSection";
import { getSectionVisibility } from "@/lib/firestore";

export const dynamic = "force-dynamic";

export default async function Home() {
  const vis = await getSectionVisibility();

  return (
    <>
      {vis.hero && <HeroSection />}
      <StatementDivider />
      {vis.programs && <ProgramsSection />}
      {vis.team && <TeamSection />}
      {(vis.manifesto || !vis.team) && <ManifestoSection id={!vis.team ? "oku" : undefined} />}
      {vis.upcoming && <UpcomingSection />}
      {vis.contact && <ContactSection />}
    </>
  );
}
