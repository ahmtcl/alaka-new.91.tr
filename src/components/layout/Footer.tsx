"use client";

import { useState, useEffect } from "react";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Modal } from "@/components/ui/Modal";
import { getFooter, type FirestoreFooter } from "@/lib/firestore";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [kvkkOpen, setKvkkOpen] = useState(false);
  const [cookieOpen, setCookieOpen] = useState(false);
  const [dataSubjectOpen, setDataSubjectOpen] = useState(false);
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
          <nav className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mb-6">
            {navLinks.map((link, index) => (
              <span key={link.href} className="flex items-center gap-4 sm:gap-6">
                {index > 0 && <span className="hidden sm:inline-block w-px h-3 bg-black/20" />}
                <a
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase no-underline opacity-70 hover:opacity-100 transition-opacity"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </nav>

          {/* Legal Links */}
          <div className="flex flex-col md:flex-row justify-center items-center gap-4 md:gap-6 mb-8">
            <button
              onClick={() => setPrivacyOpen(true)}
              className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0 p-0"
            >
              {footerData?.privacyButtonLabel || "GİZLİLİK POLİTİKASI"}
            </button>
            <span className="hidden md:inline-block w-px h-3 bg-black/20" />
            <button
              onClick={() => setKvkkOpen(true)}
              className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0 p-0"
            >
              {footerData?.kvkkButtonLabel || "WEB SİTESİ AYDINLATMA METNİ"}
            </button>
            <span className="hidden md:inline-block w-px h-3 bg-black/20" />
            {footerData?.cookieFileUrl ? (
              <a
                href={footerData.cookieFileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0 p-0 no-underline"
              >
                {footerData?.cookieButtonLabel || "ÇEREZ AYDINLATMA METNİ"}
              </a>
            ) : (
              <button
                onClick={() => setCookieOpen(true)}
                className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0 p-0"
              >
                {footerData?.cookieButtonLabel || "ÇEREZ AYDINLATMA METNİ"}
              </button>
            )}
            <span className="hidden md:inline-block w-px h-3 bg-black/20" />
            {footerData?.dataSubjectFileUrl ? (
              <a
                href={footerData.dataSubjectFileUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0 p-0 no-underline"
              >
                {footerData?.dataSubjectButtonLabel || "VERİ SAHİBİ BAŞVURU FORMU"}
              </a>
            ) : (
              <button
                onClick={() => setDataSubjectOpen(true)}
                className="text-dark text-[0.8rem] font-medium tracking-[0.15em] uppercase opacity-70 hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-0 p-0"
              >
                {footerData?.dataSubjectButtonLabel || "VERİ SAHİBİ BAŞVURU FORMU"}
              </button>
            )}
          </div>

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

      {/* Data Subject Application Modal */}
      <Modal
        isOpen={dataSubjectOpen}
        onClose={() => setDataSubjectOpen(false)}
        title={footerData?.dataSubjectTitle.split(" - ")[0] || "ALAKA MEDIA"}
        subtitle={footerData?.dataSubjectTitle.split(" - ")[1] || "Veri Sahibi Başvuru Formu"}
      >
        <div dangerouslySetInnerHTML={{ __html: footerData?.dataSubjectContent || "" }} />
      </Modal>

      {/* Cookie Modal */}
      <Modal
        isOpen={cookieOpen}
        onClose={() => setCookieOpen(false)}
        title={footerData?.cookieTitle?.split(" - ")[0] || "ALAKA MEDIA"}
        subtitle={footerData?.cookieTitle?.split(" - ")[1] || "Çerez Aydınlatma Metni"}
      >
        <div dangerouslySetInnerHTML={{ __html: footerData?.cookieContent || "" }} />
      </Modal>
    </>
  );
}
