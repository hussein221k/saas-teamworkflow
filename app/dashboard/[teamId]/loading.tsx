"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex h-screen w-full bg-zinc-950 overflow-hidden font-sans">
      {/* Team Sidebar Skeleton */}
      <div className="w-16 md:w-20 border-r border-white/5 flex flex-col items-center py-6 gap-6 bg-black/20">
        <Skeleton className="w-10 h-10 rounded-2xl bg-white/5" />
        <div className="w-8 h-px bg-white/5" />
        <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
        <Skeleton className="w-10 h-10 rounded-full bg-white/5" />
        <Skeleton className="w-10 h-10 rounded-full bg-white/10" />
        <div className="mt-auto">
             <Skeleton className="w-10 h-10 rounded-xl bg-white/5" />
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="flex flex-1 overflow-hidden divide-x divide-white/5">
        
        {/* Chat List / Area Skeleton */}
        <div className="w-full md:w-80 flex flex-col h-full bg-black/10">
            <div className="p-6 border-b border-white/5">
                <Skeleton className="h-6 w-32 bg-white/5 mb-2" />
                <Skeleton className="h-4 w-48 bg-white/5 opacity-50" />
            </div>
            <div className="flex-1 p-4 space-y-6 overflow-hidden">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="flex gap-3">
                        <Skeleton className="w-10 h-10 rounded-full bg-white/5 shrink-0" />
                        <div className="space-y-2 flex-1">
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-20 bg-white/10" />
                                <Skeleton className="h-2 w-8 bg-white/5" />
                            </div>
                            <Skeleton className="h-2 w-full bg-white/5" />
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Task Dashboard Middle area (Visualized in page.tsx as being part of the same row) */}
        <div className="flex-1 flex flex-col h-full bg-zinc-950/50 relative">
             <div className="absolute inset-0 bg-radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.05), transparent 70%)" />
             <div className="p-8 space-y-8 relative z-10">
                <div className="flex justify-between items-end">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64 bg-white/10" />
                        <Skeleton className="h-4 w-32 bg-white/5" />
                    </div>
                    <Skeleton className="h-10 w-40 rounded-xl bg-indigo-500/10 border border-indigo-500/20" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                            <div className="flex justify-between">
                                <Skeleton className="h-4 w-24 bg-white/10" />
                                <Skeleton className="w-4 h-4 rounded bg-white/5" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-full bg-white/5" />
                                <Skeleton className="h-3 w-[80%] bg-white/5" />
                            </div>
                            <div className="flex -space-x-2 pt-2">
                                <Skeleton className="w-6 h-6 rounded-full bg-white/10 border-2 border-zinc-950" />
                                <Skeleton className="w-6 h-6 rounded-full bg-white/10 border-2 border-zinc-950" />
                            </div>
                        </div>
                    ))}
                </div>
             </div>

             {/* Bottom Input Area */}
             <div className="mt-auto p-6 border-t border-white/5 bg-black/40">
                <Skeleton className="h-12 w-full rounded-2xl bg-white/5 border border-white/5" />
             </div>
        </div>

        {/* AI Sidebar Shortcut Skeleton */}
        <div className="hidden lg:flex w-72 flex-col h-full bg-black/20 p-6 space-y-8">
            <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <Skeleton className="h-4 w-32 bg-white/10" />
            </div>
            
            <div className="space-y-6">
                <div className="space-y-3">
                    <Skeleton className="h-2 w-20 bg-white/5 font-bold uppercase" />
                    <Skeleton className="h-16 w-full rounded-xl bg-indigo-500/5 border border-indigo-500/10" />
                </div>
                <div className="space-y-3">
                    <Skeleton className="h-2 w-24 bg-white/5 font-bold uppercase" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
                        <Skeleton className="h-10 w-full rounded-lg bg-white/5" />
                        <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Holographic Scanline */}
      <div className="absolute inset-0 pointer-events-none bg-size-[100%_2px] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%)] opacity-10 z-50" />
    </div>
  );
}
