"use client";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ScrollButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      variant="outline"
      size="icon"
      onClick={onClick}
      className="fixed bottom-8 left-1/2 z-10 -translate-x-1/2 rounded-full border-white/20 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
    >
      <ChevronDown className="h-5 w-5 animate-bounce" />
    </Button>
  );
}
