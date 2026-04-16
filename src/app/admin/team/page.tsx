"use client";

import { useEffect, useState } from "react";
import {
  getTeamMembers,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
  uploadFile,
  type FirestoreTeamMember,
} from "@/lib/firestore";
import { Toast } from "@/components/ui/Toast";

function TeamForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FirestoreTeamMember;
  onSave: (msg: string) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [bio, setBio] = useState(initial?.bio ?? "");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [existingImage, setExistingImage] = useState(initial?.image ?? "");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let imageUrl = existingImage;

      if (newFile) {
        const path = `team/${Date.now()}-${newFile.name}`;
        imageUrl = await uploadFile(newFile, path);
      }

      const data: Omit<FirestoreTeamMember, "id"> = {
        name,
        role,
        bio,
        image: imageUrl,
        order,
      };

      if (initial?.id) {
        await updateTeamMember(initial.id, data);
        onSave("Ekip üyesi güncellendi!");
      } else {
        await addTeamMember(data);
        onSave("Ekip üyesi eklendi!");
      }
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">İsim</label>
          <input
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Pozisyon</label>
          <input
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      <div>
        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Sıra</label>
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-32 bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
        />
      </div>

      <div>
        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Bio</label>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={4}
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-y"
        />
      </div>

      {/* Image */}
      {existingImage && (
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Mevcut Fotoğraf</label>
          <img src={existingImage} alt="" className="w-24 h-24 object-cover rounded" />
        </div>
      )}

      <div>
        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
          {existingImage ? "Yeni Fotoğraf" : "Fotoğraf"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
          className="text-white/60 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-white/10 file:text-white/70 hover:file:bg-white/20"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={saving}
          className="bg-white text-black px-6 py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Kaydediliyor..." : initial?.id ? "Güncelle" : "Ekle"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="bg-white/10 text-white px-6 py-2.5 rounded text-sm hover:bg-white/20 transition-colors"
        >
          İptal
        </button>
      </div>
    </form>
  );
}

export default function TeamAdmin() {
  const [members, setMembers] = useState<FirestoreTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FirestoreTeamMember | null>(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getTeamMembers();
    setMembers(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu üyeyi silmek istediğinize emin misiniz?")) return;
    await deleteTeamMember(id);
    setToast({ message: "Ekip üyesi silindi.", type: "success" });
    load();
  };

  if (adding) {
    return (
      <div>
        <h1 className="text-white text-2xl font-light tracking-wider mb-8">Yeni Ekip Üyesi Ekle</h1>
        <TeamForm
          onSave={(msg) => { setAdding(false); load(); setToast({ message: msg, type: "success" }); }}
          onCancel={() => setAdding(false)}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <h1 className="text-white text-2xl font-light tracking-wider mb-8">Ekip Üyesi Düzenle</h1>
        <TeamForm
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
        <h1 className="text-white text-2xl font-light tracking-wider">Ekip Yönetimi</h1>
        <button
          onClick={() => setAdding(true)}
          className="bg-white text-black px-5 py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors"
        >
          + Yeni Üye
        </button>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Yükleniyor...</p>
      ) : members.length === 0 ? (
        <p className="text-white/40 text-sm">Henüz ekip üyesi eklenmemiş.</p>
      ) : (
        <div className="space-y-3">
          {members.map((m) => (
            <div
              key={m.id}
              className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                {m.image && (
                  <img src={m.image} alt="" className="w-12 h-12 object-cover rounded-full" />
                )}
                <div>
                  <h3 className="text-white font-medium">{m.name}</h3>
                  <p className="text-white/40 text-sm mt-0.5">{m.role}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(m)}
                  className="px-4 py-2 text-sm bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(m.id!)}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
