"use client";

import { useState } from "react";
import { SectionHead } from "@/components/ui/SectionHead";
import { useSiteContent } from "@/lib/hooks";
import { addContactForm, uploadFile } from "@/lib/firestore";

export function ContactSection() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [kvkkAccepted, setKvkkAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const { content } = useSiteContent();

  const subtitle = content.contact_subtitle || "Birlikte düşüneceksek, yaz.";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!kvkkAccepted) {
      alert("Lütfen KVKK Aydınlatma Metni'ni kabul edin.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const formData = new FormData(e.currentTarget);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const message = formData.get('message') as string;

      let attachmentUrl: string | undefined;
      let attachmentName: string | undefined;

      // Upload file if exists
      if (selectedFile) {
        const path = `contact-attachments/${Date.now()}_${selectedFile.name}`;
        attachmentUrl = await uploadFile(selectedFile, path);
        attachmentName = selectedFile.name;
      }

      // Save to Firestore
      await addContactForm({
        name,
        email,
        message: message || undefined,
        attachmentUrl,
        attachmentName,
        kvkkConsent: true,
      });

      setSubmitStatus('success');
      e.currentTarget.reset();
      setFileName(null);
      setSelectedFile(null);
      setKvkkAccepted(false);
    } catch (error) {
      console.error('Form gönderme hatası:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-32 px-8 bg-dark text-white" id="temas">
      <div className="max-w-[600px] mx-auto text-center">
        <SectionHead light>TEMAS</SectionHead>

        <p className="text-[clamp(1rem,2vw,1.3rem)] font-light italic leading-relaxed text-white/70 mb-32 pt-8 border-t border-white/10 text-center">
          {subtitle}
        </p>

        <form
          className="flex flex-col gap-8"
          onSubmit={handleSubmit}
        >
          <div className="relative">
            <input
              type="text"
              name="name"
              placeholder="İsim"
              required
              className="w-full bg-transparent border-none border-b border-white/20 py-4 text-base text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
            />
          </div>

          <div className="relative">
            <input
              type="email"
              name="email"
              placeholder="Mail"
              required
              className="w-full bg-transparent border-none border-b border-white/20 py-4 text-base text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
            />
          </div>

          <div className="relative">
            <input
              type="text"
              name="message"
              placeholder="Tek satır mesaj"
              className="w-full bg-transparent border-none border-b border-white/20 py-4 text-base text-white placeholder-white/40 focus:outline-none focus:border-white/60 transition-colors"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
            />
          </div>

          {/* File Upload */}
          <div
            className="flex items-center gap-4 py-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
          >
            <label className="text-[0.85rem] text-white/50 cursor-pointer hover:text-white/80 transition-colors">
              <input
                type="file"
                name="attachment"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setSelectedFile(file);
                    setFileName(`✓ ${file.name}`);
                  } else {
                    setSelectedFile(null);
                    setFileName(null);
                  }
                }}
              />
              {fileName || "+ Dosya yükle"}
            </label>
          </div>

          {/* KVKK Checkbox */}
          <div className="mb-8 text-left">
            <label className="flex items-center cursor-pointer text-[0.8rem] text-muted select-none">
              <input
                type="checkbox"
                name="kvkk_consent"
                checked={kvkkAccepted}
                onChange={(e) => setKvkkAccepted(e.target.checked)}
                className="sr-only"
                required
              />
              <span
                className={`h-5 w-5 border-2 rounded mr-3 relative transition-all flex-shrink-0 ${
                  kvkkAccepted
                    ? "bg-white border-white"
                    : "bg-transparent border-white/60 hover:border-white"
                }`}
              >
                {kvkkAccepted && (
                  <span className="absolute left-[5px] top-[2px] w-[6px] h-3 border-dark border-r-2 border-b-2 rotate-45" />
                )}
              </span>
              <span className="tracking-wide">
                KVKK Aydınlatma Metni&apos;ni okudum ve kabul ediyorum.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-8 py-4 px-8 bg-transparent border border-white/30 text-white/70 text-[0.75rem] tracking-[0.2em] uppercase cursor-pointer transition-all hover:bg-white/10 hover:border-white/50 hover:text-white self-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>

          {submitStatus === 'success' && (
            <p className="text-green-400 text-sm animate-fade-in">
              ✓ Mesajınız başarıyla gönderildi!
            </p>
          )}

          {submitStatus === 'error' && (
            <p className="text-red-400 text-sm animate-fade-in">
              ✗ Bir hata oluştu. Lütfen tekrar deneyin.
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
