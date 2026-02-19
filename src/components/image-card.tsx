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
  "w-[90vw] max-w-6xl",    // standard
  "w-[70vw] max-w-4xl",    // narrow
  "w-[95vw] max-w-7xl",    // wide
] as const;

const entranceVariants = [
  { hidden: "opacity-0 translate-y-8",  visible: "opacity-100 translate-y-0" },
  { hidden: "opacity-0 -translate-x-12", visible: "opacity-100 translate-x-0" },
  { hidden: "opacity-0 translate-x-12",  visible: "opacity-100 translate-x-0" },
  { hidden: "opacity-0 scale-95",        visible: "opacity-100 scale-100" },
] as const;

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
      ([entry]) => {
        if (entry.isIntersecting) {
          setCardVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Parallax: shift image slightly based on scroll position
  useEffect(() => {
    const card = cardRef.current;
    const image = imageRef.current;
    if (!card || !image) return;

    const onScroll = () => {
      const rect = card.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      const cardCenter = rect.top + rect.height / 2;
      const offset = (cardCenter - viewportCenter) * 0.06;
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
      ([entry]) => {
        if (entry.isIntersecting) {
          setCaptionVisible(true);
          observer.disconnect();
        }
      },
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
      <div ref={imageRef} className="transition-transform duration-0">
        <Image
          src={src}
          alt=""
          width={1200}
          height={800}
          className="w-full scale-110 object-cover"
        />
      </div>
      {/* Progress counter */}
      <div className="absolute top-3 right-3 rounded-full bg-black/40 px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-xs text-white/50 backdrop-blur-sm">
        {index + 1} / {total}
      </div>
      <div
        ref={captionRef}
        className={`absolute bg-black/60 px-6 py-4 backdrop-blur-sm ${position}`}
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
