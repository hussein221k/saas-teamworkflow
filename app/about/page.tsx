"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Badge } from "@/components/ui/badge";
import { Brain, Rocket, Shield, Globe, Users, Zap } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

export default function AboutPage() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const sectionsRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Hero Animation
    gsap.fromTo(
      heroRef.current,
      { opacity: 0, y: 100 },
      { opacity: 1, y: 0, duration: 1.5, ease: "expo.out" }
    );

    // Staggered Cards Animation
    sectionsRef.current.forEach((section) => {
      gsap.fromTo(
        section,
        { opacity: 0, scale: 0.9, y: 50 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, []);

  const features = [
    { icon: <Rocket className="w-8 h-8 text-orange-500" />, title: "Hyper-Speed Growth", desc: "Scale your team's output at relativistic speeds." },
    { icon: <Shield className="w-8 h-8 text-blue-500" />, title: "Quantum Security", desc: "End-to-end encryption protocols protect every fragment of data." },
    { icon: <Brain className="w-8 h-8 text-purple-500" />, title: "Neural Synthesis", desc: "Integrated AI that thinks three steps ahead of your deadlines." },
  ];

  return (
    <main ref={containerRef} className="min-h-screen bg-black text-white selection:bg-primary/30 selection:text-white overflow-hidden">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-125 h-125 bg-blue-500/10 blur-[150px] rounded-full" />
      </div>

      {/* Hero Section */}
      <section ref={heroRef} className="relative pt-32 pb-20 px-6 flex flex-col items-center text-center">
        <Badge variant="outline" className="mb-6 border-white/10 bg-white/5 backdrop-blur-md px-4 py-1 text-xs uppercase tracking-widest text-primary font-bold">
          Future of Operations
        </Badge>
        <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-6 bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">
          WE ARE THE <br /> ARCHITECTS OF FLOW
        </h1>
        <p className="max-w-2xl text-lg text-zinc-400 font-medium leading-relaxed">
          Founded in the overlap between neural networks and human collaboration. 
          We build the systems that teams use to conquer complexity and redefine what done means.
        </p>
      </section>

      {/* Stats/Grid */}
      <section className="px-6 py-20 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div 
                key={i} 
                ref={(el) => { if (el) sectionsRef.current[i] = el; }}
                className="group relative p-8 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-900 transition-colors"
            >
              <div className="mb-6 bg-black/50 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform duration-500">
                {f.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 uppercase italic tracking-tight">{f.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              
              {/* Deco line */}
              <div className="absolute bottom-0 left-8 right-8 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </section>

      {/* Full Width Deco */}
      <section className="py-20 flex flex-col items-center">
         <div className="w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent mb-20" />
         
         <div className="flex flex-col md:flex-row gap-20 px-6 max-w-5xl items-center">
            <div className="space-y-4">
                <h2 className="text-4xl font-bold italic uppercase tracking-tighter leading-none">Global Connectivity</h2>
                <p className="text-zinc-500 font-medium leading-relaxed">
                    Our servers are distributed across the planetary grid. From Mars colony outposts 
                    to underground server vaults in the Alps, we ensure 99.999% uptime for the species.
                </p>
                <div className="flex gap-4 pt-4">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">14 Clusters</span>
                    </div>
                     <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">2M+ Nodes</span>
                    </div>
                </div>
            </div>
            <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
                <div className="relative w-64 h-64 rounded-full border-2 border-white/5 flex items-center justify-center">
                    <div className="w-32 h-32 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center animate-spin-slow">
                        <Zap className="w-12 h-12 text-primary" />
                    </div>
                </div>
            </div>
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/5 mt-20">
         <p className="text-[10px] uppercase font-black tracking-[0.5em] text-zinc-700">Established 2026 // Protocol Active</p>
      </footer>
    </main>
  );
}
