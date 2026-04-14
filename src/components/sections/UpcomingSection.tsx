import { SectionHead } from "@/components/ui/SectionHead";

export function UpcomingSection() {
  return (
    <section className="relative min-h-[80vh] flex items-center justify-center bg-dark overflow-hidden">
      {/* Background video */}
      <div className="absolute inset-0 opacity-40">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/1.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Content */}
      <div className="relative z-[1] text-center py-16">
        <SectionHead light>UPCOMING PROJECT</SectionHead>
      </div>
    </section>
  );
}
