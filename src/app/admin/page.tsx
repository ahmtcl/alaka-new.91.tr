"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  getSectionVisibility,
  updateSectionVisibility,
  type SectionVisibility,
} from "@/lib/firestore";

const sections = [
  { title: "Hero Yönetimi", desc: "Ana sayfa hero kartlarını düzenle", href: "/admin/hero" },
  { title: "Program Yönetimi", desc: "Programları ekle, düzenle, sil", href: "/admin/programs" },
  { title: "Ekip Yönetimi", desc: "Ekip üyelerini yönet", href: "/admin/team" },
  { title: "Upcoming Yönetimi", desc: "Upcoming videoları yönet", href: "/admin/upcoming" },
  { title: "Site İçerikleri", desc: "Metin ve başlıkları düzenle", href: "/admin/content" },
  { title: "İletişim Mesajları", desc: "Formdan gelen mesajları görüntüle", href: "/admin/messages" },
];

const visibilityItems: { key: keyof SectionVisibility; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "programs", label: "Programlar" },
  { key: "manifesto", label: "Manifesto" },
  { key: "upcoming", label: "Upcoming" },
  { key: "team", label: "Ekip" },
  { key: "contact", label: "İletişim" },
];

export default function AdminDashboard() {
  const [visibility, setVisibility] = useState<SectionVisibility | null>(null);
  const [saving, setSaving] = useState<string | null>(null);

  useEffect(() => {
    getSectionVisibility().then(setVisibility);
  }, []);

  const toggle = async (key: keyof SectionVisibility) => {
    if (!visibility || saving) return;
    const newVal = !visibility[key];
    setSaving(key);
    const updated = { ...visibility, [key]: newVal };
    setVisibility(updated);
    await updateSectionVisibility({ [key]: newVal });
    setSaving(null);
  };

  return (
    <div>
      <h1 className="text-white text-xl sm:text-2xl font-light tracking-wider mb-6 sm:mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white/5 border border-white/10 rounded-lg p-5 sm:p-6 hover:bg-white/10 transition-colors group"
          >
            <h2 className="text-white text-base sm:text-lg font-medium mb-2 group-hover:text-white/90">
              {s.title}
            </h2>
            <p className="text-white/40 text-sm">{s.desc}</p>
          </Link>
        ))}
      </div>

      {/* Bölüm Görünürlüğü */}
      <div className="mt-10 sm:mt-12">
        <h2 className="text-white text-base sm:text-lg font-light tracking-wider mb-1">Bölüm Görünürlüğü</h2>
        <p className="text-white/30 text-xs sm:text-sm mb-4 sm:mb-6">
          Sitedeki bölümleri gizle veya göster. Değişiklikler anında yayına girer.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {visibilityItems.map(({ key, label }) => {
            const visible = visibility ? visibility[key] : true;
            const isSaving = saving === key;

            return (
              <div
                key={key}
                className="bg-white/5 border border-white/10 rounded-lg p-4 flex items-center justify-between gap-4"
              >
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{label}</p>
                  <p
                    className={`text-xs mt-0.5 ${
                      visibility === null
                        ? "text-white/20"
                        : visible
                        ? "text-green-400/70"
                        : "text-red-400/70"
                    }`}
                  >
                    {visibility === null ? "Yükleniyor..." : visible ? "Görünür" : "Gizli"}
                  </p>
                </div>
                <button
                  onClick={() => toggle(key)}
                  disabled={!visibility || !!saving}
                  className={`flex-shrink-0 px-3 py-1.5 rounded text-xs font-medium transition-colors disabled:opacity-40 ${
                    visible
                      ? "bg-white/10 text-white hover:bg-red-500/20 hover:text-red-400 border border-white/10"
                      : "bg-white/10 text-white/50 hover:bg-green-500/20 hover:text-green-400 border border-white/10"
                  }`}
                >
                  {isSaving ? "..." : visible ? "Gizle" : "Göster"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
