"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Badge } from "@/components/ui/badge";
import {
  Mail,
  MessageCircle,
  ArrowLeft,
  Send,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function ContactPage() {
  const contentRef = useRef(null);

  useEffect(() => {
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, y: 50, filter: "blur(10px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
      },
    );
  }, []);

  return (
    <main className="min-h-screen bg-black text-white relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-primary/20 blur-[150px] rounded-full pointer-events-none" />

      <div
        ref={contentRef}
        className="max-w-xl w-full relative z-10 space-y-12"
      >
        {/* Back Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group mb-8"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">
            Back to HQ
          </span>
        </Link>

        {/* Header */}
        <div className="space-y-4">
          <Badge
            variant="outline"
            className="border-white/10 bg-white/5 text-primary uppercase tracking-[0.3em] font-black text-[10px] px-3"
          >
            Emergency Uplink
          </Badge>
          <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter leading-none">
            ESTABLISH <br /> <span className="text-primary">CONTACT</span>
          </h1>
          <p className="text-zinc-500 font-medium leading-relaxed">
            Need priority support or custom integration? Our lead developers are
            standing by for direct transmission.
          </p>
        </div>

        {/* Contact Grid */}
        <div className="grid grid-cols-1 gap-6">
          <a
            href="mailto:dev@teamworkflow.ai"
            className="group p-6 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-900 transition-all duration-500 flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest italic">
                  Signal via Email
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold">
                  dev@teamworkflow.ai
                </p>
              </div>
            </div>
            <Send className="w-4 h-4 text-zinc-700 group-hover:text-primary transition-colors" />
          </a>

          <a
            href="https://wa.me/1234567890"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-3xl border border-white/5 bg-zinc-900/50 backdrop-blur-xl hover:bg-zinc-900 transition-all duration-500 flex items-center justify-between"
          >
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest italic">
                  Direct WhatsApp
                </h3>
                <p className="text-[10px] text-zinc-500 font-bold">
                  Encrypted Link Available
                </p>
              </div>
            </div>
            <Send className="w-4 h-4 text-zinc-700 group-hover:text-emerald-500 transition-colors" />
          </a>
        </div>

        {/* Security Badge */}
        <div className="pt-8 flex items-center gap-4 opacity-30 select-none">
          <ShieldCheck className="w-8 h-8 stroke-1" />
          <p className="text-[9px] font-black uppercase tracking-[0.4em] leading-tight">
            Secure Protocol <br /> End-to-End Verified
          </p>
        </div>
      </div>

      {/* Footer deco */}
      <div className="absolute bottom-10 text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 pointer-events-none">
        Team Workflow // Dev Node 01
      </div>
    </main>
  );
}
