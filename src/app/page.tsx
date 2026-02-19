"use client";

import { useRef, useState, useEffect } from "react";
import { ImageCard } from "@/components/image-card";
import { ImageModal } from "@/components/image-modal";
import { ScrollDownButton, ScrollUpButton } from "@/components/scroll-button";

const images = [
  {
    id: 0,
    src: "/images/coffin.png",
    caption: "Hong Kong. A family of three in under fifteen square metres. The fan runs all night. No one complains about the noise.",
  },
  {
    id: 1,
    src: "/images/colorful.png",
    caption: "Nyhavn, Copenhagen. Each facade a different colour, as if the city couldn't agree on who lived here — and decided everyone did.",
  },
  {
    id: 2,
    src: "/images/water-village.png",
    caption: "Ha Long Bay, Vietnam. Hundreds of families live on the water, raising fish beneath their floors, reading tides the way others read clocks.",
  },
  {
    id: 3,
    src: "/images/huts.png",
    caption: "Beehive houses, Syria. Domes of mud and straw that breathe — keeping the inside cool without a single kilowatt of power.",
  },
  {
    id: 4,
    src: "/images/stilts.png",
    caption: "Bangladesh. Built on stilts because the river comes every year without fail. Home here means knowing when to be higher than the water.",
  },
  {
    id: 5,
    src: "/images/tiny-home.png",
    caption: "A tiny home, somewhere in the woods. Everything has its place. There is no room for anything that doesn't belong.",
  },
  {
    id: 6,
    src: "/images/van.png",
    caption: "An Alpine meadow, Tuesday morning. He said he gave up the lease two years ago and hasn't missed a single thing inside it.",
  },
  {
    id: 7,
    src: "/images/nature.png",
    caption: "Shengshan Island, China. The village was abandoned in the 1990s. The vines moved in quietly, as tenants sometimes do.",
  },
  {
    id: 8,
    src: "/images/destroyed.png",
    caption: "After the earthquake, they searched for three days. The building had stood for sixty years. It came down in eleven seconds.",
  },
  {
    id: 9,
    src: "/images/log.png",
    caption: "Home is wherever you fit. Wherever you feel the walls around you and decide, for now, this is enough.",
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
            <ImageCard src={img.src} caption={img.caption} index={i} total={images.length} onClick={() => setSelectedImage({ src: img.src, caption: img.caption })} />
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
