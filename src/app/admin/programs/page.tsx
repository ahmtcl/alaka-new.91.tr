"use client";

import { useEffect, useState } from "react";
import {
  getPrograms,
  addProgram,
  updateProgram,
  deleteProgram,
  uploadFile,
  type FirestoreProgram,
} from "@/lib/firestore";

function ProgramForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FirestoreProgram;
  onSave: () => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [taglines, setTaglines] = useState(initial?.taglines?.join("\n") ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeUrl ?? "");
  const [presenter, setPresenter] = useState(initial?.presenter ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [format, setFormat] = useState(initial?.format ?? "");
  const [description, setDescription] = useState(initial?.description?.join("\n\n") ?? "");
  const [existingImages, setExistingImages] = useState<string[]>(initial?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [order, setOrder] = useState(initial?.order ?? 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Upload new images
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const path = `programs/${Date.now()}-${file.name}`;
        const url = await uploadFile(file, path);
        uploadedUrls.push(url);
      }

      const data: Omit<FirestoreProgram, "id"> = {
        title,
        category,
        taglines: taglines.split("\n").filter(Boolean),
        youtubeUrl,
        presenter,
        duration,
        format: format || undefined,
        description: description.split("\n\n").filter(Boolean),
        images: [...existingImages, ...uploadedUrls],
        order,
      };

      if (initial?.id) {
        await updateProgram(initial.id, data);
      } else {
        await addProgram(data);
      }
      onSave();
    } catch (err) {
      console.error(err);
      alert("Hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      <div className="grid grid-cols-2 gap-4">
        <Field label="Başlık" value={title} onChange={setTitle} required />
        <Field label="Kategori" value={category} onChange={setCategory} required />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Sunucu" value={presenter} onChange={setPresenter} />
        <Field label="Süre" value={duration} onChange={setDuration} />
        <Field label="Sıra" value={String(order)} onChange={(v) => setOrder(Number(v))} type="number" />
      </div>
      <Field label="Format" value={format} onChange={setFormat} />
      <Field label="YouTube URL" value={youtubeUrl} onChange={setYoutubeUrl} />
      <FieldTextarea label="Tagline'lar (her satır bir tagline)" value={taglines} onChange={setTaglines} rows={3} />
      <FieldTextarea label="Açıklama (paragrafları boş satırla ayırın)" value={description} onChange={setDescription} rows={6} />

      {/* Existing images */}
      {existingImages.length > 0 && (
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Mevcut Görseller</label>
          <div className="flex gap-2 flex-wrap">
            {existingImages.map((url, i) => (
              <div key={i} className="relative group">
                <img src={url} alt="" className="w-20 h-20 object-cover rounded" />
                <button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New images */}
      <div>
        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Yeni Görsel Ekle</label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setNewFiles(Array.from(e.target.files ?? []))}
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

function Field({
  label,
  value,
  onChange,
  required,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  type?: string;
}) {
  return (
    <div>
      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">{label}</label>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
      />
    </div>
  );
}

function FieldTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
}) {
  return (
    <div>
      <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-y"
      />
    </div>
  );
}

export default function ProgramsAdmin() {
  const [programs, setPrograms] = useState<FirestoreProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FirestoreProgram | null>(null);
  const [adding, setAdding] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getPrograms();
    setPrograms(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu programı silmek istediğinize emin misiniz?")) return;
    await deleteProgram(id);
    load();
  };

  if (adding) {
    return (
      <div>
        <h1 className="text-white text-2xl font-light tracking-wider mb-8">Yeni Program Ekle</h1>
        <ProgramForm
          onSave={() => { setAdding(false); load(); }}
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
          onSave={() => { setEditing(null); load(); }}
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

      {loading ? (
        <p className="text-white/40 text-sm">Yükleniyor...</p>
      ) : programs.length === 0 ? (
        <p className="text-white/40 text-sm">Henüz program eklenmemiş.</p>
      ) : (
        <div className="space-y-3">
          {programs.map((p) => (
            <div
              key={p.id}
              className="bg-white/5 border border-white/10 rounded-lg p-5 flex items-center justify-between"
            >
              <div>
                <h3 className="text-white font-medium">{p.title}</h3>
                <p className="text-white/40 text-sm mt-1">
                  {p.category} · {p.presenter || "—"} · {p.duration || "—"}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditing(p)}
                  className="px-4 py-2 text-sm bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(p.id!)}
                  className="px-4 py-2 text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
