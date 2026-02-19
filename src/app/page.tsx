"use client";

import { useRef, useState, useEffect } from "react";
import { ImageCard } from "@/components/image-card";
import { ScrollDownButton, ScrollUpButton } from "@/components/scroll-button";

const images = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/${i + 1}/1200/800`,
  caption:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
}));

export default function Home() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = cardRefs.current.indexOf(
              entry.target as HTMLDivElement
            );
            if (index !== -1) {
              setCurrentIndex(index);
              setIsAtEnd(index === images.length - 1);
            }
          }
        }
      },
      { threshold: 0.5 }
    );

    for (const ref of cardRefs.current) {
      if (ref) observer.observe(ref);
    }

    return () => observer.disconnect();
  }, []);

  const scrollToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < images.length) {
      cardRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToPrev = () => {
    const prevIndex = currentIndex - 1;
    if (prevIndex >= 0) {
      cardRefs.current[prevIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <main className="px-4">
      <div className="flex flex-col">
        {images.map((img, i) => (
          <div
            key={img.id}
            ref={(el) => { cardRefs.current[i] = el; }}
          >
            <ImageCard src={img.src} caption={img.caption} />
          </div>
        ))}
      </div>
      {currentIndex > 0 && <ScrollUpButton onClick={scrollToPrev} />}
      {!isAtEnd && <ScrollDownButton onClick={scrollToNext} />}
    </main>
  );
}
