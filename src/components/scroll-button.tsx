"use client";

import { ChevronDown, ChevronUp, ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const glassClass =
  "border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white";

export function ScrollDownButton({
  onClick,
  visible,
  mode = "normal",
}: {
  onClick: () => void;
  visible: boolean;
  mode?: "title" | "normal" | "closing";
}) {
  const isWide = mode === "title" || mode === "closing";

  return (
    <Button
      variant="outline"
      size={isWide ? "default" : "icon"}
      onClick={onClick}
      className={`fixed bottom-8 left-1/2 z-10 -translate-x-1/2 transition-all duration-300 hover:scale-105 ${glassClass} ${
        isWide ? "gap-2 rounded-full px-6" : "rounded-full hover:scale-125"
      } ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      {mode === "title" && (
        <>
          <span className="text-sm font-light">Begin</span>
          <ChevronDown className="h-4 w-4 animate-bounce" />
        </>
      )}
      {mode === "normal" && (
        <ChevronDown className="h-5 w-5 animate-bounce" />
      )}
      {mode === "closing" && (
        <>
          <ArrowUp className="h-4 w-4" />
          <span className="text-sm font-light">Go back up</span>
        </>
      )}
    </Button>
  );
}

export function ScrollUpButton({
  onClick,
  visible,
}: {
  onClick: () => void;
  visible: boolean;
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`fixed left-1/2 top-8 z-10 -translate-x-1/2 rounded-full transition-all duration-300 hover:scale-125 ${glassClass} ${
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none -translate-y-4 opacity-0"
      }`}
    >
      <ChevronUp className="h-5 w-5 animate-bounce" />
    </Button>
  );
}
