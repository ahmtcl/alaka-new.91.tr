import { SectionHead } from "@/components/ui/SectionHead";
import { QuietLine } from "@/components/ui/QuietLine";

export function ManifestoSection() {
  return (
    <section className="py-16 px-8 bg-light">
      <QuietLine text="Hikâyesi olmayan hiçbir şeyle alakamız yok." />

      <div className="max-w-[800px] mx-auto text-center mt-[60px]">
        <SectionHead>ALAKA MEDIA</SectionHead>

        <p className="text-[clamp(1.1rem,2.5vw,1.4rem)] font-light leading-relaxed text-dark mb-8">
          Görüntülerin, seslerin ve sözcüklerin hızla tükendiği bir çağda biz,
          insanın kendisiyle, doğayla ve birbirleriyle yeniden bağ kurabileceği
          hikâyeler üretiriz.
        </p>

        <p className="text-[clamp(0.95rem,1.8vw,1.1rem)] font-light leading-[1.9] text-muted mb-6">
          Her ALAKA projesi tesadüfe değil, düşünce, vicdan ve sezgiyle doğar.
        </p>

        <p className="text-[clamp(0.95rem,1.8vw,1.1rem)] font-light leading-[1.9] text-muted mb-6">
          Bu yüzden ALAKA bir marka değil, üretmenin ve anlamı çoğaltmanın
          yolculuğudur. Bir markadan çok; bir ekosistem, bir okul, bir hatırlama
          alanı...
        </p>

        <p className="text-[clamp(0.95rem,1.8vw,1.1rem)] font-light leading-[1.9] text-muted mb-6">
          Bizim için her üretim bir iz bırakma sorumluluğudur. Samimiyet, estetik
          dürüstlük, insan merkezlilik ve çeşitlilik her işimizin özüdür.
        </p>

        <p className="text-[clamp(1rem,2vw,1.2rem)] font-normal italic leading-[1.7] text-dark mt-8 pt-8 border-t border-black/10">
          Her ALAKA projesi bir cevaptan çok bir sorudur — çünkü değişim sorularla
          başlar.
        </p>
      </div>
    </section>
  );
}
