"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

const entranceVariants = [
  { hidden: "opacity-0 translate-y-8",   visible: "opacity-100 translate-y-0" },
  { hidden: "opacity-0 -translate-x-12", visible: "opacity-100 translate-x-0" },
  { hidden: "opacity-0 translate-x-12",  visible: "opacity-100 translate-x-0" },
] as const;

// How far (in %) the parallax wrapper extends beyond the card on each side.
const PARALLAX_INSET = 10;
const PARALLAX_FACTOR = 0.06;
const PARALLAX_MAX_PX = 40;

export function ImageCard({
  src,
  caption,
  note,
  index,
  total,
  onClick,
}: {
  src: string;
  caption: string;
  note?: string;
  index: number;
  total: number;
  onClick?: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [typewriterReady, setTypewriterReady] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [noteVisible, setNoteVisible] = useState(false);

  const imageOnLeft = index % 2 === 0;
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

  // After card visible: wait then start typewriter
  useEffect(() => {
    if (!cardVisible) return;
    const t = setTimeout(() => setTypewriterReady(true), 800);
    return () => clearTimeout(t);
  }, [cardVisible]);

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

  // Typewriter: runs once typewriterReady flips true
  useEffect(() => {
    if (!typewriterReady) return;
    setNoteVisible(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(caption.slice(0, i));
      if (i >= caption.length) {
        clearInterval(interval);
        setNoteVisible(true);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [typewriterReady, caption]);

  return (
    <div
      ref={cardRef}
      className={`flex items-center gap-10 py-20 px-8 transition-all duration-700 ease-out ${
        imageOnLeft ? "flex-row" : "flex-row-reverse"
      } ${cardVisible ? entrance.visible : entrance.hidden}`}
    >
      {/* Image */}
      <div
        className="relative shrink-0 cursor-pointer overflow-hidden rounded-2xl"
        style={{ width: "55vw", height: "62vh" }}
        onClick={onClick}
      >
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
            sizes="55vw"
          />
        </div>

        {/* Progress counter */}
        <div className="absolute right-3 top-3 z-10 rounded-full bg-black/40 px-2.5 py-1 font-[family-name:var(--font-geist-mono)] text-xs text-white/50 backdrop-blur-sm">
          {index + 1} / {total}
        </div>
      </div>

      {/* Caption */}
      <div className={`min-w-0 flex-1 ${imageOnLeft ? "pr-4 text-left" : "pl-4 text-right"}`}>
        <p className="font-[family-name:var(--font-lora)] text-sm md:text-base italic leading-relaxed text-white/90">
          {displayedText}
          {typewriterReady && displayedText.length < caption.length && (
            <span className="not-italic animate-pulse">|</span>
          )}
        </p>
        {note && (
          <p className={`mt-3 border-t border-white/20 pt-3 font-[family-name:var(--font-geist-sans)] text-xs font-light text-white/50 transition-opacity duration-700 ${noteVisible ? "opacity-100" : "opacity-0"}`}>
            {note}
          </p>
        )}
      </div>
    </div>
  );
}
