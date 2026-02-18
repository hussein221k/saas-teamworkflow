"use client";

import React from "react";
import { Hash, MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ActiveSheet } from "./Chatchannels";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChannelSidebarProps {
  activeSheet: ActiveSheet | undefined;
  activeChannelId: string | null;
  activeReceiverId: string | null;
  channels: { id: string; name: string }[];
  members: { id: string; name: string; role: string }[];
  navigateToChannel: (id: string | null) => void;
  navigateToMember: (id: string) => void;
  setActiveSheet: (activeSheet: ActiveSheet | undefined) => void;
  isAdmin: boolean;
}

export function ChannelSidebar({
  activeChannelId,
  activeReceiverId,
  channels,
  members,
  navigateToChannel,
  navigateToMember,
  setActiveSheet,
  isAdmin,
}: ChannelSidebarProps) {
  return (
    <div className="w-64 flex flex-col bg-zinc-950/50 backdrop-blur-3xl shrink-0">
      <div className="p-6 border-b border-white/5">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-zinc-500 mb-6 flex items-center gap-2">
          <Hash className="w-3 h-3 text-primary" /> Multi-Communication
        </h2>
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-widest text-zinc-100">
            Battle Groups
          </span>
          {isAdmin && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 hover:bg-white/5"
                    onClick={() => setActiveSheet(ActiveSheet.group)}
                  >
                    <Plus className="w-3 h-3 text-primary" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right" className="bg-zinc-900 border-white/10 text-[10px] font-bold uppercase tracking-widest text-primary">
                  Create Group
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-1">
          <Button
            variant="ghost"
            onClick={() => navigateToChannel(null)}
            className={cn(
              "w-full justify-start gap-3 h-10 rounded-xl text-xs font-bold transition-all",
              !activeChannelId
                ? "bg-primary/10 text-primary border border-primary/20"
                : "text-zinc-500 hover:text-white",
            )}
          >
            <MessageSquare className="w-4 h-4" /> Global Uplink
          </Button>

          {channels.map((ch) => (
            <Button
              key={ch.id}
              variant="ghost"
              onClick={() => navigateToChannel(ch.id)}
              className={cn(
                "w-full justify-start gap-3 h-10 rounded-xl text-xs font-bold group",
                activeChannelId === ch.id
                  ? "bg-white/5 text-white border border-white/10"
                  : "text-zinc-500 hover:text-white",
              )}
            >
              <Hash className="w-4 h-4 text-zinc-700 group-hover:text-primary" />{" "}
              {ch.name}
            </Button>
          ))}
        </div>

        <div className="mt-8 px-6">
          <h3 className="text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 mb-4">
            Active Units
          </h3>
          <div className="space-y-3">
            {members.map((m) => (
              <div
                key={m.id}
                onClick={() => navigateToMember(m.id)}
                className={cn(
                  "flex items-center gap-3 p-2 rounded-xl cursor-pointer transition-all",
                  activeReceiverId === m.id
                    ? "bg-primary/10 border border-primary/20 opacity-100"
                    : "opacity-60 hover:opacity-100 hover:bg-white/5",
                )}
              >
                <Avatar className="w-6 h-6 border border-white/5">
                  <AvatarFallback className="bg-zinc-900 text-[8px] font-black uppercase">
                    {m.name[0]}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[10px] font-bold text-zinc-400 capitalize">
                  {m.name}
                </span>
                <Badge
                  variant="outline"
                  className="text-[7px] h-3 px-1 border-zinc-500/20 text-zinc-500 uppercase"
                >
                  ENC
                </Badge>
                {m.role === "ADMIN" && (
                  <Badge
                    variant="outline"
                    className="text-[7px] h-3 px-1 border-primary/20 text-primary"
                  >
                    ADM
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border border-primary/20 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
            <AvatarFallback className="bg-primary text-white text-xs font-black uppercase">
              YU
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <span className="text-[10px] font-black uppercase tracking-widest truncate text-white">
              Authorized Node
            </span>
            <div className="flex items-center gap-1.5 font-bold text-[8px] text-emerald-500 uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />{" "}
              Uplink Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
