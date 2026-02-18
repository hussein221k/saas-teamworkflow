/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { gsap } from "gsap";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
  CheckCircle2,
  Circle,
  Clock,
  AlertCircle,
  UserPlus,
  Filter,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { getTeamMembers } from "@/server/actions/team";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isBefore } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { task_status } from "@prisma/client";

interface TaskSidebarProps {
  team_id: string;
  user_id: string;
  isAdmin: boolean;
}

export default function TaskSidebar({
  team_id,
  user_id,
  isAdmin,
}: TaskSidebarProps) {
  const [ui, setUi] = useState({
    isOpen: true,
    isCreating: false,
    filter: "ALL",
  });

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: task_status.PENDING,
    assigneeId: "",
    deadline: "",
  });

  const sidebarRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const actionRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const updateUi = (updates: Partial<typeof ui>) =>
    setUi((prev) => ({ ...prev, ...updates }));

  const updateForm = (updates: Partial<typeof formData>) =>
    setFormData((prev) => ({ ...prev, ...updates }));

  const { tasks, addTask, updateStatus, loading } = useTasks(team_id);

  const { data: members = [] } = useQuery({
    queryKey: ["members", team_id],
    queryFn: () => getTeamMembers(team_id),
    enabled: !!team_id,
  });

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!formData.title.trim()) return;

      const result = await addTask({
        title: formData.title,
        description: formData.description,
        status: formData.status,
        assigned_to_id: formData.assigneeId,
        deadline: formData.deadline ? new Date(formData.deadline) : undefined,
        team_id: team_id,
        created_by_id: user_id,
        id: "", // Server will provide real ID
      } as any);

      if (result) {
        updateUi({ isCreating: false });
        updateForm({
          title: "",
          description: "",
          status: task_status.PENDING,
          assigneeId: "",
          deadline: "",
        });
      }
    },
    [formData, addTask],
  );

  // 🔹 Entrance Animations
  useEffect(() => {
    if (ui.isOpen) {
      const tl = gsap.timeline();
      tl.fromTo(
        sidebarRef.current,
        { x: "100%", opacity: 0 },
        { x: "0%", opacity: 1, duration: 0.8, ease: "expo.out" },
      )
        .fromTo(
          headerRef.current,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.5, ease: "back.out" },
          "-=0.4",
        )
        .fromTo(
          actionRef.current,
          { scale: 0.9, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.4, ease: "power2.out" },
          "-=0.3",
        );
    }
  }, [ui.isOpen]);

  // 🔹 Form Animation
  useEffect(() => {
    if (ui.isCreating && formRef.current) {
      gsap.fromTo(
        formRef.current,
        { height: 0, opacity: 0, scale: 0.95 },
        { height: "auto", opacity: 1, scale: 1, duration: 0.5, ease: "expo.out" },
      );
    }
  }, [ui.isCreating]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (!isAdmin && task.assigned_to_id !== user_id) return false;
      if (ui.filter === "ALL") return true;
      return task.status === ui.filter;
    });
  }, [tasks, isAdmin, user_id, ui.filter]);

  // 🔹 List Animation
  useEffect(() => {
    if (listRef.current && filteredTasks.length > 0) {
      gsap.fromTo(
        listRef.current.children,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, ease: "power2.out" },
      );
    }
  }, [filteredTasks.length, ui.filter]);

  const statusIcons = useMemo(
    () => ({
      [task_status.PENDING]: <Circle className="w-4 h-4 text-zinc-500" />,
      [task_status.IN_PROGRESS]: (
        <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />
      ),
      [task_status.DONE]: <CheckCircle2 className="w-4 h-4 text-green-500" />,
      [task_status.OVERDUE]: <AlertCircle className="w-4 h-4 text-red-500" />,
    }),
    [],
  );

  return (
    <>
      <div
        ref={sidebarRef}
        className={cn(
          "flex flex-col h-screen border-l border-white/5 bg-zinc-950 text-zinc-100 z-40 relative shadow-2xl overflow-hidden",
          ui.isOpen ? "w-96" : "w-0 md:w-16",
        )}
      >
        <div 
          ref={headerRef}
          className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50"
        >
          {ui.isOpen && (
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
              <h2 className="text-sm font-bold tracking-widest uppercase opacity-80">
                Command Hub
              </h2>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-zinc-400 hover:text-white hover:bg-white/5"
            onClick={() => updateUi({ isOpen: !ui.isOpen })}
          >
            {ui.isOpen ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        {ui.isOpen && (
          <div className="flex-1 flex flex-col min-h-0 bg-linear-to-b from-zinc-950 to-black">
            <div 
              ref={actionRef}
              className="p-4 space-y-4"
            >
              <div className="flex items-center gap-2">
                <Select value={ui.filter} onValueChange={(val) => updateUi({ filter: val })}>
                  <SelectTrigger className="h-8 bg-zinc-900/50 border-white/10 text-[10px] text-white font-bold uppercase tracking-widest">
                    <Filter className="w-3 h-3 mr-2 opacity-50" />
                    <SelectValue placeholder="All Clusters" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">All Status</SelectItem>
                    <SelectItem value={task_status.PENDING}>Pending</SelectItem>
                    <SelectItem value={task_status.IN_PROGRESS}>
                      Working
                    </SelectItem>
                    <SelectItem value={task_status.DONE}>Completed</SelectItem>
                  </SelectContent>
                </Select>
                {isAdmin && (
                  <Button
                    size="sm"
                    className="h-8 shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest"
                    onClick={() => updateUi({ isCreating: true })}
                  >
                    <Plus className="w-3 h-3 mr-1" /> New Mandate
                  </Button>
                )}
              </div>
            </div>

            {ui.isCreating && (
              <div 
                ref={formRef}
                className="px-4 pb-4 overflow-hidden"
              >
                <div className="p-5 rounded-3xl border border-white/5 bg-white/5 space-y-4 shadow-2xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                      Deployment Protocol
                    </span>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-6 w-6"
                      onClick={() => updateUi({ isCreating: false })}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <Input
                    placeholder="Identification"
                    className="bg-black/50 border-white/10 h-10 text-xs text-white"
                    value={formData.title}
                    onChange={(e) => updateForm({ title: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                      <Input
                        type="date"
                        className="bg-black/50 border-white/10 h-9 text-[10px] pl-8 text-white appearance-none"
                        value={formData.deadline}
                        onChange={(e) => updateForm({ deadline: e.target.value })}
                      />
                    </div>
                    <Select value={formData.assigneeId} onValueChange={(val) => updateForm({ assigneeId: val })}>
                      <SelectTrigger className="h-9 bg-black/50 border-white/10 text-[10px] text-white">
                        <UserPlus className="w-3 h-3 mr-1 opacity-50" />
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                      <SelectContent>
                        {members.map((m: any) => (
                          <SelectItem key={m.id} value={m.id.toString()}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    className="w-full h-10 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/10"
                    onClick={handleSubmit}
                  >
                    Initialize Strategy
                  </Button>
                </div>
              </div>
            )}

            <ScrollArea className="flex-1 px-4">
              <div 
                ref={listRef}
                className="space-y-4 pb-8"
              >
                {loading ? (
                  <div className="flex flex-col gap-4 py-4">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="h-28 w-full bg-white/5 animate-pulse rounded-3xl"
                      />
                    ))}
                  </div>
                ) : filteredTasks.length === 0 ? (
                  <div className="text-center py-24 opacity-20 select-none grayscale">
                    <Circle className="w-16 h-16 mx-auto mb-6 stroke-[0.5]" />
                    <p className="text-[10px] font-black tracking-[0.5em] uppercase">
                      No active mandates found
                    </p>
                  </div>
                ) : (
                  filteredTasks.map((task) => {
                    const isOverdue =
                      task.deadline &&
                      isBefore(new Date(task.deadline), new Date()) &&
                      task.status !== task_status.DONE;
                    return (
                      <div
                        key={task.id}
                        className="group p-5 rounded-3xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-500 relative overflow-hidden"
                      >
                        <div
                          className={cn(
                            "absolute bottom-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-700",
                            task.status === task_status.DONE
                              ? "bg-green-500"
                              : isOverdue
                                ? "bg-red-500"
                                : task.status === task_status.IN_PROGRESS
                                  ? "bg-yellow-500"
                                  : "bg-zinc-700",
                          )}
                        />

                        <div className="flex items-start justify-between gap-4 mb-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {statusIcons[task.status as task_status]}
                            </div>
                            <h3 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors pr-4">
                              {task.title}
                            </h3>
                          </div>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[8px] h-4 px-1.5 font-black uppercase tracking-tighter border-white/10",
                              isOverdue
                                ? "text-red-500 bg-red-500/10 border-red-500/20"
                                : "text-zinc-500",
                            )}
                          >
                            {isOverdue
                              ? "Overdue"
                              : task.status.toLowerCase().replace("_", " ")}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between mt-6">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-black">
                              {task.assigned_to?.name[0] || "?"}
                            </div>
                            <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                              {task.assigned_to?.name || "Unassigned"}
                            </span>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <div className="flex items-center gap-1.5 opacity-40 text-[9px] font-bold">
                              <Calendar className="w-3 h-3" />
                              {task.deadline
                                ? format(
                                    new Date(task.deadline),
                                    "MMM dd, yyyy",
                                  )
                                : "No Deadline"}
                            </div>
                          </div>
                        </div>

                        {task.status !== task_status.DONE && (
                          <div className="mt-4 hidden group-hover:block animate-in slide-in-from-top-2 duration-300">
                            <Button
                              size="sm"
                              variant="default"
                              className="w-full h-8 text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10"
                              onClick={(e) => {
                                e.stopPropagation();
                                updateStatus(task.id.toString(), task_status.DONE);
                              }}
                            >
                              Authorize Completion
                            </Button>
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </div>
    </>
  );
}
