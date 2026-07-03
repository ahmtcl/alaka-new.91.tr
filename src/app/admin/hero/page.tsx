"use client";

import { useEffect, useState } from "react";
import {
  getHeroItems,
  addHeroItem,
  updateHeroItem,
  deleteHeroItem,
  uploadFile,
  type FirestoreHeroItem,
} from "@/lib/firestore";
import { Toast } from "@/components/ui/Toast";

function HeroForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FirestoreHeroItem;
  onSave: (msg: string) => void;
  onCancel: () => void;
}) {
  const [titleLines, setTitleLines] = useState(initial?.title?.join("\n") ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [href, setHref] = useState(initial?.href ?? "");
  const [badge, setBadge] = useState(initial?.badge ?? "");
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
        const path = `hero/${Date.now()}-${newFile.name}`;
        imageUrl = await uploadFile(newFile, path);
      }

      const data: Omit<FirestoreHeroItem, "id"> = {
        title: titleLines.split("\n").filter(Boolean),
        category,
        image: imageUrl,
        href,
        badge: badge || undefined,
        order,
      };

      if (initial?.id) {
        await updateHeroItem(initial.id, data);
        onSave("Hero kartı güncellendi!");
      } else {
        await addHeroItem(data);
        onSave("Hero kartı eklendi!");
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
      <div>
        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
          Başlık Satırları (her satır ayrı)
        </label>
        <textarea
          required
          value={titleLines}
          onChange={(e) => setTitleLines(e.target.value)}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-y"
          placeholder={"MURAT AYGEN'LE\nPROFESYONELLER"}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Kategori</label>
          <input
            required
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Link (href)</label>
          <input
            required
            value={href}
            onChange={(e) => setHref(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
            placeholder="#post-profesyoneller"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Badge (opsiyonel)</label>
          <input
            value={badge}
            onChange={(e) => setBadge(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
            placeholder="Çok Yakında"
          />
        </div>
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Sıra</label>
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full sm:w-32 bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
          />
        </div>
      </div>

      {/* Image */}
      {existingImage && (
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Mevcut Görsel</label>
          <img src={existingImage} alt="" className="w-32 h-20 object-cover rounded" />
        </div>
      )}

      <div>
        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
          {existingImage ? "Yeni Görsel" : "Görsel"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
          className="text-white/60 text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-white/10 file:text-white/70 hover:file:bg-white/20"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
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

export default function HeroAdmin() {
  const [items, setItems] = useState<FirestoreHeroItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FirestoreHeroItem | null>(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = async () => {
    setLoading(true);
    const data = await getHeroItems();
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu hero kartını silmek istediğinize emin misiniz?")) return;
    await deleteHeroItem(id);
    setToast({ message: "Hero kartı silindi.", type: "success" });
    load();
  };

  if (adding) {
    return (
      <div>
        <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider mb-6 sm:mb-8">Yeni Hero Kartı Ekle</h1>
        <HeroForm
          onSave={(msg) => { setAdding(false); load(); setToast({ message: msg, type: "success" }); }}
          onCancel={() => setAdding(false)}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider mb-6 sm:mb-8">Hero Kartı Düzenle</h1>
        <HeroForm
          initial={editing}
          onSave={(msg) => { setEditing(null); load(); setToast({ message: msg, type: "success" }); }}
          onCancel={() => setEditing(null)}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider">Hero Yönetimi</h1>
        <button
          onClick={() => setAdding(true)}
          className="bg-white text-black px-4 sm:px-5 py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
        >
          + Yeni Kart
        </button>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <p className="text-white/40 text-sm">Henüz hero kartı eklenmemiş.</p>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                {item.image && (
                  <img src={item.image} alt="" className="w-16 sm:w-20 h-12 sm:h-14 object-cover rounded flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-medium text-sm sm:text-base truncate">{item.title.join(" ")}</h3>
                  <p className="text-white/40 text-xs sm:text-sm mt-0.5 truncate">
                    {item.category} · {item.href}
                    {item.badge && ` · ${item.badge}`}
                  </p>
              </div>
              <div className="flex gap-2 sm:flex-shrink-0">
                <button
                  onClick={() => setEditing(item)}
                  className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm bg-white/10 text-white rounded hover:bg-white/20 transition-colors"
                >
                  Düzenle
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="flex-1 sm:flex-initial px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
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
