"use client";

import { useUpcomingItems } from "@/lib/hooks";
import { useRef, useState, useEffect, useCallback } from "react";

const FADE_MS = 800;
const FALLBACK = "/videos/4.mp4";

export function UpcomingSection() {
  const { items, loading } = useUpcomingItems();

  const videoA = useRef<HTMLVideoElement>(null);
  const videoB = useRef<HTMLVideoElement>(null);
  const [showA, setShowA] = useState(true);
  const currentIdxRef = useRef(0);
  const urlsRef = useRef<string[]>([FALLBACK]);
  const initialized = useRef(false);

  const activeItems = items.filter((i) => i.active);
  const videoUrls = activeItems.length > 0
    ? activeItems.map((i) => i.videoUrl)
    : [FALLBACK];
  urlsRef.current = videoUrls;

  // Fallback ile hemen başlat (loading beklemeden)
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    if (videoA.current) {
      videoA.current.src = FALLBACK;
      videoA.current.load();
      videoA.current.play().catch(() => {});
    }
  }, []);

  // Firestore verisi gelince A'yı güncelle (sadece hâlâ fallback oynuyorsa)
  useEffect(() => {
    if (loading || activeItems.length === 0) return;
    if (videoA.current && showA) {
      // A oynuyor, kaynağını güncelle — bitince doğal geçiş yapacak
      videoA.current.src = activeItems[0].videoUrl;
      videoA.current.load();
      videoA.current.play().catch(() => {});
    }
    // B'yi preload et
    if (videoB.current) {
      videoB.current.src = activeItems[1]?.videoUrl ?? activeItems[0].videoUrl;
      videoB.current.load();
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleEndedA = useCallback(() => {
    const urls = urlsRef.current;
    const nextIdx = (currentIdxRef.current + 1) % urls.length;
    currentIdxRef.current = nextIdx;

    if (videoB.current) {
      videoB.current.currentTime = 0;
      videoB.current.play().catch(() => {});
    }
    setShowA(false);

    setTimeout(() => {
      const nextNextIdx = (nextIdx + 1) % urls.length;
      if (videoA.current) {
        videoA.current.src = urls[nextNextIdx];
        videoA.current.load();
      }
    }, FADE_MS + 100);
  }, []);

  const handleEndedB = useCallback(() => {
    const urls = urlsRef.current;
    const nextIdx = (currentIdxRef.current + 1) % urls.length;
    currentIdxRef.current = nextIdx;

    if (videoA.current) {
      videoA.current.currentTime = 0;
      videoA.current.play().catch(() => {});
    }
    setShowA(true);

    setTimeout(() => {
      const nextNextIdx = (nextIdx + 1) % urls.length;
      if (videoB.current) {
        videoB.current.src = urls[nextNextIdx];
        videoB.current.load();
      }
    }, FADE_MS + 100);
  }, []);

  return (
    <section
      className="relative overflow-hidden bg-light -mb-px"
      style={{ display: "grid" }}
    >
      <video
        ref={videoA}
        muted
        playsInline
        onEnded={handleEndedA}
        style={{
          gridArea: "1/1",
          width: "100%",
          display: "block",
          objectFit: "cover",
          marginTop: "-1px",
          marginBottom: "-1px",
          opacity: showA ? 1 : 0,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
          zIndex: showA ? 1 : 0,
        }}
      />
      <video
        ref={videoB}
        muted
        playsInline
        onEnded={handleEndedB}
        style={{
          gridArea: "1/1",
          width: "100%",
          display: "block",
          objectFit: "cover",
          marginTop: "-1px",
          marginBottom: "-1px",
          opacity: showA ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease-in-out`,
          zIndex: showA ? 0 : 1,
        }}
      />
    </section>
  );
}

