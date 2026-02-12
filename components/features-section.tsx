"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cpu, Users, Globe, Lock, QrCode, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Strategic Command",
    description:
      "Centralized Admin Panel with bird's eye view over every project unit and team deployment.",
    icon: <LayoutDashboard className="w-8 h-8 text-indigo-500" />,
    gradient: "from-indigo-500/20 to-purple-500/20",
    border: "border-indigo-500/20",
  },
  {
    title: "Neural Synchronization",
    description:
      "Instant team joining via high-fidelity QR codes and secure protocol strings.",
    icon: <QrCode className="w-8 h-8 text-emerald-500" />,
    gradient: "from-emerald-500/20 to-teal-500/20",
    border: "border-emerald-500/20",
  },
  {
    title: "Encrypted Uplink",
    description:
      "Arcjet-powered security layer protecting your neural network from SQLi, XSS, and bot intrusions.",
    icon: <Lock className="w-8 h-8 text-rose-500" />,
    gradient: "from-rose-500/20 to-orange-500/20",
    border: "border-rose-500/20",
  },
  {
    title: "AI Automation Engine",
    description:
      "Leverage built-in AI nodes to assist in task management and cluster optimization.",
    icon: <Cpu className="w-8 h-8 text-blue-500" />,
    gradient: "from-blue-500/20 to-cyan-500/20",
    border: "border-blue-500/20",
  },
  {
    title: "Global Scalability",
    description:
      "Deploy across infinite clusters and teams without losing coordination or protocol integrity.",
    icon: <Globe className="w-8 h-8 text-amber-500" />,
    gradient: "from-amber-500/20 to-yellow-500/20",
    border: "border-amber-500/20",
  },
  {
    title: "Unit Management",
    description:
      "Advanced employee authorization and decommissioning protocols with fine-grained control.",
    icon: <Users className="w-8 h-8 text-violet-500" />,
    gradient: "from-violet-500/20 to-fuchsia-500/20",
    border: "border-violet-500/20",
  },
];

export default function FeaturesSection() {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(
    scrollYProgress,
    [0, 0.2, 0.8, 1],
    [0.8, 1, 1, 0.8],
  );

  return (
    <section
      ref={containerRef}
      className="relative py-24 bg-zinc-950 overflow-hidden"
    >
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[120px] -z-10" />

      <motion.div style={{ opacity, scale }} className="container mx-auto px-6">
        <div className="text-center mb-20">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter"
          >
            CORE SYSTEM <span className="text-indigo-500">CAPABILITIES</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-zinc-500 max-w-2xl mx-auto font-bold uppercase tracking-widest text-sm"
          >
            A high-performance infrastructure designed for modern engineering
            clusters and mission-critical workflows.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </motion.div>
    </section>
  );
}

interface Feature {
  title: string;
  description: string;
  icon: React.ReactNode;
  gradient: string;
  border: string;
}

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ y: -10, rotateX: 5, rotateY: 5 }}
      style={{ perspective: 1000 }}
      className={cn(
        "group relative p-8 rounded-3xl bg-zinc-900/50 border backdrop-blur-xl transition-all duration-500",
        feature.border,
        "hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/40",
      )}
    >
      <div
        className={cn(
          "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-linear-to-br",
          feature.gradient,
        )}
      />

      <div className="relative z-10">
        <div className="mb-6 p-3 rounded-2xl bg-zinc-950/50 w-fit border border-white/5">
          {feature.icon}
        </div>
        <h3 className="text-xl font-black text-white mb-4 uppercase tracking-wider">
          {feature.title}
        </h3>
        <p className="text-zinc-400 font-medium leading-relaxed">
          {feature.description}
        </p>
      </div>

      <div className="absolute top-4 right-4 text-zinc-800 font-black text-4xl select-none group-hover:text-indigo-500/20 transition-colors">
        0{index + 1}
      </div>
    </motion.div>
  );
}
