"use client";

import Image from "next/image";
import { X } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";

export function ImageModal({
  src,
  caption,
  onClose,
}: {
  src: string;
  caption: string;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [displayedText, setDisplayedText] = useState("");

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // Typewriter starts after open animation
  useEffect(() => {
    const delay = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        i++;
        setDisplayedText(caption.slice(0, i));
        if (i >= caption.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(delay);
  }, [caption]);

  const handleClose = useCallback(() => {
    setVisible(false);
    setTimeout(onClose, 300);
  }, [onClose]);

  // Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleClose]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      onClick={handleClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
      <Button
        variant="outline"
        size="icon"
        onClick={handleClose}
        className="fixed right-8 top-8 z-20 rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white transition-all duration-300 hover:scale-125"
      >
        <X className="h-5 w-5" />
      </Button>
      <div
        className={`relative z-10 w-[95vw] max-w-7xl transition-all duration-300 ${
          visible ? "scale-100 opacity-100" : "scale-90 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-lg border-2 border-black">
          <Image
            src={src}
            alt=""
            width={1200}
            height={800}
            className="w-full object-cover"
          />
          <div className="bg-black/60 px-6 py-4 backdrop-blur-sm">
            <p className="font-mono text-sm text-white">
              {displayedText}
              {displayedText.length < caption.length && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
