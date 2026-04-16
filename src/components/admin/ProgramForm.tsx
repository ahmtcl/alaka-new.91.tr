"use client";

import { useState } from "react";
import {
  addProgram,
  updateProgram,
  uploadFile,
  type FirestoreProgram,
} from "@/lib/firestore";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
    .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface ProgramFormProps {
  initial?: FirestoreProgram;
  onSave: (msg: string) => void;
  onCancel: () => void;
}

export function ProgramForm({ initial, onSave, onCancel }: ProgramFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [taglines, setTaglines] = useState(initial?.taglines?.join("\n") ?? "");
  const [youtubeUrl, setYoutubeUrl] = useState(initial?.youtubeUrl ?? "");
  const [presenter, setPresenter] = useState(initial?.presenter ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [format, setFormat] = useState(initial?.format ?? "");
  const [description, setDescription] = useState(initial?.description?.join("\n\n") ?? "");
  const [existingImages, setExistingImages] = useState<string[]>(initial?.images ?? []);
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [featured, setFeatured] = useState(initial?.featured ?? false);
  const [active, setActive] = useState(initial?.active ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!initial?.id) setSlug(slugify(val));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];
      for (const file of newFiles) {
        const path = `programs/${Date.now()}-${file.name}`;
        const url = await uploadFile(file, path);
        uploadedUrls.push(url);
      }

      const data: Omit<FirestoreProgram, "id" | "createdAt"> = {
        title,
        slug: slug || slugify(title),
        category,
        taglines: taglines.split("\n").filter(Boolean),
        youtubeUrl,
        presenter,
        duration,
        format: format || undefined,
        description: description.split("\n\n").filter(Boolean),
        images: [...existingImages, ...uploadedUrls],
        featured,
        active,
        order,
      };

      if (initial?.id) {
        await updateProgram(initial.id, data);
        onSave("Program güncellendi!");
      } else {
        await addProgram(data);
        onSave("Program eklendi!");
      }
    } catch (err) {
      console.error(err);
      setError("Kaydetme sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  const removeExistingImage = (idx: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Başlık" value={title} onChange={handleTitleChange} required />
        <Field label="Slug" value={slug} onChange={setSlug} required />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Kategori" value={category} onChange={setCategory} required />
        <Field label="Sıra" value={String(order)} onChange={(v) => setOrder(Number(v))} type="number" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Sunucu" value={presenter} onChange={setPresenter} />
        <Field label="Süre" value={duration} onChange={setDuration} />
      </div>

      <Field label="Format" value={format} onChange={setFormat} />
      <Field label="YouTube URL" value={youtubeUrl} onChange={setYoutubeUrl} />

      <FieldTextarea label="Tagline'lar (her satır bir tagline)" value={taglines} onChange={setTaglines} rows={3} />
      <FieldTextarea label="Açıklama (paragrafları boş satırla ayırın)" value={description} onChange={setDescription} rows={6} />

      {/* Toggles */}
      <div className="flex gap-8">
        <Toggle label="Öne Çıkan (Featured)" checked={featured} onChange={setFeatured} />
        <Toggle label="Aktif" checked={active} onChange={setActive} />
      </div>

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
  label, value, onChange, required, type = "text",
}: {
  label: string; value: string; onChange: (v: string) => void; required?: boolean; type?: string;
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
  label, value, onChange, rows = 3,
}: {
  label: string; value: string; onChange: (v: string) => void; rows?: number;
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

function Toggle({
  label, checked, onChange,
}: {
  label: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <div
        className={`w-10 h-5 rounded-full relative transition-colors ${checked ? "bg-green-500" : "bg-white/10"}`}
        onClick={() => onChange(!checked)}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`}
        />
      </div>
      <span className="text-white/60 text-sm">{label}</span>
    </label>
  );
}
