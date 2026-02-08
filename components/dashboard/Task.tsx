"use client";

import React, { useState, useMemo, useCallback } from "react";
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
    Calendar
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useTasks } from "@/hooks/useTasks";
import { getTeamMembers } from "@/server/actions/team";
import { TaskStatus } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, isBefore } from "date-fns";
import { useQuery } from "@tanstack/react-query";

interface TaskSidebarProps {
    teamId: number;
    userId: number;
    isAdmin: boolean;
}

export default function TaskSidebar({ teamId, userId, isAdmin }: TaskSidebarProps) {
    const [isOpen, setIsOpen] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const { tasks, addTask, updateStatus, loading } = useTasks(teamId);
    const [filter, setFilter] = useState<string>("ALL");

    const { data: members = [] } = useQuery({
        queryKey: ["members", teamId],
        queryFn: () => getTeamMembers(teamId),
        enabled: !!teamId,
    });

    // Form states
    const [title, setTitle] = useState("");
    const [desc, setDesc] = useState("");
    const [status, setStatus] = useState<TaskStatus>(TaskStatus.PENDING);
    const [assigneeId, setAssigneeId] = useState<string>("");
    const [deadline, setDeadline] = useState("");

    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        const result = await addTask({
            title,
            description: desc,
            status,
            assignedToId: assigneeId ? parseInt(assigneeId) : undefined,
            deadline: deadline || undefined,
        });

        if (result) {
            setIsCreating(false);
            setTitle("");
            setDesc("");
            setAssigneeId("");
            setDeadline("");
            setStatus(TaskStatus.PENDING);
        }
    }, [title, desc, status, assigneeId, deadline, addTask]);

    const filteredTasks = useMemo(() => {
        return (tasks as any[]).filter(task => {
            if (!isAdmin && task.assignedToId !== userId) return false;
            if (filter === "ALL") return true;
            return task.status === filter;
        });
    }, [tasks, isAdmin, userId, filter]);

    const statusIcons = useMemo(() => ({
        [TaskStatus.PENDING]: <Circle className="w-4 h-4 text-zinc-500" />,
        [TaskStatus.IN_PROGRESS]: <Clock className="w-4 h-4 text-yellow-500 animate-pulse" />,
        [TaskStatus.DONE]: <CheckCircle2 className="w-4 h-4 text-green-500" />,
        [TaskStatus.OVERDUE]: <AlertCircle className="w-4 h-4 text-red-500" />,
    }), []);

    return (
        <>
            <div className={cn(
                "flex flex-col h-screen border-l border-white/5 bg-zinc-950 text-zinc-100 transition-all duration-500 ease-in-out z-40 relative shadow-2xl overflow-hidden",
                isOpen ? "w-96" : "w-0 md:w-16"
            )}>
                <div className="flex items-center justify-between p-4 border-b border-white/5 bg-zinc-900/50 backdrop-blur-md sticky top-0 z-50">
                    {isOpen && (
                        <div className="flex items-center gap-2">
                             <div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                             <h2 className="text-sm font-bold tracking-widest uppercase opacity-80">Command Hub</h2>
                        </div>
                    )}
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-zinc-400 hover:text-white hover:bg-white/5"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
                    </Button>
                </div>

                {isOpen && (
                    <div className="flex-1 flex flex-col min-h-0 bg-linear-to-b from-zinc-950 to-black">
                        <div className="p-4 space-y-4">
                            <div className="flex items-center gap-2">
                                <Select value={filter} onValueChange={setFilter}>
                                    <SelectTrigger className="h-8 bg-zinc-900/50 border-white/10 text-[10px] text-white font-bold uppercase tracking-widest">
                                        <Filter className="w-3 h-3 mr-2 opacity-50" />
                                        <SelectValue placeholder="All Clusters" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="ALL">All Status</SelectItem>
                                        <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                                        <SelectItem value={TaskStatus.IN_PROGRESS}>Working</SelectItem>
                                        <SelectItem value={TaskStatus.DONE}>Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                                {isAdmin && (
                                    <Button 
                                        size="sm" 
                                        className="h-8 shadow-lg shadow-primary/20 text-[10px] font-black uppercase tracking-widest" 
                                        onClick={() => setIsCreating(true)}
                                    >
                                        <Plus className="w-3 h-3 mr-1" /> New Mandate
                                    </Button>
                                )}
                            </div>
                        </div>

                        {isCreating && (
                            <div className="px-4 pb-4 animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="p-5 rounded-3xl border border-white/5 bg-white/5 space-y-4 shadow-2xl">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Deployment Protocol</span>
                                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => setIsCreating(false)}>
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                    <Input 
                                        placeholder="Identification" 
                                        className="bg-black/50 border-white/10 h-10 text-xs text-white"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="relative">
                                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-500 pointer-events-none" />
                                            <Input 
                                                type="date"
                                                className="bg-black/50 border-white/10 h-9 text-[10px] pl-8 text-white appearance-none"
                                                value={deadline}
                                                onChange={(e) => setDeadline(e.target.value)}
                                            />
                                        </div>
                                        <Select value={assigneeId} onValueChange={setAssigneeId}>
                                            <SelectTrigger className="h-9 bg-black/50 border-white/10 text-[10px] text-white">
                                                <UserPlus className="w-3 h-3 mr-1 opacity-50" />
                                                <SelectValue placeholder="Unit" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {members.map((m: any) => (
                                                    <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <Button className="w-full h-10 text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-primary/10" onClick={handleSubmit}>Initialize Strategy</Button>
                                </div>
                            </div>
                        )}

                        <ScrollArea className="flex-1 px-4">
                            <div className="space-y-4 pb-8">
                                {loading ? (
                                    <div className="flex flex-col gap-4 py-4">
                                        {[1,2,3].map(i => <div key={i} className="h-28 w-full bg-white/5 animate-pulse rounded-3xl" />)}
                                    </div>
                                ) : filteredTasks.length === 0 ? (
                                    <div className="text-center py-24 opacity-20 select-none grayscale">
                                        <Circle className="w-16 h-16 mx-auto mb-6 stroke-[0.5]" />
                                        <p className="text-[10px] font-black tracking-[0.5em] uppercase">No active mandates found</p>
                                    </div>
                                ) : (
                                    filteredTasks.map((task) => {
                                        const isOverdue = task.deadline && isBefore(new Date(task.deadline), new Date()) && task.status !== TaskStatus.DONE;
                                        return (
                                            <div 
                                                key={task.id} 
                                                className="group p-5 rounded-3xl border border-white/5 bg-zinc-900/40 hover:bg-zinc-900/80 transition-all duration-500 relative overflow-hidden"
                                            >
                                                <div className={cn(
                                                    "absolute bottom-0 left-0 w-1 h-0 group-hover:h-full transition-all duration-700",
                                                    task.status === TaskStatus.DONE ? "bg-green-500" :
                                                    isOverdue ? "bg-red-500" :
                                                    task.status === TaskStatus.IN_PROGRESS ? "bg-yellow-500" : "bg-zinc-700"
                                                )} />

                                                <div className="flex items-start justify-between gap-4 mb-3">
                                                    <div className="flex items-start gap-3">
                                                        <div className="mt-0.5">{statusIcons[task.status as TaskStatus]}</div>
                                                        <h3 className="text-sm font-bold leading-tight group-hover:text-primary transition-colors pr-4">
                                                            {task.title}
                                                        </h3>
                                                    </div>
                                                    <Badge variant="outline" className={cn(
                                                        "text-[8px] h-4 px-1.5 font-black uppercase tracking-tighter border-white/10",
                                                        isOverdue ? "text-red-500 bg-red-500/10 border-red-500/20" : "text-zinc-500"
                                                    )}>
                                                        {isOverdue ? "Overdue" : task.status.toLowerCase().replace('_', ' ')}
                                                    </Badge>
                                                </div>

                                                <div className="flex items-center justify-between mt-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-7 h-7 rounded-2xl bg-zinc-800 border border-white/5 flex items-center justify-center text-[10px] font-black">
                                                            {task.assignedTo?.name[0] || "?"}
                                                        </div>
                                                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{task.assignedTo?.name || "Unassigned"}</span>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-1">
                                                        <div className="flex items-center gap-1.5 opacity-40 text-[9px] font-bold">
                                                            <Calendar className="w-3 h-3" />
                                                            {task.deadline ? format(new Date(task.deadline), 'MMM dd, yyyy') : "No Deadline"}
                                                        </div>
                                                    </div>
                                                </div>

                                                {task.status !== TaskStatus.DONE && (
                                                    <div className="mt-4 hidden group-hover:block animate-in slide-in-from-top-2 duration-300">
                                                        <Button 
                                                            size="sm" 
                                                            variant="default" 
                                                            className="w-full h-8 text-[9px] font-black uppercase tracking-[0.2em] shadow-xl shadow-primary/10"
                                                            onClick={(e) => { e.stopPropagation(); updateStatus(task.id, TaskStatus.DONE); }}
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
