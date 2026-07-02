"use client";

import { useSiteContent } from "@/lib/hooks";

export function StatementDivider() {
  const { content } = useSiteContent();
  const text = content.statement_divider || "Bazı Hikâyeler Tamamlanmaz.";

  return (
    <section className="py-8 md:py-16 px-8 bg-light text-center">
      <div className="flex items-center justify-center gap-8 max-w-[1000px] mx-auto">
        <span className="flex-[0_0_80px] md:flex-[0_0_150px] h-px bg-gradient-to-r from-transparent to-black/30" />
        <p className="font-editorial text-[clamp(1.4rem,3.5vw,2.4rem)] font-normal italic text-dark m-0 tracking-[0.02em] leading-[1.3]">
          {text}
        </p>
        <span className="flex-[0_0_80px] md:flex-[0_0_150px] h-px bg-gradient-to-l from-transparent to-black/30" />
      </div>
    </section>
  );
}
