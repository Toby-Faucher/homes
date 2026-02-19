"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const captionPositions = [
  "bottom-0 left-0 right-0",
  "bottom-4 left-4 right-auto max-w-sm rounded-lg",
  "bottom-4 right-4 left-auto max-w-sm rounded-lg text-right",
  "top-4 left-4 right-auto max-w-sm rounded-lg",
] as const;

const layoutVariants = [
  "w-[90vw] max-w-6xl",
  "w-[70vw] max-w-4xl",
  "w-[95vw] max-w-7xl",
] as const;

const entranceVariants = [
  { hidden: "opacity-0 translate-y-8",   visible: "opacity-100 translate-y-0" },
  { hidden: "opacity-0 -translate-x-12", visible: "opacity-100 translate-x-0" },
  { hidden: "opacity-0 translate-x-12",  visible: "opacity-100 translate-x-0" },
  { hidden: "opacity-0 scale-95",        visible: "opacity-100 scale-100" },
] as const;

// How far (in %) the parallax wrapper extends beyond the card on each side.
// The parallax translateY must stay within this budget.
const PARALLAX_INSET = 10;
const PARALLAX_FACTOR = 0.06;
const PARALLAX_MAX_PX = 40;

export function ImageCard({
  src,
  caption,
  index,
  total,
  onClick,
}: {
  src: string;
  caption: string;
  index: number;
  total: number;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  const position = captionPositions[index % captionPositions.length];
  const layout = layoutVariants[index % layoutVariants.length];
  const entrance = entranceVariants[index % entranceVariants.length];

  // Fade in the card when it enters view
  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCardVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallax: shift the oversized image wrapper vertically within its clipping parent
  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;

    const onScroll = () => {
      const rect = card.getBoundingClientRect();
      const cardCenter = rect.top + rect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const raw = (cardCenter - viewportCenter) * PARALLAX_FACTOR;
      const offset = Math.max(-PARALLAX_MAX_PX, Math.min(PARALLAX_MAX_PX, raw));
      image.style.transform = `translateY(${offset}px)`;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Start typewriter when the caption overlay is visible
  useEffect(() => {
    const el = captionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setCaptionVisible(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!captionVisible) return;
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(caption.slice(0, i));
      if (i >= caption.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, [captionVisible, caption]);

  return (
    <div
      ref={cardRef}
      className={`flex h-svh items-center justify-center transition-all duration-700 ease-out ${
        cardVisible ? entrance.visible : entrance.hidden
      }`}
    >
      <div
        className={`relative cursor-pointer overflow-hidden rounded-lg border-2 border-black ${layout}`}
        onClick={onClick}
      >
        {/* Fixed 3:2 aspect ratio so all images are consistently proportioned */}
        <div className="aspect-[3/2]" />

        {/* Parallax wrapper extends beyond the card by PARALLAX_INSET % on all sides,
            giving the translateY room to move without ever revealing a gap */}
        <div
          ref={imageRef}
          className="absolute"
          style={{ inset: `-${PARALLAX_INSET}%` }}
        >
          <Image
            src={src}
            alt=""
            fill
            className="object-cover object-center"
            sizes="95vw"
          />
        </div>

        {/* Progress counter */}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-xs text-white/50 backdrop-blur-sm">
          {index + 1} / {total}
        </div>

        {/* Caption */}
        <div
          ref={captionRef}
          className={`absolute z-10 bg-black/60 px-6 py-4 backdrop-blur-sm ${position}`}
        >
          <p className="font-[family-name:var(--font-lora)] text-sm italic leading-relaxed text-white">
            {displayedText}
            {captionVisible && displayedText.length < caption.length && (
              <span className="not-italic animate-pulse">|</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
