"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { AlertCircle, RotateCcw, Home, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string; status?: number };
  reset: () => void;
}) {
  const containerRef = useRef(null);
  const glichRef = useRef(null);

  // Categorize Error
  const isUnauthorized = error.message?.includes("Unauthorized") || error.status === 401;
  const isClientError = error.status ? error.status >= 400 && error.status < 500 : false;
  
  const errorTitle = isUnauthorized 
    ? "Access Denied" 
    : isClientError 
      ? "Invalid Protocol" 
      : "Protocol Interrupted";

  const errorMessage = isUnauthorized
    ? "Your neural credentials have expired or are insufficient for this sector."
    : isClientError
      ? "The system cannot process this request due to malformed data."
      : "Critical failure in neural synchronization. Secure connection dropped.";

  useEffect(() => {
    // Suppress internal system logs from appearing in the user console in production
    if (process.env.NODE_ENV === "production") {
        console.clear();
    }

    const ctx = gsap.context(() => {
      // ... same GSAP logic as before ...
      const tl = gsap.timeline({ repeat: -1 });
      tl.to(containerRef.current, {
        backgroundColor: "rgba(225, 29, 72, 0.05)",
        duration: 0.1,
      })
      .to(containerRef.current, {
        backgroundColor: "transparent",
        duration: 0.1,
      })
      .to(containerRef.current, {
        backgroundColor: "rgba(225, 29, 72, 0.03)",
        duration: 0.05,
        delay: 2
      })
      .to(containerRef.current, {
        backgroundColor: "transparent",
        duration: 0.1,
      });

      gsap.to(glichRef.current, {
        x: () => Math.random() * 4 - 2,
        y: () => Math.random() * 4 - 2,
        duration: 0.1,
        repeat: -1,
        ease: "none"
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="fixed inset-0 z-100 flex flex-col items-center justify-center bg-zinc-950 px-6 overflow-hidden font-sans">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-rose-500/10 rounded-full blur-[120px] -z-10" />
      
      {/* Tactical Error Icon and Status Code */}
      <div className="relative mb-12 flex flex-col items-center">
        <div className="absolute -top-16 text-[120px] font-black text-rose-500/5 select-none leading-none tracking-tighter">
            {error.status || 500}
        </div>
        <div className="absolute inset-0 bg-rose-500/20 rounded-full blur-2xl animate-pulse" />
        <div ref={glichRef} className="p-8 rounded-[2rem] bg-zinc-900 border border-rose-500/20 shadow-2xl relative overflow-hidden group">
             <div className="absolute inset-0 bg-linear-to-tr from-rose-500/5 to-transparent" />
             <AlertCircle className="w-16 h-16 text-rose-500 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>

      {/* Error Details */}
      <div className="text-center max-w-lg space-y-6 relative">
        <div className="space-y-4">
            <div className="flex flex-col items-center gap-2">
                <span className="bg-rose-500/10 text-rose-500 text-[10px] font-black px-3 py-1 rounded-full border border-rose-500/20 tracking-[0.2em] uppercase">
                    Status Code: {error.status || 500}
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                    {errorTitle.split(' ')[0]} <span className="text-rose-500 underline decoration-rose-500/30 underline-offset-8">{errorTitle.split(' ')[1] || ""}</span>
                </h1>
            </div>
            <p className="text-zinc-400 font-medium text-lg leading-relaxed max-w-md mx-auto">
                {errorMessage}
            </p>
            <div className="h-px w-24 bg-linear-to-r from-transparent via-rose-500/20 to-transparent mx-auto mt-4" />
        </div>

        {process.env.NODE_ENV !== "production" && (
            <div className="p-4 rounded-xl bg-black/40 border border-white/5 font-mono text-left group transition-all hover:border-rose-500/20">
                <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <Terminal className="w-3 h-3 text-zinc-600" />
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">System_Fault_Log</span>
                    </div>
                </div>
                <p className="text-[11px] text-rose-400/80 leading-relaxed font-semibold">
                    {error.message || "An unexpected system anomaly has occurred."}
                </p>
                {error.digest && (
                    <p className="text-[9px] text-zinc-600 mt-2 font-mono uppercase tracking-tighter">
                        Digest: {error.digest}
                    </p>
                )}
            </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button 
                onClick={isUnauthorized ? () => window.location.href = "/api/auth/login" : () => reset()}
                className="w-full sm:w-auto bg-rose-600 hover:bg-rose-500 text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl shadow-lg shadow-rose-900/40 transition-all active:scale-95 group"
            >
                {isUnauthorized ? "SYNC CREDENTIALS" : (
                    <>
                        <RotateCcw className="mr-2 w-4 h-4 group-hover:rotate-180 transition-transform duration-500" /> 
                        RE-INITIALIZE PROTOCOL
                    </>
                )}
            </Button>
            <Button 
                asChild
                variant="outline" 
                className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-zinc-400 hover:text-white font-black uppercase tracking-widest text-xs h-12 px-8 rounded-xl active:scale-95 transition-all"
            >
                <Link href="/">
                    <Home className="mr-2 w-4 h-4" /> RETURN_TO_BASE
                </Link>
            </Button>
        </div>
      </div>

      {/* Holographic Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-size-[100%_4px] bg-[linear-gradient(rgba(225,29,72,0)_50%,rgba(0,0,0,0.03)_50%)] opacity-30 z-10" />
    </div>
  );
}
