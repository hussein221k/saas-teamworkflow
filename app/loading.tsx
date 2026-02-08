"use client";

import React, { useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import gsap from "gsap";
import { Activity, ShieldCheck, Zap } from "lucide-react";

export default function GlobalLoading() {
  const containerRef = useRef(null);
  const textRef = useRef(null);
  const pulseRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animation
      gsap.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.5, ease: "power2.out" }
      );

      // Pulse animation for the logo area
      gsap.to(pulseRef.current, {
        scale: 1.1,
        opacity: 0.5,
        duration: 1.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Shimmer animation for text
      gsap.fromTo(textRef.current,
        { opacity: 0.3 },
        { opacity: 1, duration: 1, repeat: -1, yoyo: true, ease: "none" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-zinc-950 px-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px] -z-10 animate-pulse" />
      
      {/* Tactical Loading Icon */}
      <div className="relative mb-8">
        <div ref={pulseRef} className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl scale-75" />
        <div className="relative p-6 rounded-3xl bg-zinc-900 border border-white/5 shadow-2xl overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
             <Activity className="w-12 h-12 text-indigo-500" />
        </div>
      </div>

      {/* Status Messages */}
      <div className="space-y-4 w-full max-w-sm">
        <div className="flex items-center justify-between px-2">
            <span ref={textRef} className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-400">
                Establishing Neural Link
            </span>
            <Zap className="w-3 h-3 text-indigo-500 animate-bounce" />
        </div>

        {/* Skeleton UI Preview */}
        <div className="space-y-3 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
            <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-xl bg-white/5" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-3 w-[60%] bg-white/5" />
                    <Skeleton className="h-2 w-[40%] bg-white/5" />
                </div>
            </div>
            <Skeleton className="h-px w-full bg-white/5" />
            <div className="space-y-2 mt-4">
                <Skeleton className="h-2 w-full bg-white/5" />
                <Skeleton className="h-2 w-[80%] bg-white/10" />
                <Skeleton className="h-2 w-[90%] bg-white/5" />
            </div>
        </div>

        <div className="flex justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 opacity-30">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Protocol Secured</span>
            </div>
            <div className="flex items-center gap-2 opacity-30">
                <Activity className="w-3 h-3 text-indigo-500" />
                <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-widest">Nodes Active</span>
            </div>
        </div>
      </div>

      {/* Holographic Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-size-[100%_2px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] opacity-20 z-10" />
    </div>
  );
}
