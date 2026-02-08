"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Zap, Shield, Sparkles } from "lucide-react";
import Link from "next/link";
import BillingActions from "./_components/BillingActions";

interface PricingPlanProps {
    dbUser: any;
    team: any;
    isOwner: boolean;
    currentPlan: string;
}

export default function PricingPageClient({ dbUser, team, isOwner, currentPlan }: PricingPlanProps) {
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const headerRef = useRef(null);

  useEffect(() => {
    // Header Animation
    gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: -30 },
      { opacity: 1, y: 0, duration: 1, ease: "back.out" }
    );

    // Cards staggered entry
    cardsRef.current.forEach((card, i) => {
        gsap.fromTo(
            card,
            { opacity: 0, scale: 0.9, y: 50 },
            { opacity: 1, scale: 1, y: 0, duration: 0.8, delay: 0.2 + (i * 0.15), ease: "power4.out" }
        );
    });
  }, []);

  const plans = [
    {
      name: "Standard Hub",
      price: "0",
      description: "Baseline protocols for small operational units.",
      features: [
        "1 Operational Node",
        "Basic Signal Sync",
        "Public Channels",
        "Legacy Support",
      ],
      notIncluded: [
        "Neural Color Synthesis",
        "Yearly Priority Routing",
        "Advanced AI Core",
      ],
      planKey: "FREE",
      cta: "Activate Free",
      variant: "outline" as const,
    },
    {
      name: "Advanced Pro",
      price: "299",
      period: "year",
      description: "Enhanced capabilities for elite teams.",
      features: [
        "Unlimited Nodes",
        "Neural Color Synthesis",
        "Advanced AI Core",
        "Yearly Priority Routing",
        "Encrypted Channels",
      ],
      notIncluded: [
         "Dedicated Server Vault",
         "Custom Planetary Grid",
      ],
      planKey: "PRO",
      cta: "Initialize Pro (Yearly)",
      variant: "default" as const,
      popular: true,
      glow: true,
    },
    {
      name: "Omni Suite",
      price: "Custom",
      description: "Infinite scaling for global organizations.",
      features: [
        "Unlimited Everything",
        "Dedicated Server Vault",
        "Custom Planetary Grid",
        "White-label Protocols",
        "Direct Dev Uplink",
      ],
      notIncluded: [],
      planKey: "ENTERPRISE",
      cta: "Sync with Sales",
      variant: "outline" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white py-24 px-6 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[150px] rounded-full" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full" />

      <div className="mx-auto max-w-6xl relative z-10">
        <div ref={headerRef} className="text-center space-y-6 mb-20">
          <Badge variant="outline" className="text-primary border-primary bg-primary/5 px-6 py-1 uppercase tracking-[0.3em] font-black text-[10px]">
            Subscription Matrix
          </Badge>
          <h1 className="text-5xl md:text-8xl font-black italic tracking-tighter leading-none mb-4">
             SELECT YOUR <br /> <span className="bg-linear-to-b from-white to-zinc-500 bg-clip-text text-transparent">OPERATIONAL LEVEL</span>
          </h1>
          <p className="text-zinc-500 text-lg max-w-2xl mx-auto font-medium">
             All paid protocols are provisioned for a minimum of 1 year to ensure operational stability and neural synchronization.
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div 
                key={plan.name} 
                ref={(el) => { if (el) cardsRef.current[i] = el; }}
                className="group h-full"
            >
                <Card 
                  className={`flex flex-col h-full border-white/5 bg-zinc-900/40 backdrop-blur-2xl shadow-2xl relative overflow-hidden rounded-[2.5rem] transition-all duration-500 ${
                    plan.popular ? 'border-primary/50 shadow-primary/20 ring-1 ring-primary/20' : 'hover:border-white/10'
                  }`}
                >
                  {/* Glow animation for popular card */}
                  {plan.glow && (
                    <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/20 blur-3xl animate-pulse" />
                  )}

                  {plan.popular && (
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-primary animate-ping" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary">Priority Node</span>
                    </div>
                  )}
                  
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-sm font-black text-zinc-500 uppercase tracking-[0.2em] italic mb-6">
                       <span className="flex items-center gap-2">
                          {plan.planKey === 'PRO' ? <Zap className="w-4 h-4 text-primary" /> : plan.planKey === 'ENTERPRISE' ? <Shield className="w-4 h-4 text-blue-500" /> : <Sparkles className="w-4 h-4 text-zinc-700" />}
                          {plan.name}
                       </span>
                    </CardTitle>
                    <div className="mt-4 flex items-baseline gap-2">
                      <span className="text-6xl font-black italic tracking-tighter">
                        {plan.price !== "Custom" ? `$${plan.price}` : "ADM"}
                      </span>
                      {plan.price !== "Custom" && (
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest leading-none">USD</span>
                            <span className="text-[10px] font-black text-primary uppercase tracking-widest leading-none">Per Year</span>
                        </div>
                      )}
                    </div>
                    <p className="mt-6 text-zinc-500 text-xs font-bold leading-relaxed">
                      {plan.description}
                    </p>
                  </CardHeader>

                  <CardContent className="p-10 pt-0 flex-1 space-y-8">
                    <div className="w-full h-px bg-white/5" />
                    <div className="space-y-4">
                      {plan.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-4">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary/40" />
                          <span className="text-xs font-medium text-zinc-300 uppercase tracking-widest">{feature}</span>
                        </div>
                      ))}
                      {plan.notIncluded.map((feature) => (
                        <div key={feature} className="flex items-center gap-4 opacity-20 grayscale">
                          <div className="w-1.5 h-1.5 rounded-full bg-zinc-800" />
                          <span className="text-xs font-medium text-zinc-700 uppercase tracking-widest line-through">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>

                  <CardFooter className="p-10 pt-0">
                    {plan.planKey === currentPlan ? (
                        <div className="w-full p-4 rounded-2xl bg-white/5 border border-white/5 text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 italic">Core Protocol Active</span>
                        </div>
                    ) : plan.planKey === "FREE" ? (
                         <div className="w-full p-4 rounded-2xl bg-zinc-800/10 text-center">
                            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700 italic">No Modification Required</span>
                        </div>
                    ) : dbUser && isOwner ? (
                        <div className="w-full">
                            <BillingActions teamId={team!.id} currentPlan={currentPlan} />
                        </div>
                    ) : (
                        <Button 
                            asChild 
                            className="w-full h-14 rounded-2xl group text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/10 transition-all hover:scale-[1.02] active:scale-95" 
                            variant={plan.variant}
                        >
                            <Link href={dbUser ? "/onboarding" : "/api/auth/login"}>
                                {plan.cta} 
                                <ArrowRight className="ml-3 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    )}
                  </CardFooter>
                </Card>
            </div>
          ))}
        </div>

        <div className="mt-24 text-center space-y-2 pb-10">
          <p className="text-zinc-700 text-[10px] font-black uppercase tracking-[0.5em]">
            Secure transmission via encrypted checkout protocol
          </p>
          <div className="flex justify-center items-center gap-6 opacity-20 grayscale">
            <span className="text-xs font-black">VISA</span>
            <span className="text-xs font-black">MASTERCARD</span>
            <span className="text-xs font-black">CRYPTO</span>
            <span className="text-xs font-black">UPLINK</span>
          </div>
        </div>
      </div>
    </main>
  );
}
