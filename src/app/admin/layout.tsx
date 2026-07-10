"use client";

import { AuthProvider, useAuth } from "@/lib/auth-context";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Hero Yönetimi", href: "/admin/hero" },
  { label: "Program Yönetimi", href: "/admin/programs" },
  { label: "Ekip Yönetimi", href: "/admin/team" },
  { label: "Upcoming Yönetimi", href: "/admin/upcoming" },
  { label: "Site İçerikleri", href: "/admin/content" },
  { label: "İletişim Mesajları", href: "/admin/messages" },
  { label: "Footer Yönetimi", href: "/admin/footer" },
];

function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace("/admin/login");
  };

  const handleNavClick = () => {
    // Close mobile menu after clicking a link
    onClose();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50
          w-60 bg-[#111] border-r border-white/5 flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <Link 
            href="/admin" 
            className="text-white text-sm font-light tracking-[0.25em] uppercase"
            onClick={handleNavClick}
          >
            ALAKA Admin
          </Link>
          {/* Close button for mobile */}
          <button
            onClick={onClose}
            className="lg:hidden text-white/50 hover:text-white transition-colors"
            aria-label="Menüyü kapat"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavClick}
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
    </>
  );
}

function AdminShell({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user && pathname !== "/admin/login") {
      router.replace("/admin/login");
    }
    if (!loading && user && !isAdmin) {
      router.replace("/admin/login");
    }
  }, [loading, user, isAdmin, pathname, router]);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

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
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="lg:hidden sticky top-0 z-30 bg-[#111] border-b border-white/5 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-white/70 hover:text-white transition-colors"
            aria-label="Menüyü aç"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="text-white text-sm font-light tracking-[0.25em] uppercase">
            ALAKA Admin
          </span>
          <div className="w-6" /> {/* Spacer for centering */}
        </div>

        <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {pathname !== "/admin" && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-white/40 text-sm hover:text-white transition-colors mb-6"
            >
              <span>←</span> Geri
            </Link>
          )}
          {children}
        </div>
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
