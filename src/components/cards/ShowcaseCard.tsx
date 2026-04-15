import Image from "next/image";
import type { ShowcaseItem } from "@/types";

interface ShowcaseCardProps {
  item: ShowcaseItem;
  featured?: boolean;
}

export function ShowcaseCard({ item, featured }: ShowcaseCardProps) {
  return (
    <a
      href={item.href}
      className="group"
      style={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '8px',
        cursor: 'pointer',
        minHeight: '250px',
        display: 'block',
        ...(featured ? { gridRow: 'span 2' } : {}),
      }}
    >
      <Image
        src={item.image}
        alt={item.title.join(" ")}
        fill
        className="transition-transform duration-[800ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-105"
        style={{ objectFit: 'cover', objectPosition: 'top center' }}
        sizes={featured ? "(max-width: 768px) 100vw, 33vw" : "(max-width: 768px) 100vw, 33vw"}
        priority
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)',
          zIndex: 1,
          transition: 'background 0.4s ease',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          color: '#fff',
        }}
        className={featured ? "p-[30px] md:p-10" : "p-[30px]"}
      >
        <div style={{ maxWidth: featured ? '80%' : '70%' }}>
          <span style={{
            fontSize: '0.7rem',
            fontWeight: 500,
            letterSpacing: '0.15em',
            textTransform: 'uppercase' as const,
            opacity: 0.8,
            marginBottom: '10px',
            display: 'block',
          }}>
            {item.category}
          </span>
          <h2
            style={{
              fontWeight: 700,
              lineHeight: 1.1,
              textTransform: 'uppercase' as const,
              letterSpacing: '-0.02em',
              margin: 0,
            }}
            className={
              featured
                ? "text-[clamp(1.5rem,3vw,2.8rem)]"
                : "text-[clamp(1.5rem,4vw,2.5rem)]"
            }
          >
            {item.title.map((line, i) => (
              <span key={i}>
                {i > 0 && <br />}
                {line}
              </span>
            ))}
          </h2>
          {item.badge && (
            <span style={{
              display: 'inline-block',
              marginTop: '8px',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase' as const,
              color: '#e50914',
              background: 'rgba(0,0,0,0.5)',
              padding: '3px 10px',
              borderRadius: '3px',
            }}>
              {item.badge}
            </span>
          )}
        </div>
      </div>
    </a>
  );
}
