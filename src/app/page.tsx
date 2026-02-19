"use client";

import { useRef, useState, useEffect } from "react";
import { ImageCard } from "@/components/image-card";
import { ImageModal } from "@/components/image-modal";
import { ScrollDownButton, ScrollUpButton } from "@/components/scroll-button";

const images = [
  {
    id: 0,
    src: "https://picsum.photos/seed/1/1200/800",
    caption: "A fishing village in northern Portugal. The houses lean into each other like old friends sharing a secret.",
  },
  {
    id: 1,
    src: "https://picsum.photos/seed/2/1200/800",
    caption: "She said the rent was nothing — just promise to keep the garden alive.",
  },
  {
    id: 2,
    src: "https://picsum.photos/seed/3/1200/800",
    caption: "Three generations under one roof. The walls remember more arguments than anyone will admit.",
  },
  {
    id: 3,
    src: "https://picsum.photos/seed/4/1200/800",
    caption: "In Osaka, a four-square-meter apartment. He called it enough. He meant it.",
  },
  {
    id: 4,
    src: "https://picsum.photos/seed/5/1200/800",
    caption: "The door was painted blue to ward off evil spirits. Nobody believes that anymore, but nobody repaints it either.",
  },
  {
    id: 5,
    src: "https://picsum.photos/seed/6/1200/800",
    caption: "They built this place with their own hands the summer before the twins were born. The porch still slopes left.",
  },
  {
    id: 6,
    src: "https://picsum.photos/seed/7/1200/800",
    caption: "A houseboat on the Mekong. Home is wherever the current takes you, she said, and then she dropped anchor.",
  },
  {
    id: 7,
    src: "https://picsum.photos/seed/8/1200/800",
    caption: "The landlord hasn't visited in eleven years. The tenants have replaced every fixture, every pipe, every lock.",
  },
  {
    id: 8,
    src: "https://picsum.photos/seed/9/1200/800",
    caption: "Mud walls two feet thick keep the Saharan heat at bay. At night, the stars feel close enough to touch.",
  },
  {
    id: 9,
    src: "https://picsum.photos/seed/10/1200/800",
    caption: "After the fire, they rebuilt in the exact same spot. Some places hold you even when they're gone.",
  },
  {
    id: 10,
    src: "https://picsum.photos/seed/11/1200/800",
    caption: "A shipping container in Auckland, converted over six weekends. The neighbors stopped laughing by the third.",
  },
  {
    id: 11,
    src: "https://picsum.photos/seed/12/1200/800",
    caption: "The last house on the road before the mountain pass. In winter, the nearest neighbor is forty minutes away.",
  },
];

export default function Home() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [selectedImage, setSelectedImage] = useState<{ src: string; caption: string } | null>(null);

  const totalSections = images.length + 2;

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number((entry.target as HTMLElement).dataset.index);
            if (!isNaN(index)) {
              setCurrentIndex(index);
              setIsAtEnd(index === totalSections - 1);
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scrollToNext = () => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < images.length + 2) {
      cardRefs.current[nextIndex]?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToTop = () => {
    cardRefs.current[0]?.scrollIntoView({ behavior: "smooth" });
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
        {/* Title card */}
        <div
          data-index={0}
          ref={(el) => { cardRefs.current[0] = el; }}
          className="flex h-svh flex-col items-center justify-center text-center"
        >
          <h1 className="text-5xl font-light tracking-tight text-white sm:text-7xl">
            Homes
          </h1>
          <p className="mt-4 max-w-md text-lg text-white/60">
            A visual essay on the places we call ours
          </p>
        </div>

        {/* Image cards */}
        {images.map((img, i) => (
          <div
            key={img.id}
            data-index={i + 1}
            ref={(el) => { cardRefs.current[i + 1] = el; }}
            className="h-svh"
          >
            <ImageCard src={img.src} caption={img.caption} onClick={() => setSelectedImage({ src: img.src, caption: img.caption })} />
          </div>
        ))}

        {/* Closing card */}
        <div
          data-index={totalSections - 1}
          ref={(el) => { cardRefs.current[totalSections - 1] = el; }}
          className="flex h-svh flex-col items-center justify-center text-center"
        >
          <p className="max-w-lg text-xl font-light leading-relaxed text-white/70">
            Home is not always a place. Sometimes it is a person, a memory, or a door you never locked.
          </p>
        </div>
      </div>
      {!selectedImage && (
        <>
          <ScrollUpButton onClick={scrollToPrev} visible={currentIndex > 0 && !isAtEnd} />
          <ScrollDownButton
            onClick={isAtEnd ? scrollToTop : scrollToNext}
            visible
            mode={currentIndex === 0 ? "title" : isAtEnd ? "closing" : "normal"}
          />
        </>
      )}
      {selectedImage && (
        <ImageModal
          src={selectedImage.src}
          caption={selectedImage.caption}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </main>
  );
}
