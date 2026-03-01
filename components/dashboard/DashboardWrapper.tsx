"use client";

import React, { useEffect, useRef } from "react";
import { Info, PhoneCall } from "lucide-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DashboardWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const wrapperRef = useRef(null);

  return (
    <div
      ref={wrapperRef}
      className="flex h-screen bg-black w-full overflow-hidden relative"
    >
      {/* Decorative Glow Pull Effect */}
      <div className="absolute top-0 right-1/4 w-0.5 h-full bg-linear-to-b from-transparent via-primary/20 to-transparent pointer-events-none animate-pulse" />
      <div className="absolute top-1/4 left-0 w-full h-px bg-linear-to-r from-transparent via-primary/10 to-transparent pointer-events-none" />

      {/* Floating Action Menu (Quick Nav) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-100 flex items-center gap-2 p-1.5 rounded-2xl bg-zinc-900/80 backdrop-blur-2xl border border-white/5 shadow-2xl animate-in slide-in-from-bottom-5 duration-1000">
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/about">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all group">
                <Info className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-zinc-950 text-white border-white/10 uppercase font-black text-[9px] tracking-widest px-3"
          >
            Protocol Overview
          </TooltipContent>
        </Tooltip>

        <div className="w-px h-4 bg-white/10" />

        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/contact">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-emerald-500/20 hover:text-emerald-500 transition-all group">
                <PhoneCall className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent
            side="top"
            className="bg-zinc-950 text-white border-white/10 uppercase font-black text-[9px] tracking-widest px-3"
          >
            Emergency Contact
          </TooltipContent>
        </Tooltip>

        {/* FEATURE: Billing — Upgrade Hub link. Uncomment when enabling billing.
        <div className="w-px h-4 bg-white/10" />
        <Tooltip>
          <TooltipTrigger asChild>
            <Link href="/billing">
              <div className="px-4 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-all group gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Upgrade Hub
                </span>
              </div>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="top" className="bg-zinc-950 text-white border-white/10 uppercase font-black text-[9px] tracking-widest px-3">
            Subscription Control
          </TooltipContent>
        </Tooltip>
        */}
      </div>

      {children}
    </div>
  );
}
