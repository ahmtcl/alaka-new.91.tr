"use client";

import { useEffect, useState } from "react";
import { getFooter, updateFooter, type FirestoreFooter } from "@/lib/firestore";
import { Toast } from "@/components/ui/Toast";

export default function FooterAdmin() {
  const [footer, setFooter] = useState<FirestoreFooter | null>(null);
  const [copyright, setCopyright] = useState("");
  const [privacyTitle, setPrivacyTitle] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [kvkkTitle, setKvkkTitle] = useState("");
  const [kvkkContent, setKvkkContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    loadFooter();
  }, []);

  const loadFooter = async () => {
    const data = await getFooter();
    setFooter(data);
    setCopyright(data.copyright);
    setPrivacyTitle(data.privacyTitle);
    setPrivacyContent(data.privacyContent);
    setKvkkTitle(data.kvkkTitle);
    setKvkkContent(data.kvkkContent);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      await updateFooter({
        copyright,
        privacyTitle,
        privacyContent,
        kvkkTitle,
        kvkkContent,
      });
      setToast({ message: "Footer başarıyla güncellendi!", type: "success" });
      loadFooter();
    } catch (error) {
      console.error("Footer güncelleme hatası:", error);
      setToast({ message: "Güncelleme sırasında hata oluştu.", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (!footer) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-white/50">Yükleniyor...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider mb-2">
          Footer Yönetimi
        </h1>
        <p className="text-white/50 text-sm">
          Footer alanındaki tüm metinleri buradan düzenleyebilirsiniz.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8 max-w-4xl">
        {/* Copyright */}
        <div>
          <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
            Copyright Metni
          </label>
          <input
            type="text"
            value={copyright}
            onChange={(e) => setCopyright(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
            placeholder="© 2026 ALAKA Media. Tüm hakları saklıdır."
            required
          />
        </div>

        {/* Privacy Policy */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-white text-lg font-light tracking-wider mb-4">Gizlilik Politikası</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={privacyTitle}
                onChange={(e) => setPrivacyTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="ALAKA MEDIA - Kişisel Verilerin Korunması..."
                required
              />
            </div>

            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                İçerik (HTML destekler: &lt;p&gt;, &lt;h4&gt;, &lt;strong&gt;)
              </label>
              <textarea
                value={privacyContent}
                onChange={(e) => setPrivacyContent(e.target.value)}
                rows={12}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors font-mono resize-y"
                placeholder="<p>Açıklama metni...</p>"
                required
              />
              <p className="text-white/30 text-xs mt-1">
                HTML etiketleri kullanabilirsiniz: &lt;p&gt;, &lt;h4&gt;, &lt;strong&gt;
              </p>
            </div>
          </div>
        </div>

        {/* KVKK */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-white text-lg font-light tracking-wider mb-4">KVKK Aydınlatma Metni</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                Başlık
              </label>
              <input
                type="text"
                value={kvkkTitle}
                onChange={(e) => setKvkkTitle(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors"
                placeholder="ALAKA MEDIA - KVKK Aydınlatma Metni"
                required
              />
            </div>

            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">
                İçerik (HTML destekler: &lt;p&gt;, &lt;h4&gt;, &lt;strong&gt;)
              </label>
              <textarea
                value={kvkkContent}
                onChange={(e) => setKvkkContent(e.target.value)}
                rows={12}
                className="w-full bg-white/5 border border-white/10 rounded px-4 py-2.5 text-white text-sm outline-none focus:border-white/30 transition-colors font-mono resize-y"
                placeholder="<h4>1. Başlık</h4><p>Açıklama...</p>"
                required
              />
              <p className="text-white/30 text-xs mt-1">
                HTML etiketleri kullanabilirsiniz: &lt;p&gt;, &lt;h4&gt;, &lt;strong&gt;
              </p>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex gap-4 pt-6 border-t border-white/10">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
