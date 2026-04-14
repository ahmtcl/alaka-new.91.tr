"use client";

import { useState } from "react";
import { Carousel } from "@/components/ui/Carousel";
import type { Program } from "@/types";

interface ProgramCardProps {
  program: Program;
  onYoutubeClick: (url: string) => void;
}

export function ProgramCard({ program, onYoutubeClick }: ProgramCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <article
      id={`post-${program.id}`}
      className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] flex flex-col"
    >
      {/* Carousel */}
      <Carousel
        images={program.images}
        alt={program.title}
        aspectRatio="aspect-square"
        objectPosition="object-center"
        onSlideClick={() => onYoutubeClick(program.youtubeUrl)}
      />

      {/* Content */}
      <div className="px-4 pt-3.5 pb-1">
        <p className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-muted mb-2">
          — {program.title} —
        </p>
        {program.taglines.map((line, i) => (
          <p key={i} className="text-[0.95rem] font-medium text-dark leading-relaxed m-0">
            {line}
          </p>
        ))}
      </div>

      {/* Details toggle */}
      <div className="px-4 pb-4 mt-auto">
        <button
          onClick={() => setExpanded(!expanded)}
          className={`bg-transparent border-b border-muted rounded-none text-muted cursor-pointer text-[0.7rem] py-0 px-0 pb-[2px] font-primary tracking-[0.1em] uppercase font-medium transition-colors hover:text-dark hover:border-dark ${
            expanded ? "text-dark border-dark" : ""
          }`}
        >
          {expanded ? "Daha Az" : "Daha Fazla"}
        </button>

        {expanded && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-fade-in">
            {program.details.description.map((p, i) => (
              <p key={i} className="text-[0.85rem] text-muted leading-relaxed mb-2">
                {p}
              </p>
            ))}
            {program.details.presenter && (
              <p className="text-[0.8rem] text-gray-500 mt-3">
                <strong>Hazırlayan & Sunan:</strong> {program.details.presenter}
              </p>
            )}
            {program.details.duration && (
              <p className="text-[0.8rem] text-gray-500">
                <strong>Süre:</strong> {program.details.duration}
              </p>
            )}
            {program.details.format && (
              <p className="text-[0.8rem] text-gray-500">
                <strong>Format:</strong> {program.details.format}
              </p>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
