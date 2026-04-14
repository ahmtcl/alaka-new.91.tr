"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

interface CarouselProps {
  images: string[];
  alt: string;
  aspectRatio?: string;
  objectPosition?: string;
  onSlideClick?: (index: number) => void;
}

export function Carousel({ images, alt, aspectRatio = "aspect-[4/5]", objectPosition = "object-top", onSlideClick }: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  // Auto-slide on mobile
  useEffect(() => {
    if (!emblaApi) return;
    const isMobile = window.innerWidth <= 768;
    if (!isMobile) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 2500);

    return () => clearInterval(interval);
  }, [emblaApi]);

  return (
    <div className="relative group rounded-lg overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex">
          {images.map((src, i) => (
            <div
              key={i}
              className="min-w-0 flex-[0_0_100%]"
              onClick={() => onSlideClick?.(i)}
            >
              <div className={`relative ${aspectRatio}`}>
                <Image
                  src={src}
                  alt={`${alt} ${i + 1}`}
                  fill
                  className={`object-cover ${objectPosition}`}
                  sizes="(max-width: 600px) 100vw, (max-width: 900px) 50vw, 33vw"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); scrollPrev(); }}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-[30px] h-[30px] bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 cursor-pointer hover:bg-white hover:scale-110"
            aria-label="Önceki"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); scrollNext(); }}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-[30px] h-[30px] bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md z-10 cursor-pointer hover:bg-white hover:scale-110"
            aria-label="Sonraki"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation();
                emblaApi?.scrollTo(i);
              }}
              className={`w-1.5 h-1.5 rounded-full transition-colors cursor-pointer ${
                i === selectedIndex ? "bg-white" : "bg-white/40"
              }`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
