"use client";

import Link from "next/link";

const sections = [
  { title: "Hero Yönetimi", desc: "Ana sayfa hero kartlarını düzenle", href: "/admin/hero" },
  { title: "Program Yönetimi", desc: "Programları ekle, düzenle, sil", href: "/admin/programs" },
  { title: "Ekip Yönetimi", desc: "Ekip üyelerini yönet", href: "/admin/team" },
  { title: "Upcoming Yönetimi", desc: "Upcoming videoları yönet", href: "/admin/upcoming" },
  { title: "Site İçerikleri", desc: "Metin ve başlıkları düzenle", href: "/admin/content" },
];

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-white text-2xl font-light tracking-wider mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="bg-white/5 border border-white/10 rounded-lg p-6 hover:bg-white/10 transition-colors group"
          >
            <h2 className="text-white text-lg font-medium mb-2 group-hover:text-white/90">
              {s.title}
            </h2>
            <p className="text-white/40 text-sm">{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
