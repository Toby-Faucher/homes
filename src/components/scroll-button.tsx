"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const baseClass =
  "fixed left-1/2 z-10 -translate-x-1/2 rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white transition-transform duration-200 hover:scale-125";

export function ScrollDownButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`bottom-8 ${baseClass}`}
    >
      <ChevronDown className="h-5 w-5 animate-bounce" />
    </Button>
  );
}

export function ScrollUpButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className={`top-8 ${baseClass}`}
    >
      <ChevronUp className="h-5 w-5 animate-bounce" />
    </Button>
  );
}
