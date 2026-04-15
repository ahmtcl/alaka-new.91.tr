"use client";

import type { FirestoreProgram } from "@/lib/firestore";

interface ProgramListProps {
  programs: FirestoreProgram[];
  loading: boolean;
  onEdit: (program: FirestoreProgram) => void;
  onDelete: (id: string) => void;
}

export function ProgramList({ programs, loading, onEdit, onDelete }: ProgramListProps) {
  if (loading) {
    return <p className="text-white/40 text-sm">Yükleniyor...</p>;
  }

  if (programs.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-white/30 text-lg mb-2">Henüz program eklenmemiş</p>
        <p className="text-white/20 text-sm">Yukarıdaki &quot;+ Yeni Program&quot; butonuyla başlayın.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {programs.map((p) => (
        <div
          key={p.id}
          className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-center justify-between"
        >
          <div className="flex items-center gap-4">
            {p.images?.[0] && (
              <img src={p.images[0]} alt="" className="w-12 h-12 object-cover rounded" />
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-white font-medium">{p.title}</h3>
                {p.featured && (
                  <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded uppercase tracking-wider">
                    Featured
                  </span>
                )}
                {!p.active && (
                  <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider">
                    Pasif
                  </span>
                )}
              </div>
              <p className="text-white/40 text-sm mt-1">
                {p.category} · {p.presenter || "—"} · {p.duration || "—"} · Sıra: {p.order ?? 0}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(p)}
              className="px-4 py-2 text-sm bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
            >
              Düzenle
            </button>
            <button
              onClick={() => {
                if (confirm("Bu programı silmek istediğinize emin misiniz?")) {
                  onDelete(p.id!);
                }
              }}
              className="px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
            >
              Sil
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
