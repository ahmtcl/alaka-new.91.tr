"use client";

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

const navItems = [
  { label: "Hero Yönetimi", href: "/admin/hero" },
  { label: "Program Yönetimi", href: "/admin/programs" },
  { label: "Ekip Yönetimi", href: "/admin/team" },
  { label: "Upcoming Yönetimi", href: "/admin/upcoming" },
  { label: "Site İçerikleri", href: "/admin/content" },
];

function Sidebar() {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  return (
    <aside className="w-60 bg-[#111] border-r border-white/5 flex flex-col min-h-screen">
      <div className="p-6 border-b border-white/5">
        <Link href="/admin" className="text-white text-sm font-light tracking-[0.25em] uppercase">
          ALAKA Admin
        </Link>
      </div>

      <nav className="flex-1 py-4">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-6 py-3 text-sm transition-colors ${
                active
                  ? "text-white bg-white/10 border-r-2 border-white"
                  : "text-white/50 hover:text-white hover:bg-white/5"
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full text-left px-2 py-2 text-xs text-white/30 hover:text-white/60 transition-colors uppercase tracking-wider"
        >
          Çıkış Yap
        </button>
      </div>
    </aside>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
    if (!loading && user && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, user, isAdmin, pathname, router]);

  // Login page renders without sidebar
  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-white/50 text-sm">Yükleniyor...</div>
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {pathname !== "/admin" && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white transition-colors mb-6"
          >
            <span>←</span> Geri
          </Link>
        )}
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
