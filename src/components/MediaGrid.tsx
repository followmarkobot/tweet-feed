"use client";

import { useState, useEffect, useCallback } from "react";
import type { MediaItem } from "../lib/supabase";

interface MediaGridProps {
  media: MediaItem[];
}

interface MediaTileProps {
  item: MediaItem;
  onClick?: () => void;
}

function MediaTile({ item, onClick }: MediaTileProps) {
  const [failed, setFailed] = useState(false);

  if (failed) return null;

  if (item.type === "video") {
    return (
      <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt="Video thumbnail"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-[rgb(29,155,240)] bg-opacity-90 flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white ml-0.5"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
            </svg>
          </div>
        </div>
      </div>
    );
  }

  if (item.type === "gif") {
    return (
      <div className="relative w-full h-full cursor-pointer" onClick={onClick}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt="GIF"
          className="w-full h-full object-cover"
          onError={() => setFailed(true)}
        />
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs font-bold px-1.5 py-0.5 rounded">
          GIF
        </div>
      </div>
    );
  }

  return (
    /* eslint-disable-next-line @next/next/no-img-element */
    <img
      src={item.url}
      alt="Tweet media"
      className="w-full h-full object-cover cursor-pointer"
      onClick={onClick}
      onError={() => setFailed(true)}
    />
  );
}

function Lightbox({ 
  media, 
  currentIndex, 
  onClose, 
  onNext, 
  onPrev 
}: { 
  media: MediaItem[]; 
  currentIndex: number; 
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  const item = media[currentIndex];
  const hasMultiple = media.length > 1;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && hasMultiple) onNext();
      if (e.key === "ArrowLeft" && hasMultiple) onPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev, hasMultiple]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 left-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
      >
        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Navigation arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
          >
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Image counter */}
      {hasMultiple && (
        <div className="absolute top-4 right-4 z-10 text-white text-sm bg-black/50 px-3 py-1 rounded-full">
          {currentIndex + 1} / {media.length}
        </div>
      )}

      {/* Image */}
      <div 
        className="max-w-[90vw] max-h-[90vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={item.url}
          alt="Full size media"
          className="max-w-full max-h-[90vh] object-contain"
        />
      </div>
    </div>
  );
}

export default function MediaGrid({ media }: MediaGridProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const goToNext = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % media.length);
    }
  }, [lightboxIndex, media.length]);

  const goToPrev = useCallback(() => {
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + media.length) % media.length);
    }
  }, [lightboxIndex, media.length]);

  if (!media || media.length === 0) return null;

  const count = media.length;

  const renderLightbox = () => {
    if (lightboxIndex === null) return null;
    return (
      <Lightbox
        media={media}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={goToNext}
        onPrev={goToPrev}
      />
    );
  };

  if (count === 1) {
    return (
      <>
        <div className="mt-3 rounded-2xl overflow-hidden border border-[rgb(47,51,54)] max-h-[512px]">
          <MediaTile item={media[0]} onClick={() => openLightbox(0)} />
        </div>
        {renderLightbox()}
      </>
    );
  }

  if (count === 2) {
    return (
      <>
        <div className="mt-3 rounded-2xl overflow-hidden border border-[rgb(47,51,54)] grid grid-cols-2 gap-0.5 max-h-[288px]">
          {media.map((item, i) => (
            <div key={i} className="overflow-hidden h-[288px]">
              <MediaTile item={item} onClick={() => openLightbox(i)} />
            </div>
          ))}
        </div>
        {renderLightbox()}
      </>
    );
  }

  if (count === 3) {
    return (
      <>
        <div className="mt-3 rounded-2xl overflow-hidden border border-[rgb(47,51,54)] grid grid-cols-2 gap-0.5 max-h-[288px]">
          <div className="row-span-2 overflow-hidden h-[288px]">
            <MediaTile item={media[0]} onClick={() => openLightbox(0)} />
          </div>
          <div className="overflow-hidden h-[143px]">
            <MediaTile item={media[1]} onClick={() => openLightbox(1)} />
          </div>
          <div className="overflow-hidden h-[143px]">
            <MediaTile item={media[2]} onClick={() => openLightbox(2)} />
          </div>
        </div>
        {renderLightbox()}
      </>
    );
  }

  return (
    <>
      <div className="mt-3 rounded-2xl overflow-hidden border border-[rgb(47,51,54)] grid grid-cols-2 gap-0.5 max-h-[288px]">
        {media.slice(0, 4).map((item, i) => (
          <div key={i} className="overflow-hidden h-[143px]">
            <MediaTile item={item} onClick={() => openLightbox(i)} />
          </div>
        ))}
      </div>
      {renderLightbox()}
    </>
  );
}
