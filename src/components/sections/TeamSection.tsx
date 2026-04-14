"use client";

import { team } from "@/data/team";
import { TeamCard } from "@/components/cards/TeamCard";
import { SectionHead } from "@/components/ui/SectionHead";

export function TeamSection() {
  return (
    <section className="py-32 px-8 bg-light" id="oku">
      <div className="max-w-[1300px] mx-auto">
        <SectionHead>OKU</SectionHead>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-16 mt-16">
          {team.map((member) => (
            <TeamCard key={member.name} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
