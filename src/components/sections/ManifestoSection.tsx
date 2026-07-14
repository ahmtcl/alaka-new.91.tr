"use client";

import { SectionHead } from "@/components/ui/SectionHead";
import { QuietLine } from "@/components/ui/QuietLine";
import { useSiteContent } from "@/lib/hooks";

const DEFAULT_BODY = `Görüntülerin, seslerin ve sözcüklerin hızla tükendiği bir çağda biz, insanın kendisiyle, doğayla ve birbirleriyle yeniden bağ kurabileceği hikâyeler üretiriz.

Her ALAKA projesi tesadüfe değil, düşünce, vicdan ve sezgiyle doğar.

Bu yüzden ALAKA bir marka değil, üretmenin ve anlamı çoğaltmanın yolculuğudur. Bir markadan çok; bir ekosistem, bir okul, bir hatırlama alanı...

Bizim için her üretim bir iz bırakma sorumluluğudur. Samimiyet, estetik dürüstlük, insan merkezlilik ve çeşitlilik her işimizin özüdür.`;

export function ManifestoSection({ id }: { id?: string }) {
  const { content } = useSiteContent();

  const quietLine = content.quiet_line || "Hikâyesi olmayan hiçbir şeyle alakamız yok.";
  const title = content.manifesto_title || "ALAKA MEDIA";
  const body = content.manifesto_body || DEFAULT_BODY;
  const paragraphs = body.split(/\n\n+/).filter(Boolean);
  const footer = content.manifesto_footer || "Her ALAKA projesi bir cevaptan çok bir sorudur — çünkü değişim sorularla başlar.";

  return (
    <section className="py-16 px-8 bg-light" id={id}>
      <QuietLine text={quietLine} />

      <div className="max-w-[800px] mx-auto text-center mt-[60px]">
        <SectionHead>{title}</SectionHead>

        {paragraphs.map((p, i) => (
          <p
            key={i}
            className={
              i === 0
                ? "text-[clamp(1.1rem,2.5vw,1.4rem)] font-light leading-relaxed text-dark mb-8"
                : "text-[clamp(0.95rem,1.8vw,1.1rem)] font-light leading-[1.9] text-muted mb-6"
            }
          >
            {p}
          </p>
        ))}

        <p className="text-[clamp(1rem,2vw,1.2rem)] font-normal italic leading-[1.7] text-dark mt-8 pt-8 border-t border-black/10">
          {footer}
        </p>
      </div>
    </section>
  );
}
