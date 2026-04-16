"use client";

import { useEffect, useState } from "react";
import { getSiteContent, updateSiteContent, type FirestoreSiteContent } from "@/lib/firestore";

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
    } catch (err) {
      console.error(err);
      alert("Kaydetme hatası.");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return <p className="text-white/40 text-sm">Yükleniyor...</p>;
  }

  return (
    <div>
      <h1 className="text-white text-2xl font-light tracking-wider mb-8">Site İçerikleri</h1>

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
                <label className="block text-white/40 text-xs uppercase tracking-wider mb-3">
                  {label}
                </label>

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
            onClick={async () => {
              const changedItems = items.filter((i) => editValues[i.id!] !== i.value);
              if (changedItems.length === 0) return;
              setSaving("all");
              try {
                for (const item of changedItems) {
                  await updateSiteContent(item.id!, editValues[item.id!]);
                }
                await load();
              } catch (err) {
                console.error(err);
                alert("Kaydetme hatası.");
              } finally {
                setSaving(null);
              }
            }}
            disabled={saving !== null || !items.some((i) => editValues[i.id!] !== i.value)}
            className="mt-4 bg-white text-black px-8 py-3 rounded text-sm font-semibold tracking-wider uppercase hover:bg-white/90 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {saving === "all" ? "Kaydediliyor..." : "Tümünü Kaydet"}
          </button>
        </div>
      )}
    </div>
  );
}
