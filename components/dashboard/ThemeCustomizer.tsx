"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { updateTeamColor } from "@/server/actions/team";
import { toast } from "sonner";
import { Palette, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ThemeCustomizerProps {
  teamId: number;
  currentPlan: string;
  initialColor: string;
}

export default function ThemeCustomizer({ teamId, currentPlan, initialColor }: ThemeCustomizerProps) {
  const [color, setColor] = useState(initialColor);
  const [loading, setLoading] = useState(false);

  const colors = [
    "#6366f1", // Indigo (Default)
    "#10b981", // Emerald
    "#f59e0b", // Amber
    "#ef4444", // Red
    "#3b82f6", // Blue
    "#a855f7", // Purple
    "#ec4899", // Pink
    "#06b6d4", // Cyan
  ];

  const handleUpdate = async (selectedColor: string) => {
    if (currentPlan === "FREE") {
      toast.error("Subscription required for neural color synthesis.");
      return;
    }

    setLoading(true);
    setColor(selectedColor);
    const result = await updateTeamColor(teamId, selectedColor);
    setLoading(false);

    if (result.success) {
      toast.success("Team frequency synchronized.");
      document.documentElement.style.setProperty("--primary", selectedColor);
    } else {
      toast.error(result.error || "Uplink failure");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
            variant="ghost" 
            size="icon" 
            className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 hover:bg-primary/20 hover:text-primary transition-all"
        >
          <Palette className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 bg-zinc-950 border-white/10 p-4 shadow-2xl rounded-[2rem] z-100">
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-2">
             <Sparkles className="w-4 h-4 text-primary" />
             <span className="text-[10px] font-black uppercase tracking-widest text-zinc-100">Color Synthesis</span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => handleUpdate(c)}
                disabled={loading}
                className={`w-10 h-10 rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                  color === c ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110" : "opacity-60"
                }`}
                style={{ backgroundColor: c }}
              >
                  {color === c && <div className="w-1.5 h-1.5 rounded-full bg-white shadow-lg" />}
              </button>
            ))}
          </div>

          {currentPlan === "FREE" && (
            <div className="pt-2">
                <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                    Module locked. Upgrade to PRO to enable color modification.
                </p>
            </div>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
