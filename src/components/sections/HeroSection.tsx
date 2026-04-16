"use client";

import { showcaseItems as staticItems } from "@/data/showcase";
import { ShowcaseCard } from "@/components/cards/ShowcaseCard";
import { useHeroItems } from "@/lib/hooks";

export function HeroSection() {
  const { items } = useHeroItems();
  const showcaseItems = items.length > 0 ? items : staticItems;

  return (
    <section className="hero-section" id="home">
      <div className="showcase-grid">
        {showcaseItems.map((item, i) => (
          <ShowcaseCard key={item.href} item={item} featured={i === 0} />
        ))}
      </div>
    </section>
  );
}
