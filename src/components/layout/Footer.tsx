"use client";

import { useState, useEffect } from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Modal } from "@/components/ui/Modal";
import { getFooter, type FirestoreFooter } from "@/lib/firestore";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const [footerData, setFooterData] = useState<FirestoreFooter | null>(null);

  useEffect(() => {
    getFooter().then(setFooterData);
  }, []);

  function handleNavClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  const navLinks = footerData?.navLinks ?? [];
  const socialLinks = footerData?.socialLinks ?? [];

  return (
    <>
      <footer className="bg-white py-16 px-8 text-center border-t border-gray-100">
        <div className="max-w-[1200px] mx-auto">
          {/* Navigation */}
          <nav className="flex justify-center flex-wrap gap-6 mb-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase no-underline opacity-70 hover:opacity-100 transition-opacity"
              >
                {link.label}
              </a>
            ))}
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity border-l border-black/20 pl-6 cursor-pointer bg-transparent border-t-0 border-b-0 border-r-0"
            >
              GİZLİLİK POLİTİKASI
            </button>
            <button
              onClick={() => setKvkkOpen(true)}
              className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity border-l border-black/20 pl-6 cursor-pointer bg-transparent border-t-0 border-b-0 border-r-0"
            >
              KVKK
            </button>
          </nav>

          {/* Social Icons */}
          <div className="flex justify-center gap-6 mb-8">
            {socialLinks.map((s) => (
              <a
                key={s.icon}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-dark opacity-60 hover:opacity-100 hover:-translate-y-[3px] transition-all"
              >
                <SocialIcon type={s.icon} />
              </a>
            ))}
          </div>

          {/* Copyright */}
          <p className="text-[0.75rem] text-dark opacity-50 tracking-wide">
            {footerData?.copyright || "© 2026 ALAKA Media. Tüm hakları saklıdır."}
          </p>
        </div>
      </footer>

      {/* Privacy Modal */}
      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title={footerData?.privacyTitle.split(" - ")[0] || "ALAKA MEDIA"}
        subtitle={footerData?.privacyTitle.split(" - ")[1] || "Kişisel Verilerin Korunması ve İşlenmesi Politikası"}
      >
        <div dangerouslySetInnerHTML={{ __html: footerData?.privacyContent || "" }} />
      </Modal>

      {/* KVKK Modal */}
      <Modal
        isOpen={kvkkOpen}
        onClose={() => setKvkkOpen(false)}
        title={footerData?.kvkkTitle.split(" - ")[0] || "ALAKA MEDIA"}
        subtitle={footerData?.kvkkTitle.split(" - ")[1] || "Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni"}
      >
        <div dangerouslySetInnerHTML={{ __html: footerData?.kvkkContent || "" }} />
      </Modal>
    </>
  );
}
