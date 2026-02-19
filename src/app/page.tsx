"use client";

import { useEffect, useRef, useState } from "react";
import { ImageCard } from "@/components/image-card";
import { ImageModal } from "@/components/image-modal";
import { ScrollDownButton, ScrollUpButton } from "@/components/scroll-button";

interface ImageEntry {
  id: number;
  src: string;
  caption: string;
  note?: string;
}

const images: ImageEntry[] = [
  {
    id: 0,
    src: "/images/coffin.png",
    caption:
      "Hong Kong. A family of three in under fifteen square metres. The fan runs all night. No one complains about the noise.",
  },
  {
    id: 1,
    src: "/images/colorful.png",
    caption:
      "Nyhavn, Copenhagen. Each facade a different colour, as if the city couldn't agree on who lived here — and decided everyone did.",
  },
  {
    id: 2,
    src: "/images/water-village.png",
    caption:
      "Ha Long Bay, Vietnam. Hundreds of families live on the water, raising fish beneath their floors, reading tides the way others read clocks.",
  },
  {
    id: 3,
    src: "/images/huts.png",
    caption:
      "Beehive houses, Syria. Domes of mud and straw that breathe — keeping the inside cool without a single kilowatt of power.",
  },
  {
    id: 4,
    src: "/images/stilts.png",
    caption:
      "Bangladesh. Built on stilts because the river comes every year without fail. Home here means knowing when to be higher than the water.",
  },
  {
    id: 5,
    src: "/images/tiny-home.png",
    caption:
      "A tiny home, somewhere in the woods. Everything has its place. There is no room for anything that doesn't belong.",
    note: "— Note: I stayed in this exact home for three days.",
  },
  {
    id: 6,
    src: "/images/van.png",
    caption:
      "An Alpine meadow, Tuesday morning. He said he gave up the lease two years ago and hasn't missed a single thing inside it.",
  },
  {
    id: 7,
    src: "/images/nature.png",
    caption:
      "Shengshan Island, China. The village was abandoned in the 1990s. The vines moved in quietly, as tenants sometimes do.",
  },
  {
    id: 8,
    src: "/images/destroyed.png",
    caption:
      "After the earthquake, they searched for three days. The building had stood for sixty years. It came down in eleven seconds.",
  },
  {
    id: 9,
    src: "/images/log.png",
    caption:
      "Home is wherever you fit. Wherever you feel the walls around you and decide, for now, this is enough.",
  },
];

// Snake connector between image cards.
// Uses actual pixel coordinates so getTotalLength() and strokeDasharray are in the same unit.
// Draws itself as the user scrolls — 0% when it enters the viewport bottom, 100% when its top hits the viewport top.
function SnakeConnector({ fromLeft }: { fromLeft: boolean }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const dot = dotRef.current;
    const container = containerRef.current;
    if (!svg || !path || !dot || !container) return;

    const H = 200;
    let totalLength = 0;

    const setup = () => {
      const W = container.offsetWidth;
      if (W === 0) return;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
      const sx = (fromLeft ? 0.28 : 0.72) * W;
      const ex = (fromLeft ? 0.72 : 0.28) * W;
      path.setAttribute("d", `M ${sx} 0 C ${sx} ${H / 2}, ${ex} ${H / 2}, ${ex} ${H}`);
      // Midpoint of this bezier always lands at the SVG centre
      dot.setAttribute("cx", `${W / 2}`);
      dot.setAttribute("cy", `${H / 2}`);
      totalLength = path.getTotalLength();
      path.style.strokeDasharray = `${totalLength}`;
      updateOffset();
    };

    const updateOffset = () => {
      if (totalLength === 0) return;
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;
      const progress = Math.max(0, Math.min(1, (vh - rect.top) / vh));
      path.style.strokeDashoffset = `${totalLength * (1 - progress)}`;
      // Dot fades in as the line passes through the midpoint (progress ~0.5)
      dot.style.opacity = `${Math.max(0, Math.min(1, (progress - 0.4) / 0.2))}`;
    };

    setup();
    window.addEventListener("scroll", updateOffset, { passive: true });
    const ro = new ResizeObserver(setup);
    ro.observe(container);

    return () => {
      window.removeEventListener("scroll", updateOffset);
      ro.disconnect();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromLeft]);

  return (
    <div ref={containerRef} className="pointer-events-none hidden md:block">
      <svg ref={svgRef} width="100%" height="200">
        <path
          ref={pathRef}
          stroke="rgba(255,255,255,0.45)"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />
        <circle
          ref={dotRef}
          r="3"
          fill="rgba(255,255,255,0.6)"
          style={{ opacity: 0 }}
        />
      </svg>
    </div>
  );
}

export default function Home() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const touchStartY = useRef<number>(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAtEnd, setIsAtEnd] = useState(false);
  const [selectedImage, setSelectedImage] = useState<
    { src: string; caption: string; note?: string } | null
  >(null);

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
      { threshold: 0.4 },
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (selectedImage) return;
      if (e.key === "ArrowDown" || e.key === "j") scrollToNext();
      if (e.key === "ArrowUp" || e.key === "k") scrollToPrev();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, currentIndex]);

  useEffect(() => {
    const onTouchStart = (e: TouchEvent) => {
      touchStartY.current = e.touches[0].clientY;
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (selectedImage) return;
      const delta = touchStartY.current - e.changedTouches[0].clientY;
      if (delta > 50) scrollToNext();
      if (delta < -50) scrollToPrev();
    };
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedImage, currentIndex]);

  const progressPct = (currentIndex / (totalSections - 1)) * 100;

  return (
    <>
      <div className="fixed inset-x-0 top-0 z-50 h-0.5">
        <div
          className={`h-full bg-white/30 transition-all duration-500 ease-out ${
            currentIndex === 0 ? "opacity-0" : "opacity-100"
          }`}
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <main className="px-4">
        <div className="flex flex-col">
          {/* Title card */}
          <div
            data-index={0}
            ref={(el) => {
              cardRefs.current[0] = el;
            }}
            className="flex h-svh flex-col items-center justify-center text-center"
          >
            <h1 className="text-5xl font-light tracking-tight text-white sm:text-7xl">
              Homes
            </h1>
            <p className="mt-4 max-w-md text-lg text-white/60">
              A visual essay on the places we call ours
            </p>
          </div>

          {/* Image cards with snake connectors */}
          {images.map((img, i) => (
            <div key={img.id}>
              <div
                data-index={i + 1}
                ref={(el) => {
                  cardRefs.current[i + 1] = el;
                }}
              >
                <ImageCard
                  src={img.src}
                  caption={img.caption}
                  note={img.note}
                  index={i}
                  total={images.length}
                  onClick={() =>
                    setSelectedImage({
                      src: img.src,
                      caption: img.caption,
                      note: img.note,
                    })
                  }
                />
              </div>
              {i < images.length - 1 && (
                <SnakeConnector fromLeft={i % 2 === 0} />
              )}
            </div>
          ))}

          {/* Closing card */}
          <div
            data-index={totalSections - 1}
            ref={(el) => {
              cardRefs.current[totalSections - 1] = el;
            }}
            className="flex h-svh flex-col items-center justify-center text-center"
          >
            <p className="max-w-lg text-xl font-light leading-relaxed text-white/70">
              Home is not always a place. Sometimes it is a person, a memory, or
              a door you never locked.
            </p>
            <p className="mt-8 text-sm text-white/30">made by toby</p>
          </div>
        </div>
        {!selectedImage && (
          <>
            <ScrollUpButton
              onClick={scrollToPrev}
              visible={currentIndex > 0 && !isAtEnd}
            />
            <ScrollDownButton
              onClick={isAtEnd ? scrollToTop : scrollToNext}
              visible
              mode={
                currentIndex === 0
                  ? "title"
                  : isAtEnd
                    ? "closing"
                    : "normal"
              }
            />
          </>
        )}
        {selectedImage && (
          <ImageModal
            src={selectedImage.src}
            caption={selectedImage.caption}
            note={selectedImage.note}
            onClose={() => setSelectedImage(null)}
          />
        )}
      </main>
    </>
  );
}
