"use client";

import { useUpcomingItems } from "@/lib/hooks";

export function UpcomingSection() {
  const { items, loading } = useUpcomingItems();

  // Fallback to static video if no Firestore data
  const videoUrl = items.length > 0 ? items[0].videoUrl : "/videos/4.mp4";

  if (loading) return null;

  return (
    <section className="relative overflow-hidden bg-light -mb-px">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="w-full block"
        style={{ objectFit: 'cover', marginTop: '-1px', marginBottom: '-1px' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </section>
  );
}
