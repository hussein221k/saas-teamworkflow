"use client";

import React from "react";
import { Plus, LogIn, ShieldCheck } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { ActiveSheet } from "./Chatchannels";

interface TeamRailProps {
  teams: { id: number; name: string }[];
  currentTeamId: number;
  handleSwitchTeam: (teamId: number) => void;
  setActiveSheet: (activeSheet: ActiveSheet | undefined) => void;
  isAdmin: boolean;
  colors: string[];
}

export function TeamRail({
  teams,
  currentTeamId,
  handleSwitchTeam,
  setActiveSheet,
  isAdmin,
  colors,
}: TeamRailProps) {
  return (
    <div className="w-20 flex flex-col items-center py-8 border-r border-white/5 bg-black/40 gap-6 shrink-0">
      <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 cursor-pointer hover:rotate-12 transition-transform">
        <span className="font-black text-xl text-white">TF</span>
      </div>
      <div className="w-8 h-px bg-white/10 my-2" />
      <ScrollArea className="flex-1 w-full">
        <div className="flex flex-col items-center gap-4 pb-4 px-2">
          {teams.map((team, index) => {
            const isActive = team.id === currentTeamId;
            return (
              <Tooltip key={team.id}>
                <TooltipTrigger onClick={() => handleSwitchTeam(team.id)}>
                  <div
                    className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm transition-all duration-300 text-white",
                      colors[index % colors.length],
                      isActive
                        ? "ring-2 ring-primary ring-offset-4 ring-offset-zinc-950 scale-110"
                        : "opacity-30 hover:opacity-100",
                    )}
                  >
                    {team.name[0].toUpperCase()}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">{team.name}</TooltipContent>
              </Tooltip>
            );
          })}
          <div
            className="w-12 h-12 rounded-2xl border border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary/50"
            onClick={() => setActiveSheet(ActiveSheet.team)}
          >
            <Plus className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="w-8 h-px bg-white/10" />
          <Tooltip>
            <TooltipTrigger onClick={() => setActiveSheet(ActiveSheet.join)}>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-800 transition-all">
                <LogIn className="w-5 h-5" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">Join Cluster</TooltipContent>
          </Tooltip>
        </div>
      </ScrollArea>
      {isAdmin && (
        <div className="mb-8 p-1">
          <Tooltip>
            <TooltipTrigger onClick={() => setActiveSheet(ActiveSheet.admin)}>
              <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-primary shadow-xl shadow-primary/5 group hover:bg-primary transition-all duration-500">
                <ShieldCheck className="w-6 h-6 group-hover:text-white" />
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              Admin Command (Central Control)
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  );
}
