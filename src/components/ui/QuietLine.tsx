"use client";

interface QuietLineProps {
  text: string;
}

export function QuietLine({ text }: QuietLineProps) {
  return (
    <div className="py-8 text-center bg-light">
      <p className="flex items-center justify-center gap-6 font-editorial text-[clamp(1rem,1.8vw,1.3rem)] font-normal italic text-muted mx-auto max-w-full tracking-wide">
        <span className="inline-block w-[60px] md:w-[120px] h-px bg-gradient-to-r from-transparent to-black/20" />
        {text}
        <span className="inline-block w-[60px] md:w-[120px] h-px bg-gradient-to-l from-transparent to-black/20" />
      </p>
    </div>
  );
}
