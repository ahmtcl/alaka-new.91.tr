"use client";

import { useEffect, useState } from "react";
import {
  getPrograms,
  deleteProgram,
  type FirestoreProgram,
} from "@/lib/firestore";
import { ProgramForm } from "@/components/admin/ProgramForm";
import { ProgramList } from "@/components/admin/ProgramList";
import { Toast } from "@/components/ui/Toast";

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState<FirestoreProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FirestoreProgram | null>(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getPrograms();
      setPrograms(data);
    } catch (err) {
      console.error("Programlar yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu programı silmek istediğinize emin misiniz?")) return;
    await deleteProgram(id);
    setToast({ message: "Program silindi.", type: "success" });
    load();
  };

  if (adding) {
    return (
      <div>
        <h1 className="text-white text-2xl font-light tracking-wider mb-8">Yeni Program Ekle</h1>
        <ProgramForm
          onSave={(msg) => { setAdding(false); load(); setToast({ message: msg, type: "success" }); }}
          onCancel={() => setAdding(false)}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <h1 className="text-white text-2xl font-light tracking-wider mb-8">Program Düzenle</h1>
        <ProgramForm
          initial={editing}
          onSave={(msg) => { setEditing(null); load(); setToast({ message: msg, type: "success" }); }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-2xl font-light tracking-wider">Program Yönetimi</h1>
        <button
          onClick={() => setAdding(true)}
          className="bg-white text-black px-5 py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors"
        >
          + Yeni Program
        </button>
      </div>

      <ProgramList
        programs={programs}
        loading={loading}
        onEdit={setEditing}
        onDelete={handleDelete}
      />

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
