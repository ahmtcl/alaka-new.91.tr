interface SectionHeadProps {
  children: React.ReactNode;
  light?: boolean;
  className?: string;
}

export function SectionHead({ children, light, className = "" }: SectionHeadProps) {
  return (
    <h2
      className={`text-[clamp(2rem,8vw,5rem)] font-extralight tracking-[0.3em] uppercase text-center mb-8 pt-8
        ${light ? "text-white/90" : "text-dark"}
        ${className}`}
    >
      {children}
    </h2>
  );
}
