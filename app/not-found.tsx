"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { Search, Home, ArrowLeft, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function NotFound() {
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Floating animation for the search icon
      gsap.to(searchRef.current, {
        y: -20,
        rotation: 10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Shimmering background
      gsap.fromTo(containerRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1.5, ease: "power2.out" }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-zinc-950 px-6 overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-indigo-500/5 rounded-full blur-[120px] -z-10" />
      
      {/* Tactical 404 Icon */}
      <div className="relative mb-12">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse" />
        <div ref={searchRef} className="relative p-8 rounded-[2rem] bg-zinc-900 border border-white/5 shadow-2xl overflow-hidden">
             <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-indigo-500/50 to-transparent" />
             <Search className="w-16 h-16 text-indigo-500" />
        </div>
      </div>

      {/* Content */}
      <div className="text-center max-w-lg space-y-8">
        <div className="space-y-2">
            <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter uppercase opacity-50">
                404
            </h1>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase">
                Node <span className="text-indigo-500">Not Found</span>
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-[0.2em] text-[10px] mt-4">
                The requested neural coordinate does not exist in the current grid.
            </p>
        </div>

        <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-left">
            <div className="flex items-center gap-2 mb-2">
                <Terminal className="w-3 h-3 text-zinc-600" />
                <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">Protocol_Log</span>
            </div>
            <p className="text-[11px] text-indigo-400/80 leading-relaxed font-bold italic">
                {">"} Error: 404_TARGET_VOID
                <br />
                {">"} Signal status: DISCONNECTED
            </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
                asChild
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl shadow-lg shadow-indigo-900/20 transition-all active:scale-95"
            >
                <Link href="/">
                    <Home className="mr-2 w-4 h-4" /> RETURN_BASE
                </Link>
            </Button>
            <Button 
                onClick={() => window.history.back()}
                variant="outline" 
                className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl active:scale-95 transition-all"
            >
                <ArrowLeft className="mr-2 w-4 h-4" /> PREVIOUS_STATE
            </Button>
        </div>
      </div>

      {/* Holographic Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-size-[100%_2px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] opacity-10 z-10" />
    </div>
  );
}
