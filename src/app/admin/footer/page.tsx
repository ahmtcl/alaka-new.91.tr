"use client";

import { useEffect, useState } from "react";
import {
  getFooter,
  updateFooter,
  type FirestoreFooter,
  type FirestoreNavLink,
  type FirestoreSocialLink,
} from "@/lib/firestore";
import { Toast } from "@/components/ui/Toast";

const SOCIAL_ICONS = ["instagram", "x", "tiktok", "youtube"] as const;
type SocialIconType = (typeof SOCIAL_ICONS)[number];

const ICON_LABELS: Record<SocialIconType, string> = {
  instagram: "Instagram",
  x: "X (Twitter)",
  tiktok: "TikTok",
  youtube: "YouTube",
};

const ICON_SVG: Record<SocialIconType, React.ReactNode> = {
  instagram: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  ),
  x: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  tiktok: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.26 8.26 0 0 0 4.83 1.55V6.79a4.85 4.85 0 0 1-1.06-.1z" />
    </svg>
  ),
  youtube: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function FooterAdmin() {
  const [footer, setFooter] = useState<FirestoreFooter | null>(null);
  const [copyright, setCopyright] = useState("");
  const [privacyTitle, setPrivacyTitle] = useState("");
  const [privacyContent, setPrivacyContent] = useState("");
  const [kvkkTitle, setKvkkTitle] = useState("");
  const [kvkkContent, setKvkkContent] = useState("");
  const [navLinks, setNavLinks] = useState<FirestoreNavLink[]>([]);
  const [socialLinks, setSocialLinks] = useState<FirestoreSocialLink[]>([]);
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
    setNavLinks(data.navLinks || []);
    setSocialLinks(data.socialLinks || []);
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
        navLinks,
        socialLinks,
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

  // ─── Nav Links handlers ───
  const updateNavLink = (index: number, field: keyof FirestoreNavLink, value: string) => {
    setNavLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };
  const addNavLink = () => setNavLinks((prev) => [...prev, { label: "", href: "#" }]);
  const removeNavLink = (index: number) => setNavLinks((prev) => prev.filter((_, i) => i !== index));
  const moveNavLink = (index: number, dir: -1 | 1) => {
    setNavLinks((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  // ─── Social Links handlers ───
  const updateSocialLink = (index: number, field: keyof FirestoreSocialLink, value: string) => {
    setSocialLinks((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };
  const addSocialLink = () =>
    setSocialLinks((prev) => [...prev, { label: "Instagram", href: "https://", icon: "instagram" }]);
  const removeSocialLink = (index: number) => setSocialLinks((prev) => prev.filter((_, i) => i !== index));

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
          Footer alanındaki menüler, sosyal medya linkleri ve tüm metinleri buradan düzenleyebilirsiniz.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-10 max-w-4xl">

        {/* ─── Menü Linkleri ─── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-light tracking-wider">Menü Linkleri</h3>
            <button
              type="button"
              onClick={addNavLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Ekle
            </button>
          </div>

          <div className="space-y-3">
            {navLinks.map((link, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded px-4 py-3">
                {/* Sıralama */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    onClick={() => moveNavLink(i, -1)}
                    disabled={i === 0}
                    className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M18 15l-6-6-6 6" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => moveNavLink(i, 1)}
                    disabled={i === navLinks.length - 1}
                    className="text-white/30 hover:text-white disabled:opacity-20 transition-colors"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </button>
                </div>

                <div className="flex-1 flex gap-3">
                  <div className="w-40">
                    <label className="block text-white/30 text-[10px] uppercase tracking-wider mb-1">Başlık</label>
                    <input
                      type="text"
                      value={link.label}
                      onChange={(e) => updateNavLink(i, "label", e.target.value)}
                      className="w-full bg-transparent text-white text-sm outline-none border-b border-white/10 focus:border-white/30 pb-1 transition-colors"
                      placeholder="ANA SAYFA"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-white/30 text-[10px] uppercase tracking-wider mb-1">Href / Anchor</label>
                    <input
                      type="text"
                      value={link.href}
                      onChange={(e) => updateNavLink(i, "href", e.target.value)}
                      className="w-full bg-transparent text-white text-sm outline-none border-b border-white/10 focus:border-white/30 pb-1 transition-colors font-mono"
                      placeholder="#home"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeNavLink(i)}
                  className="text-white/20 hover:text-red-400 transition-colors ml-2 shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {navLinks.length === 0 && (
              <p className="text-white/20 text-sm text-center py-4 border border-dashed border-white/10 rounded">
                Henüz menü linki yok. "Ekle" butonuyla ekleyebilirsiniz.
              </p>
            )}
          </div>
        </div>

        {/* ─── Sosyal Medya Linkleri ─── */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white text-lg font-light tracking-wider">Sosyal Medya</h3>
            <button
              type="button"
              onClick={addSocialLink}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs rounded transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Ekle
            </button>
          </div>

          <div className="space-y-3">
            {socialLinks.map((social, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded px-4 py-3">
                {/* Platform Seçici */}
                <div className="shrink-0">
                  <label className="block text-white/30 text-[10px] uppercase tracking-wider mb-1">Platform</label>
                  <div className="flex gap-1.5">
                    {SOCIAL_ICONS.map((icon) => (
                      <button
                        key={icon}
                        type="button"
                        title={ICON_LABELS[icon]}
                        onClick={() => {
                          updateSocialLink(i, "icon", icon);
                          updateSocialLink(i, "label", ICON_LABELS[icon]);
                        }}
                        className={`p-2 rounded transition-all ${
                          social.icon === icon
                            ? "bg-white text-black"
                            : "bg-white/10 text-white/50 hover:bg-white/20 hover:text-white"
                        }`}
                      >
                        {ICON_SVG[icon]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1">
                  <label className="block text-white/30 text-[10px] uppercase tracking-wider mb-1">Link</label>
                  <input
                    type="url"
                    value={social.href}
                    onChange={(e) => updateSocialLink(i, "href", e.target.value)}
                    className="w-full bg-transparent text-white text-sm outline-none border-b border-white/10 focus:border-white/30 pb-1 transition-colors font-mono"
                    placeholder="https://instagram.com/..."
                  />
                </div>

                {/* Seçili ikon önizlemesi */}
                <div className="shrink-0 flex flex-col items-center gap-1">
                  <div className="text-white/60">
                    {ICON_SVG[social.icon]}
                  </div>
                  <span className="text-white/25 text-[9px]">{social.icon}</span>
                </div>

                <button
                  type="button"
                  onClick={() => removeSocialLink(i)}
                  className="text-white/20 hover:text-red-400 transition-colors ml-1 shrink-0"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}

            {socialLinks.length === 0 && (
              <p className="text-white/20 text-sm text-center py-4 border border-dashed border-white/10 rounded">
                Henüz sosyal medya linki yok. "Ekle" butonuyla ekleyebilirsiniz.
              </p>
            )}
          </div>
        </div>

        {/* ─── Copyright ─── */}
        <div className="border-t border-white/10 pt-8">
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

        {/* ─── Privacy Policy ─── */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-white text-lg font-light tracking-wider mb-4">Gizlilik Politikası</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Başlık</label>
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

        {/* ─── KVKK ─── */}
        <div className="border-t border-white/10 pt-8">
          <h3 className="text-white text-lg font-light tracking-wider mb-4">KVKK Aydınlatma Metni</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/40 text-xs uppercase tracking-wider mb-2">Başlık</label>
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

        {/* ─── Save Button ─── */}
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
