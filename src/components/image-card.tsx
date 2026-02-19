"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export function ImageCard({ src, caption }: { src: string; caption: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(caption.slice(0, i));
      if (i >= caption.length) clearInterval(interval);
    }, 30);

    return () => clearInterval(interval);
  }, [visible, caption]);

  return (
    <div
      ref={ref}
      className={`relative overflow-hidden rounded-lg transition-opacity duration-700 ease-out ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <Image
        src={src}
        alt=""
        width={1200}
        height={800}
        className="w-full object-cover"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-6 py-4 backdrop-blur-sm">
        <p className="font-mono text-sm text-white">
          {displayedText}
          {visible && displayedText.length < caption.length && (
            <span className="animate-pulse">|</span>
          )}
        </p>
      </div>
    </div>
  );
}
