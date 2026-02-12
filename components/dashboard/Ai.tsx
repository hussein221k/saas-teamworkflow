"use client";

import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
  useRef,
} from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Brain,
  X,
  Sparkles,
  MessageSquare,
  Terminal,
  Zap,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";


type MessageRole = "system" | "user" | "assistant";

interface Message {
  role: MessageRole;
  content: string;
}

function Ai() {
  // Initialize isDesktop based on window width (safely check for SSR compatibility)
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(min-width: 1024px)").matches;
    }
    return false;
  });
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load history from localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("ai_history");
      return saved
        ? JSON.parse(saved)
        : [
            {
              role: "system",
              content:
                "Cognitive engine online. How can I assist with your workflow data today?",
            },
          ];
    }
    return [{ role: "system", content: "Cognitive engine online." }];
  });

  useEffect(() => {
    localStorage.setItem("ai_history", JSON.stringify(messages));
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 1024px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDesktop(e.matches);
      if (e.matches) setIsOpen(true);
      else setIsOpen(false);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleSend = useCallback(
    async (text?: string) => {
      const query = text || input;
      if (!query.trim() || isThinking) return;

      const userMsg: Message = { role: "user", content: query };
      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsThinking(true);

      // Mock AI Response Logic
      setTimeout(() => {
        let response = "";
        if (query.toLowerCase().includes("task")) {
          response =
            "I've analyzed your current task distribution. Efficiency is at 84%. I recommend finalizing the 'Sync Protocols' mandate.";
        } else if (query.toLowerCase().includes("team")) {
          response =
            "Team Alpha remains stable. Connectivity across all nodes is verified.";
        } else {
          response =
            "Input processed. Integrating your query into the current operational context. Would you like a detailed neural breakdown?";
        }

        setMessages((prev) => [...prev, { role: "system", content: response }]);
        setIsThinking(false);
      }, 1500);
    },
    [input, isThinking],
  );

  return (
    <>
      <div
        className={cn(
          "bg-zinc-950 border-l border-white/5 flex flex-col transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-50 overflow-hidden",
          isDesktop
            ? "h-screen border-l border-white/5 shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.5)]"
            : "fixed inset-0 w-full",
          isOpen ? (isDesktop ? "w-100" : "w-full") : "w-0 p-0 overflow-hidden",
        )}
      >
        {/* AI Header */}
        <div className="p-6 border-b border-white/5 bg-zinc-900/20 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
              <div className="relative bg-zinc-900 p-2 rounded-xl border border-white/10 shadow-2xl">
                <Brain className="w-5 h-5 text-primary" />
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight text-white uppercase italic">
                Neural Core
              </h2>
              <div className="flex items-center gap-2">
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    isThinking ? "bg-yellow-500" : "bg-green-500",
                  )}
                />
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  {isThinking ? "Thinking..." : "Active"}
                </span>
              </div>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="text-zinc-500 hover:text-white hover:bg-white/5"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Knowledge Base Stats */}
        <div className="px-6 py-4 border-b border-white/5 grid grid-cols-2 gap-3 bg-zinc-900/50">
          <div className="p-3 rounded-xl border border-white/5 bg-black/40">
            <div className="flex items-center gap-2 mb-1 opacity-50">
              <Zap className="w-3 h-3 text-yellow-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                Latency
              </span>
            </div>
            <div className="text-lg font-mono font-bold">14ms</div>
          </div>
          <div className="p-3 rounded-xl border border-white/5 bg-black/40">
            <div className="flex items-center gap-2 mb-1 opacity-50">
              <ShieldCheck className="w-3 h-3 text-blue-500" />
              <span className="text-[9px] font-bold uppercase tracking-wider">
                Integrity
              </span>
            </div>
            <div className="text-lg font-mono font-bold">99.9%</div>
          </div>
        </div>

        {/* AI Chat History */}
        <ScrollArea className="flex-1 p-6">
          <div className="space-y-6" ref={scrollRef}>
            {messages.map((m: Message, i: number) => (
              <div
                key={i}
                className={cn(
                  "flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500",
                  m.role === "user" ? "flex-row-reverse" : "flex-row",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center border",
                    m.role === "system"
                      ? "bg-primary/20 border-primary/20 text-primary shadow-lg shadow-primary/10"
                      : "bg-zinc-800 border-white/5 text-zinc-400",
                  )}
                >
                  {m.role === "system" ? (
                    <Terminal className="w-4 h-4" />
                  ) : (
                    <MessageSquare className="w-4 h-4" />
                  )}
                </div>
                <div
                  className={cn(
                    "p-4 rounded-2xl text-xs leading-relaxed max-w-[85%] font-medium",
                    m.role === "system"
                      ? "bg-zinc-900/80 text-zinc-300 border border-white/5"
                      : "bg-primary text-primary-foreground",
                  )}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {isThinking && (
              <div className="flex gap-3 animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/20 flex items-center justify-center text-primary">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/80 text-zinc-500 text-xs italic">
                  Processing neural paths...
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Interaction Node */}
        <div className="p-6 bg-zinc-900/50 border-t border-white/5">
          <div className="relative">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Input query or complex task instruction..."
              className="bg-black border-white/10 h-10 pr-12 text-xs rounded-xl focus:border-primary/50 text-white"
            />
            <Button
              onClick={() => handleSend()}
              disabled={isThinking || !input.trim()}
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 bg-zinc-800 hover:bg-primary transition-colors"
            >
              <Sparkles className="w-4 h-4" />
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[
              { label: "Analysis", query: "Analyze current team performance" },
              { label: "Sync Tasks", query: "Show me overdue tasks" },
              { label: "Integrity Check", query: "Run system health check" },
            ].map((tag) => (
              <Badge
                key={tag.label}
                onClick={() => handleSend(tag.query)}
                variant="outline"
                className="text-[9px] border-white/5 bg-white/5 text-zinc-500 cursor-pointer hover:border-primary hover:text-primary transition-colors"
              >
                {tag.label}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Re-open Trigger */}
      {isDesktop && !isOpen && (
        <div className="fixed right-0 top-0 h-screen flex items-center z-50">
          <Button
            variant="ghost"
            className="h-20 w-8 rounded-none rounded-l-2xl bg-zinc-900 border border-r-0 border-white/10 group shadow-2xl"
            onClick={() => setIsOpen(true)}
          >
            <Brain className="w-5 h-5 text-zinc-500 group-hover:text-primary transition-colors animate-pulse" />
          </Button>
        </div>
      )}

      {/* Mobile Trigger */}
      {!isDesktop && !isOpen && (
        <Button
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl shadow-primary/40 border border-white/20 animate-bounce"
          onClick={() => setIsOpen(true)}
        >
          <Brain className="w-6 h-6 text-white" />
        </Button>
      )}
    </>
  );
}

export default Ai;
