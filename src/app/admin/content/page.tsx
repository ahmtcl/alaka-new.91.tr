"use client";

import { useEffect, useState } from "react";
import { getSiteContent, updateSiteContent, addSiteContent, deleteSiteContent, type FirestoreSiteContent } from "@/lib/firestore";
import { Toast } from "@/components/ui/Toast";

const CONTENT_LABELS: Record<string, string> = {
  statement_divider: "Ayırıcı Başlık (Bazı Hikâyeler Tamamlanmaz.)",
  quiet_line: "Üst Yazı (Hikâyesi olmayan hiçbir şeyle...)",
  manifesto_title: "Manifesto Başlık (ALAKA MEDIA)",
  manifesto_body: "Manifesto Metni (paragrafları boş satırla ayırın)",
  manifesto_footer: "Manifesto Alt Yazı (italik)",
  contact_subtitle: "İletişim Alt Yazı",
};

export default function SiteContentAdmin() {
  const [items, setItems] = useState<FirestoreSiteContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [addingNew, setAddingNew] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await getSiteContent();
      setItems(data);
      const vals: Record<string, string> = {};
      data.forEach((d) => { vals[d.id!] = d.value; });
      setEditValues(vals);
    } catch (err) {
      console.error("İçerikler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (item: FirestoreSiteContent) => {
    const newVal = editValues[item.id!];
    if (newVal === item.value) return;
    setSaving(item.id!);
    try {
      await updateSiteContent(item.id!, newVal);
      await load();
      setToast({ message: "Kaydedildi!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Kaydetme hatası.", type: "error" });
    } finally {
      setSaving(null);
    }
  };

  const handleSaveAll = async () => {
    const changedItems = items.filter((i) => editValues[i.id!] !== i.value);
    if (changedItems.length === 0) return;
    setSaving("all");
    try {
      for (const item of changedItems) {
        await updateSiteContent(item.id!, editValues[item.id!]);
      }
      await load();
      setToast({ message: `${changedItems.length} içerik kaydedildi!`, type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Kaydetme hatası.", type: "error" });
    } finally {
      setSaving(null);
    }
  };

  const handleAdd = async () => {
    if (!newKey.trim() || !newValue.trim()) return;
    setSaving("new");
    try {
      await addSiteContent({ key: newKey.trim(), value: newValue.trim() });
      setNewKey("");
      setNewValue("");
      setAddingNew(false);
      await load();
      setToast({ message: "Yeni içerik eklendi!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Ekleme hatası.", type: "error" });
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (item: FirestoreSiteContent) => {
    if (!confirm(`"${CONTENT_LABELS[item.key] || item.key}" içeriğini silmek istediğinize emin misiniz?`)) return;
    try {
      await deleteSiteContent(item.id!);
      await load();
      setToast({ message: "İçerik silindi.", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Silme hatası.", type: "error" });
    }
  };

  if (loading) {
    return <p className="text-white/40 text-sm">Yükleniyor...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-white text-2xl font-light tracking-wider">Site İçerikleri</h1>
        <button
          onClick={() => setAddingNew(true)}
          className="bg-white text-black px-5 py-2.5 rounded text-sm font-medium hover:bg-white/90 transition-colors"
        >
          + Yeni İçerik
        </button>
      </div>

      {/* Yeni içerik ekleme formu */}
      {addingNew && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-5 mb-6 max-w-3xl">
          <h3 className="text-white text-sm font-medium mb-4">Yeni İçerik Ekle</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Anahtar (key)</label>
              <input
                value={newKey}
                onChange={(e) => setNewKey(e.target.value)}
                placeholder="ornek_baslik"
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
              />
            </div>
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Değer</label>
              <textarea
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                rows={3}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-y"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAdd}
                disabled={saving === "new" || !newKey.trim() || !newValue.trim()}
                className="bg-white text-black px-5 py-2 rounded text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {saving === "new" ? "Ekleniyor..." : "Ekle"}
              </button>
              <button
                onClick={() => { setAddingNew(false); setNewKey(""); setNewValue(""); }}
                className="bg-white/10 text-white px-5 py-2 rounded text-sm hover:bg-white/20 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-white/40 text-sm">Henüz içerik eklenmemiş.</p>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {items.map((item) => {
            const label = CONTENT_LABELS[item.key] || item.key;
            const isLong = (item.value?.length || 0) > 80;
            const changed = editValues[item.id!] !== item.value;

            return (
              <div key={item.id} className="bg-white/5 border border-white/10 rounded-lg p-5">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-white/40 text-xs uppercase tracking-wider">
                    {label}
                  </label>
                  <button
                    onClick={() => handleDelete(item)}
                    className="text-red-400/60 text-xs hover:text-red-400 transition-colors"
                  >
                    Sil
                  </button>
                </div>

                {isLong ? (
                  <textarea
                    value={editValues[item.id!] ?? ""}
                    onChange={(e) => setEditValues({ ...editValues, [item.id!]: e.target.value })}
                    rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors resize-y"
                  />
                ) : (
                  <input
                    type="text"
                    value={editValues[item.id!] ?? ""}
                    onChange={(e) => setEditValues({ ...editValues, [item.id!]: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
                  />
                )}

                <button
                  onClick={() => handleSave(item)}
                  disabled={!changed || saving === item.id}
                  className="mt-3 bg-white text-black px-5 py-2 rounded text-sm font-medium hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  {saving === item.id ? "Kaydediliyor..." : "Kaydet"}
                </button>
              </div>
            );
          })}

          {/* Tümünü Kaydet */}
          <button
            onClick={handleSaveAll}
            disabled={saving !== null || !items.some((i) => editValues[i.id!] !== i.value)}
            className="mt-4 bg-white text-black px-8 py-3 rounded text-sm font-semibold tracking-wider uppercase hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving === "all" ? "Kaydediliyor..." : "Tümünü Kaydet"}
          </button>
        </div>
      )}

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
