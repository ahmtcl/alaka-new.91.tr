"use client";

import { useState } from "react";
import { navLinks, socialLinks } from "@/data/navigation";
import { SocialIcon } from "@/components/ui/SocialIcon";
import { Modal } from "@/components/ui/Modal";

export function Footer() {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [kvkkOpen, setKvkkOpen] = useState(false);

  function handleNavClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

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
            © 2026 ALAKA Media. Tüm hakları saklıdır.
          </p>
        </div>
      </footer>

      {/* Privacy Modal */}
      <Modal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="ALAKA MEDIA"
        subtitle="Kişisel Verilerin Korunması ve İşlenmesi Politikası"
      >
        <p>
          Alaka Media olarak, 6698 sayılı Kişisel Verilerin Korunması Kanunu
          (&ldquo;KVKK&rdquo;) ve ilgili mevzuata uygun şekilde; iş ortaklarımızın,
          proje başvuru sahiplerinin, ziyaretçilerimizin, çalışanlarımızın ve tüm
          paydaşlarımızın kişisel verilerinin korunmasına önem veriyoruz.
        </p>
        <h4>1. Kişisel Verilerin Toplanması ve İşlenmesi</h4>
        <p>
          Kişisel veriler; yürüttüğümüz içerik üretimi, iş birliği süreçleri,
          proje başvuruları, sözleşme ilişkileri ve yasal yükümlülüklerimizin
          yerine getirilmesi amacıyla toplanmaktadır.
        </p>
        <h4>2. Kişisel Verilerin Aktarılması</h4>
        <p>
          Toplanan kişisel veriler, yalnızca faaliyetlerimizin gerektirdiği ölçüde
          ve yasal sınırlar içerisinde paylaşılabilir.
        </p>
        <h4>3. Kişisel Veri Güvenliği</h4>
        <p>
          Alaka Media, kişisel verilerin korunması konusunda gerekli teknik ve
          idari güvenlik önlemlerini almaktadır.
        </p>
        <h4>4. Haklar ve Başvuru Süreçleri</h4>
        <p>
          Bu haklara ilişkin taleplerinizi: <strong>info@alaka.pro</strong>{" "}
          adresine yazılı olarak iletebilirsiniz.
        </p>
      </Modal>

      {/* KVKK Modal */}
      <Modal
        isOpen={kvkkOpen}
        onClose={() => setKvkkOpen(false)}
        title="ALAKA MEDIA"
        subtitle="Kişisel Verilerin Korunması ve İşlenmesi Aydınlatma Metni"
      >
        <h4>1. Veri Sorumlusu</h4>
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu (&ldquo;KVKK&rdquo;)
          uyarınca, Alaka Media (&ldquo;Şirket&rdquo;) olarak, kişisel
          verileriniz veri sorumlusu sıfatıyla işlenmektedir.
        </p>
        <h4>2. İşlenen Kişisel Veriler</h4>
        <p>Web sitemiz üzerinden ad-soyad, e-posta adresi, mesaj içeriği, yüklenen dosyalar, IP adresi ve teknik erişim verileri işlenebilmektedir.</p>
        <h4>3. İşleme Amaçları</h4>
        <p>İletişim taleplerinin yanıtlanması, iş birliği ve proje başvurularının değerlendirilmesi, yasal yükümlülüklerin yerine getirilmesi ve web sitesi güvenliğinin sağlanması amaçlarıyla işlenmektedir.</p>
        <h4>4. KVKK Kapsamındaki Haklarınız</h4>
        <p>
          Bu kapsamda taleplerinizi: <strong>info@alaka.pro</strong> adresine yazılı
          olarak iletebilirsiniz.
        </p>
      </Modal>
    </>
  );
}
