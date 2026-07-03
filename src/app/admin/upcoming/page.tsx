"use client";

import { useEffect, useState } from "react";
import {
  getUpcomingItems,
  addUpcomingItem,
  updateUpcomingItem,
  deleteUpcomingItem,
  uploadFile,
  type FirestoreUpcoming,
} from "@/lib/firestore";
import { Toast } from "@/components/ui/Toast";

function UpcomingForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: FirestoreUpcoming;
  onSave: (msg: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [existingVideoUrl, setExistingVideoUrl] = useState(initial?.videoUrl ?? "");
  const [newFile, setNewFile] = useState<File | null>(null);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [active, setActive] = useState(initial?.active ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      let videoUrl = existingVideoUrl;

      if (newFile) {
        const path = `upcoming/${Date.now()}-${newFile.name}`;
        videoUrl = await uploadFile(newFile, path);
      }

      if (!videoUrl) {
        setError("Video dosyası veya URL gerekli.");
        setSaving(false);
        return;
      }

      const data: Omit<FirestoreUpcoming, "id"> = {
        title,
        videoUrl,
        active,
        order,
      };

      if (initial?.id) {
        await updateUpcomingItem(initial.id, data);
        onSave("Video güncellendi!");
      } else {
        await addUpcomingItem(data);
        onSave("Video eklendi!");
      }
    } catch (err) {
      console.error(err);
      setError("Kaydetme sırasında hata oluştu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-2xl">
      {error && <p className="text-red-400 text-sm">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Başlık</label>
          <input
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
            placeholder="Upcoming Project"
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

      {/* Active toggle */}
      <label className="flex items-center gap-3 cursor-pointer select-none">
        <div
          className={`w-10 h-5 rounded-full relative transition-colors ${active ? "bg-green-500" : "bg-white/10"}`}
          onClick={() => setActive(!active)}
        >
          <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${active ? "translate-x-5" : "translate-x-0.5"}`} />
        </div>
        <span className="text-white/60 text-sm">Aktif</span>
      </label>

      {/* Existing video */}
      {existingVideoUrl && (
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Mevcut Video</label>
          <video src={existingVideoUrl} className="w-64 rounded" controls muted />
          <button
            type="button"
            onClick={() => setExistingVideoUrl("")}
            className="mt-2 text-red-400 text-xs hover:text-red-300 transition-colors"
          >
            Videoyu Kaldır
          </button>
        </div>
      )}

      {/* New video upload */}
      <div>
        <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
          {existingVideoUrl ? "Yeni Video Yükle" : "Video Yükle"}
        </label>
        <input
          type="file"
          accept="video/*"
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

export default function UpcomingAdmin() {
  const [items, setItems] = useState<FirestoreUpcoming[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<FirestoreUpcoming | null>(null);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getUpcomingItems();
      setItems(data);
    } catch (err) {
      console.error("Upcoming yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Bu videoyu silmek istediğinize emin misiniz?")) return;
    await deleteUpcomingItem(id);
    setToast({ message: "Video silindi.", type: "success" });
    load();
  };

  if (adding) {
    return (
      <div>
        <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider mb-6 sm:mb-8">Yeni Upcoming Video Ekle</h1>
        <UpcomingForm
          onSave={(msg) => { setAdding(false); load(); setToast({ message: msg, type: "success" }); }}
          onCancel={() => setAdding(false)}
        />
      </div>
    );
  }

  if (editing) {
    return (
      <div>
        <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider mb-6 sm:mb-8">Upcoming Video Düzenle</h1>
        <UpcomingForm
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
        <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider">Upcoming Yönetimi</h1>
        <button
          onClick={() => setAdding(true)}
          className="bg-white text-black px-4 sm:px-5 py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors whitespace-nowrap"
        >
          + Yeni Video
        </button>
      </div>

      {loading ? (
        <p className="text-white/40 text-sm">Yükleniyor...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-white/30 text-lg mb-2">Henüz upcoming video eklenmemiş</p>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white/5 border border-white/10 rounded-lg p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            >
              <div className="flex items-center gap-3 sm:gap-4 min-w-0">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-white font-medium text-sm sm:text-base">{item.title}</h3>
                    {!item.active && (
                      <span className="text-[10px] bg-red-500/20 text-red-400 px-2 py-0.5 rounded uppercase tracking-wider flex-shrink-0">Pasif</span>
                    )}
                  </div>
                  <p className="text-white/40 text-xs sm:text-sm mt-1">Sıra: {item.order}</p>
                </div>
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
