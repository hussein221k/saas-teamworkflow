"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Users, ShieldCheck, Zap, Activity, MessageSquare, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: <Terminal className="w-5 h-5" />,
    label: "Neural Initialization",
    detail: "Establishing core protocols...",
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
  },
  {
    icon: <ShieldCheck className="w-5 h-5" />,
    label: "Arcjet Shield Engaged",
    detail: "Layer-7 protection active.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
  {
    icon: <Users className="w-5 h-5" />,
    label: "Cluster Formation",
    detail: "Synchronizing team nodes...",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
];

export default function InitializationShowcase() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStep((prev) => (prev + 1) % steps.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative py-24 bg-zinc-950 overflow-hidden border-t border-white/5">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest">
              <Zap className="w-3 h-3" /> System Lifecycle
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight">
              FROM ZERO TO <span className="text-indigo-500">OPERATIONAL</span> IN SECONDS.
            </h2>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs leading-relaxed max-w-lg">
              Watch the neural network establish connection, secure its perimeter, and synchronize its first cluster unit in real-time.
            </p>
            
            <div className="space-y-4">
              {steps.map((s, i) => (
                <div 
                  key={i}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all duration-500",
                    step === i ? "bg-white/5 border-white/10 opacity-100 translate-x-4" : "border-transparent opacity-40 translate-x-0"
                  )}
                >
                  <div className={cn("p-3 rounded-xl", s.bg, s.color)}>
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-wider">{s.label}</div>
                    <div className="text-[10px] text-zinc-500 font-bold uppercase">{s.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1 relative w-full aspect-square max-w-[600px]">
            {/* Holographic Terminal Mockup */}
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
            
            <motion.div 
              className="relative h-full w-full rounded-3xl border border-white/10 bg-zinc-900/80 backdrop-blur-3xl overflow-hidden shadow-2xl"
              initial={false}
              animate={{ rotateY: step * 5, rotateX: step * 2 }}
              transition={{ duration: 0.8 }}
            >
              {/* Terminal Header */}
              <div className="h-10 border-b border-white/5 flex items-center justify-between px-4 bg-black/40">
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500/50" />
                  <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                  <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                </div>
                <div className="text-[8px] font-black text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity className="w-3 h-3" /> Console_Output.sh
                </div>
              </div>

              {/* Terminal Body */}
              <div className="p-6 font-mono space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] text-zinc-600 tracking-tight">$ system_init --verbose</p>
                  <p className="text-[10px] text-indigo-400 tracking-tight animate-pulse">[INFO] Loading core protocols...</p>
                </div>

                <AnimatePresence>
                  {step >= 0 && (
                    <motion.div 
                      key="step-0"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-zinc-400"
                    >
                      {">"} Neural network handshake: <span className="text-emerald-500">COMPLETE</span>
                    </motion.div>
                  )}
                  {step >= 1 && (
                    <motion.div 
                      key="step-1"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-zinc-400"
                    >
                      {">"} Security shielding: <span className="text-emerald-500">ACTIVE</span> (Arcjet-L7)
                    </motion.div>
                  )}
                  {step >= 2 && (
                    <motion.div 
                      key="step-2"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-[10px] text-zinc-400"
                    >
                      {">"} Cluster synchronization: <span className="text-emerald-500">ONLINE</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Dashboard Mockup Component Start */}
                {step === 2 && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-8 p-4 rounded-xl bg-black/40 border border-indigo-500/20 space-y-4 shadow-inner"
                  >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Plus className="w-3 h-3 text-indigo-500" />
                            <span className="text-[8px] font-black text-zinc-100 uppercase tracking-widest">New Project: Alpha</span>
                        </div>
                        <div className="text-[7px] text-emerald-500 font-bold">$5.00 CONFIRMED</div>
                    </div>
                    <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: "70%" }}
                          className="h-full bg-indigo-500"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <MessageSquare className="w-3 h-3 text-emerald-500" />
                        <span className="text-[8px] text-zinc-500">Neural uplink connected...</span>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Holographic Scanline Effect */}
              <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.1)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] z-20 bg-size-[100%_2px,3px_100%]" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
