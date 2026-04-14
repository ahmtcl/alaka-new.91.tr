"use client";

import { useState } from "react";
import Image from "next/image";
import type { TeamMember } from "@/types";

interface TeamCardProps {
  member: TeamMember;
}

export function TeamCard({ member }: TeamCardProps) {
  const [bioOpen, setBioOpen] = useState(false);

  return (
    <article className="flex flex-col gap-4 h-full">
      {/* Portrait */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted group">
        <Image
          src={member.image}
          alt={member.name}
          fill
          className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-[1.03]"
          sizes="(max-width: 700px) 100vw, (max-width: 1000px) 50vw, 33vw"
          loading="lazy"
        />
      </div>

      {/* Info */}
      <h4 className="text-base font-medium text-dark mt-4">{member.name}</h4>
      <p className="text-[0.75rem] tracking-[0.15em] uppercase text-muted">
        {member.role}
      </p>

      {/* Bio Toggle */}
      <button
        onClick={() => setBioOpen(!bioOpen)}
        className={`inline-flex items-center justify-center mt-auto bg-transparent border border-muted rounded text-muted text-[0.65rem] uppercase tracking-[0.1em] font-medium cursor-pointer py-1.5 px-3.5 transition-all hover:border-dark hover:text-dark hover:bg-black/[0.03] self-start ${
          bioOpen ? "bg-dark text-white border-dark hover:bg-dark hover:text-white" : ""
        }`}
      >
        {bioOpen ? "DAHA AZ" : "DAHA FAZLA"}
      </button>

      {bioOpen && (
        <p className="text-[0.9rem] leading-relaxed text-accent mt-3 animate-fade-in">
          {member.bio}
        </p>
      )}
    </article>
  );
}
