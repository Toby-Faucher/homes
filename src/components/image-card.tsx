"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ImageCard({ src, caption, onClick }: { src: string; caption: string; onClick?: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [cardVisible, setCardVisible] = useState(false);
  const [captionVisible, setCaptionVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

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
      className={`flex h-svh items-center justify-center transition-opacity duration-700 ease-out ${
        cardVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        className="relative w-[90vw] max-w-6xl cursor-pointer overflow-hidden rounded-lg border-2 border-black"
        onClick={onClick}
      >
      <Image
        src={src}
        alt=""
        width={1200}
        height={800}
        className="w-full object-cover"
      />
      <div
        ref={captionRef}
        className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-4 backdrop-blur-sm"
      >
        <p className="font-mono text-sm text-white">
          {displayedText}
          {captionVisible && displayedText.length < caption.length && (
            <span className="animate-pulse">|</span>
          )}
        </p>
      </div>
      </div>
    </div>
  );
}
