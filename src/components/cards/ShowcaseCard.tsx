import type { ShowcaseItem } from "@/types";

interface ShowcaseCardProps {
  item: ShowcaseItem;
  featured?: boolean;
}

export function ShowcaseCard({ item, featured }: ShowcaseCardProps) {
  const cardClass = `showcase-card${featured ? " featured" : ""}`;

  return (
    <article className={cardClass} onClick={() => {
      const el = document.querySelector(item.href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      } else {
        location.href = item.href;
      }
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={item.image} alt={item.title.join(" ")} loading="eager" />

      <div className="showcase-content">
        <span className="showcase-label">{item.category}</span>
        {item.title.map((line, i) => (
          <h2
            key={i}
            className="showcase-title"
            style={featured ? { fontSize: "clamp(1.5rem, 3vw, 2.8rem)" } : undefined}
          >
            {line}
          </h2>
        ))}
        {item.badge && (
          <span className="showcase-badge">{item.badge}</span>
        )}
      </div>
    </article>
  );
}
