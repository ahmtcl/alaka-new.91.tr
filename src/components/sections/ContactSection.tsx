"use client";

import { useEffect, useState } from "react";
import { SectionHead } from "@/components/ui/SectionHead";
import { useSiteContent } from "@/lib/hooks";
import { addContactForm, getFooter, type FirestoreFooter } from "@/lib/firestore";
import { Modal } from "@/components/ui/Modal";

export function ContactSection() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [disclosureAccepted, setDisclosureAccepted] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [disclosureOpen, setDisclosureOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [footerData, setFooterData] = useState<FirestoreFooter | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [fileWarning, setFileWarning] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const { content } = useSiteContent();

  useEffect(() => {
    getFooter().then(setFooterData);
  }, []);

  // Dosya boyutu limiti: 30 MB
  const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30 MB in bytes
  
  // İzin verilen dosya formatları
  const ALLOWED_FORMATS = [
    '.doc', '.docx',           // Word
    '.pdf',                     // PDF
    '.jpg', '.jpeg',           // JPEG
    '.xls', '.xlsx',           // Excel
    '.png'                      // PNG
  ];
  
  const ALLOWED_MIME_TYPES = [
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/pdf',
    'image/jpeg',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/png'
  ];

  const subtitle = content.contact_subtitle || "Birlikte düşüneceksek, yaz.";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Dosya kontrolü
    if (!selectedFile) {
      setFileWarning(true);
      setTimeout(() => setFileWarning(false), 5000);
      return;
    }
    
    // Dosya boyutu kontrolü (ekstra güvenlik)
    if (selectedFile.size > MAX_FILE_SIZE) {
      setFileError(`Dosya boyutu 30 MB'dan büyük olamaz. (${(selectedFile.size / 1024 / 1024).toFixed(2)} MB)`);
      return;
    }
    
    if (!disclosureAccepted || !termsAccepted) {
      alert("Lütfen tüm onay kutularını kabul edin.");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    const formEl = e.currentTarget;

    try {
      const formData = new FormData(formEl);
      const name = formData.get('name') as string;
      const email = formData.get('email') as string;
      const message = formData.get('message') as string;

      let attachmentUrl: string | undefined;
      let attachmentName: string | undefined;

      // Upload file via API route (server-side, bypasses Storage rules)
      if (selectedFile) {
        try {
          const uploadData = new FormData();
          uploadData.append("file", selectedFile);
          const res = await fetch("/api/upload-file", { method: "POST", body: uploadData });
          if (res.ok) {
            const data = await res.json();
            attachmentUrl = data.url;
            attachmentName = data.name;
          } else {
            const err = await res.json().catch(() => ({ error: 'Dosya yükleme başarısız' }));
            setFileError(err.error || 'Dosya yükleme başarısız');
            setIsSubmitting(false);
            return;
          }
        } catch (uploadError) {
          console.error('Dosya yükleme hatası:', uploadError);
          setFileError('Dosya yüklenirken bir hata oluştu');
          setIsSubmitting(false);
          return;
        }
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
      formEl.reset();
      setFileName(null);
      setSelectedFile(null);
      setDisclosureAccepted(false);
      setTermsAccepted(false);
      setFileError(null);
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
          <div className="flex flex-col gap-2">
            <div
              className="flex items-center gap-4 py-4"
              style={{ borderBottom: "1px solid rgba(255,255,255,0.2)" }}
            >
              <label className="text-[0.85rem] text-white/50 cursor-pointer hover:text-white/80 transition-colors">
                <input
                  type="file"
                  name="attachment"
                  className="hidden"
                  accept={ALLOWED_FORMATS.join(',')}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      // Dosya boyutu kontrolü
                      if (file.size > MAX_FILE_SIZE) {
                        setFileError(`Dosya boyutu 30 MB'dan büyük olamaz. (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
                        setSelectedFile(null);
                        setFileName(null);
                        e.target.value = '';
                        return;
                      }
                      
                      // Dosya formatı kontrolü
                      const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase();
                      const isValidFormat = ALLOWED_FORMATS.includes(fileExtension) || 
                                          ALLOWED_MIME_TYPES.includes(file.type);
                      
                      if (!isValidFormat) {
                        setFileError('Sadece Word, PDF, JPEG, Excel ve PNG dosyaları yüklenebilir.');
                        setSelectedFile(null);
                        setFileName(null);
                        e.target.value = '';
                        return;
                      }
                      
                      // Dosya geçerli
                      setSelectedFile(file);
                      setFileName(`✓ ${file.name}`);
                      setFileWarning(false);
                      setFileError(null);
                    } else {
                      setSelectedFile(null);
                      setFileName(null);
                      setFileError(null);
                    }
                  }}
                />
                {fileName || "+ Dosya yükle"}
              </label>
            </div>
            
            {/* Dosya yükleme bilgi notu */}
            <p className="text-[0.7rem] text-white/40 leading-relaxed">
              Maksimum 30 MB | Word, PDF, JPEG, Excel, PNG formatları kabul edilir
            </p>
            
            {/* Dosya hatası */}
            {fileError && (
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-red-400 text-xs animate-fade-in">
                <div className="flex items-center gap-2">
                  <span className="text-base">⚠</span>
                  <span>{fileError}</span>
                </div>
              </div>
            )}
          </div>

          {/* KVKK & Terms Checkboxes */}
          <div className="space-y-4 mb-8 text-left">
            {/* Checkbox 1: Disclosure */}
            <label className="flex items-start cursor-pointer text-[0.8rem] text-muted select-none">
              <input
                type="checkbox"
                name="disclosure_consent"
                checked={disclosureAccepted}
                onChange={(e) => setDisclosureAccepted(e.target.checked)}
                className="sr-only"
                required
              />
              <span
                className={`h-5 w-5 border-2 rounded mr-3 relative transition-all flex-shrink-0 mt-0.5 ${
                  disclosureAccepted
                    ? "bg-white border-white"
                    : "bg-transparent border-white/60 hover:border-white"
                }`}
              >
                {disclosureAccepted && (
                  <span className="absolute left-[5px] top-[2px] w-[6px] h-3 border-dark border-r-2 border-b-2 rotate-45" />
                )}
              </span>
              <span className="tracking-wide">
                <button
                  type="button"
                  onClick={() => setDisclosureOpen(true)}
                  className="underline bg-transparent border-0 p-0 text-white cursor-pointer inline font-inherit text-inherit hover:text-white/80 transition-colors"
                >
                  Temas Formu Aydınlatma Metni
                </button>
                &apos;ni okudum, anladım.
              </span>
            </label>

            {/* Checkbox 2: Project Terms */}
            <label className="flex items-start cursor-pointer text-[0.8rem] text-muted select-none">
              <input
                type="checkbox"
                name="terms_consent"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="sr-only"
                required
              />
              <span
                className={`h-5 w-5 border-2 rounded mr-3 relative transition-all flex-shrink-0 mt-0.5 ${
                  termsAccepted
                    ? "bg-white border-white"
                    : "bg-transparent border-white/60 hover:border-white"
                }`}
              >
                {termsAccepted && (
                  <span className="absolute left-[5px] top-[2px] w-[6px] h-3 border-dark border-r-2 border-b-2 rotate-45" />
                )}
              </span>
              <span className="tracking-wide leading-relaxed">
                Gönüllü olarak ilettiğim proje fikirleri, senaryo veya konseptlerin{" "}
                <button
                  type="button"
                  onClick={() => setTermsOpen(true)}
                  className="underline bg-transparent border-0 p-0 text-white cursor-pointer inline font-inherit text-inherit hover:text-white/80 transition-colors"
                >
                  Proje Fikri ve Senaryo Gönderim Şartları
                </button>
                &apos;na tabi olduğunu okudum ve bu şartları gayrikabil-i rücu olarak kabul ediyorum.
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !disclosureAccepted || !termsAccepted}
            className="mt-8 py-4 px-8 bg-transparent border border-white/30 text-white/70 text-[0.75rem] tracking-[0.2em] uppercase cursor-pointer transition-all hover:bg-white/10 hover:border-white/50 hover:text-white self-start disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Gönderiliyor...' : 'Gönder'}
          </button>

          {/* File Upload Warning */}
          {fileWarning && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 text-red-400 text-sm animate-fade-in">
              <div className="flex items-center gap-2">
                <span className="text-lg">⚠</span>
                <span>Lütfen devam etmek için bir dosya yükleyin.</span>
              </div>
            </div>
          )}

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

      {/* Contact Form Disclosure Modal */}
      <Modal
        isOpen={disclosureOpen}
        onClose={() => setDisclosureOpen(false)}
        title={footerData?.contactFormDisclosureTitle.split(" - ")[0] || "ALAKA MEDIA"}
        subtitle={footerData?.contactFormDisclosureTitle.split(" - ")[1] || "Temas Formu Aydınlatma Metni"}
      >
        <div dangerouslySetInnerHTML={{ __html: footerData?.contactFormDisclosureContent || "" }} />
      </Modal>

      {/* Project Idea and Script Submission Terms Modal */}
      <Modal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title={footerData?.projectTermsTitle.split(" - ")[0] || "ALAKA MEDIA"}
        subtitle={footerData?.projectTermsTitle.split(" - ")[1] || "Proje Fikri ve Senaryo Gönderim Şartları"}
      >
        <div dangerouslySetInnerHTML={{ __html: footerData?.projectTermsContent || "" }} />
      </Modal>
    </section>
  );
}
