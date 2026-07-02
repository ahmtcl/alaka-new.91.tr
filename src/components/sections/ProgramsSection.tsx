"use client";

import { useState } from "react";
import { programs as staticPrograms } from "@/data/programs";
import { usePrograms } from "@/lib/hooks";
import { ProgramCard } from "@/components/cards/ProgramCard";
import { SectionHead } from "@/components/ui/SectionHead";
import type { Program } from "@/types";

export function ProgramsSection() {
  const [youtubeModal, setYoutubeModal] = useState<string | null>(null);
  const { programs: firestorePrograms } = usePrograms();

  // Map Firestore programs to the Program type, fall back to static
  const activeFirestore = firestorePrograms.filter((p) => p.active !== false);
  const programs: Program[] = activeFirestore.length > 0
    ? activeFirestore.map((p) => ({
        id: p.slug || p.id!,
        title: p.title,
        category: p.category,
        taglines: p.taglines,
        images: p.images,
        youtubeUrl: p.youtubeUrl,
        featured: p.featured ?? false,
        details: {
          description: p.description,
          presenter: p.presenter,
          duration: p.duration,
          format: p.format,
        },
      }))
    : staticPrograms;

  return (
    <>
      <section className="pt-[30px] md:pt-16 bg-light" id="bak">
        <SectionHead>BAK</SectionHead>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1200px] mx-auto px-4 mt-[50px]">
          {programs.map((program) => (
            <div key={program.id} id={`post-${program.id}`} className={`h-full ${program.featured ? "sm:col-span-2 lg:col-span-2" : ""}`}>
              <ProgramCard
                program={program}
                onYoutubeClick={(url) => setYoutubeModal(url)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* YouTube Redirect Modal */}
      {youtubeModal && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[9999] flex items-center justify-center opacity-100 transition-opacity"
          onClick={() => setYoutubeModal(null)}
        >
          <div
            className="bg-white p-8 rounded-xl max-w-[400px] w-[90%] text-center shadow-2xl scale-100 transition-transform"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[1.2rem] font-semibold text-dark mb-2">
              YouTube&apos;a Yönlendiriliyorsunuz
            </h3>
            <p className="text-[0.95rem] text-muted mb-6 leading-relaxed">
              Bu bağlantı sizi YouTube&apos;a götürecektir. Devam etmek istiyor musunuz?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setYoutubeModal(null)}
                className="py-3 px-6 rounded-md text-[0.9rem] font-medium cursor-pointer bg-transparent border border-gray-200 text-muted hover:border-dark hover:text-dark transition-colors"
              >
                İptal
              </button>
              <button
                onClick={() => {
                  window.open(youtubeModal, "_blank");
                  setYoutubeModal(null);
                }}
                className="py-3 px-6 rounded-md text-[0.9rem] font-medium cursor-pointer bg-dark border border-dark text-white hover:opacity-90 hover:-translate-y-0.5 transition-all"
              >
                Devam Et
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
