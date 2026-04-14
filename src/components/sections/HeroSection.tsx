import { showcaseItems } from "@/data/showcase";
import { ShowcaseCard } from "@/components/cards/ShowcaseCard";

export function HeroSection() {
  return (
    <>
      <style>{`
        .showcase-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 15px;
          max-width: 1400px;
          margin: 0 auto;
          min-height: calc(100vh - 140px);
        }
        @media (min-width: 768px) {
          .showcase-grid {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: 1fr 1fr;
            gap: 20px;
          }
        }
      `}</style>
      <section
        className="relative w-full bg-light"
        id="home"
        style={{ minHeight: '100vh', padding: '100px 20px 40px', boxSizing: 'border-box' }}
      >
        <div className="showcase-grid">
          {showcaseItems.map((item, i) => (
            <ShowcaseCard key={item.href} item={item} featured={i === 0} />
          ))}
        </div>
      </section>
    </>
  );
}
