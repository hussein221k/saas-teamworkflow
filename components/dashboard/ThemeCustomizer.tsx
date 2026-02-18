"use client";

import React, { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { updateTeamColor } from "@/server/actions/team";
import { toast } from "sonner";
import { Palette, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GlobalLoading from "@/app/loading";
import { redirect } from "next/navigation";
import { useAuth } from "@/app/AuthProvider";

interface ThemeCustomizerProps {
  team_id: string;
  currentPlan: string;
  initialColor: string;
}

export default function ThemeCustomizer({
  team_id,
  currentPlan,
  initialColor,
}: ThemeCustomizerProps) {
  const [state, setState] = useState({
    color: initialColor,
    loading: false,
    isMenuOpen: false,
  });

  const updateState = (updates: Partial<typeof state>) =>
    setState((prev) => ({ ...prev, ...updates }));

  const gridRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      redirect("/employee/login");
    }
  }, [user, isLoading]);

  if (isLoading) {
    return <GlobalLoading />;
  }

  // 🔹 Grid Animation
  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (state.isMenuOpen && gridRef.current) {
      gsap.fromTo(
        gridRef.current.children,
        { scale: 0, opacity: 0, rotate: -45 },
        { scale: 1, opacity: 1, rotate: 0, duration: 0.5, stagger: 0.05, ease: "back.out(1.7)" }
      );
      
      if (statusRef.current) {
        gsap.fromTo(
          statusRef.current,
          { y: 10, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, delay: 0.3, ease: "power2.out" }
        );
      }
    }
  }, [state.isMenuOpen]);

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

    updateState({ loading: true, color: selectedColor });
    if (!user?.email) {
      toast.error("User information not available.");
      updateState({ loading: false });
      return;
    }
    const result = await updateTeamColor(team_id, selectedColor, user.email);
    updateState({ loading: false });

    if (result.success) {
      toast.success("Team frequency synchronized.");
      document.documentElement.style.setProperty("--primary", selectedColor);
    } else {
      toast.error(result.error || "Uplink failure");
    }
  };

  return (
    <DropdownMenu onOpenChange={(open) => updateState({ isMenuOpen: open })}>
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
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-100">
              Color Synthesis
            </span>
          </div>

          <div 
            ref={gridRef}
            className="grid grid-cols-4 gap-3"
          >
            {colors.map((c) => (
              <button
                key={c}
                onClick={() => handleUpdate(c)}
                disabled={state.loading}
                className={`w-10 h-10 rounded-xl transition-all hover:scale-110 active:scale-95 flex items-center justify-center ${
                  state.color === c
                    ? "ring-2 ring-white ring-offset-2 ring-offset-black scale-110"
                    : "opacity-60"
                }`}
                style={{ backgroundColor: c }}
              >
                {state.color === c && (
                  <div className="w-1.5 h-1.5 rounded-full bg-white shadow-lg" />
                )}
              </button>
            ))}
          </div>

          {currentPlan === "FREE" && (
            <div 
              ref={statusRef}
              className="pt-2"
            >
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
