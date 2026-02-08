"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Menu, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { createTeam, switchTeam, getTeamMembers, generateTeamInvite, joinTeamByCode, removeMemberFromTeam } from "@/server/actions/team";
import { createChannel, getTeamChannels } from "@/server/actions/channel";
import { createProject, getTeamProjects, deleteProject } from "@/server/actions/project";
import { createEmployee, deleteEmployee } from "@/server/actions/employee";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";

// 🔹 Child Components
import { TeamRail } from "./TeamRail";
import { ChannelSidebar } from "./ChannelSidebar";
import { AdminPanel } from "./AdminPanel";

interface ChatsmangeProps {
  userId: number;
  currentTeamId: number;
  initialTeams: { id: number; name: string; ownerId?: number; inviteCode?: string | null }[];
  isAdmin: boolean;
}

function Chatsmange({ userId, currentTeamId, initialTeams, isAdmin }: ChatsmangeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [teams, setTeams] = useState(initialTeams || []);
  const [newTeamName, setNewTeamName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const [isGroupSheetOpen, setIsGroupSheetOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  
  const [empName, setEmpName] = useState("");
  const [empUsername, setEmpUsername] = useState("");
  const [empCode, setEmpCode] = useState("");
  const [empPass, setEmpPass] = useState("");
  const [isCreatingEmp, setIsCreatingEmp] = useState(false);
  
  const [isJoinSheetOpen, setIsJoinSheetOpen] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [isJoining, setIsJoining] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const activeChannelIdStr = searchParams.get("channelId");
  const activeChannelId = activeChannelIdStr ? Number(activeChannelIdStr) : null;

  const navigateToChannel = useCallback((id: number | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (id) {
       params.set("channelId", id.toString());
    } else {
       params.delete("channelId");
    }
    router.push(`${pathname}?${params.toString()}`);
  }, [pathname, router, searchParams]);

  const { data: members = [] } = useQuery({
    queryKey: ["members", currentTeamId],
    queryFn: () => getTeamMembers(currentTeamId),
    enabled: !!currentTeamId,
    staleTime: 1000 * 60 * 10,
  });

  const { data: channels = [], refetch: refetchChannels } = useQuery({
    queryKey: ["channels", currentTeamId],
    queryFn: async () => {
      const res = await getTeamChannels(currentTeamId);
      return res.channels || [];
    },
    enabled: !!currentTeamId,
  });

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ["projects", currentTeamId],
    queryFn: async () => {
      return await getTeamProjects(currentTeamId);
    },
    enabled: !!currentTeamId,
  });

  const colors = useMemo(() => [
    "bg-indigo-600", "bg-emerald-600", "bg-violet-600", "bg-amber-600", "bg-rose-600", "bg-blue-600"
  ], []);

  const handleCreateTeam = useCallback(async () => {
    if (!newTeamName.trim()) return;
    setIsCreating(true);
    try {
      const result = await createTeam(newTeamName, userId);
      if (result.success && result.team) {
        setTeams(prev => [...prev, result.team!]);
        setNewTeamName("");
        setIsSheetOpen(false);
        toast.success("Team synchronized.");
        router.refresh();
      } else {
        toast.error(result.error || "Integration failure");
      }
    } finally {
      setIsCreating(false);
    }
  }, [newTeamName, userId, router]);

  const handleCreateGroup = useCallback(async () => {
    if (!newGroupName.trim() || !isAdmin) return;
    try {
        const res = await createChannel(currentTeamId, newGroupName);
        if (res.success) {
            toast.success("New communication node initialized.");
            setNewGroupName("");
            setIsGroupSheetOpen(false);
            refetchChannels();
        } else {
            toast.error(res.error);
        }
    } catch (e) {
        toast.error("Uplink failed");
    }
  }, [newGroupName, currentTeamId, isAdmin, refetchChannels]);

  const handleSwitchTeam = useCallback(async (teamId: number) => {
    if (teamId === currentTeamId) return;
    const result = await switchTeam(userId, teamId);
    if (result.success) {
      toast.success("Neural link established.");
      router.refresh(); 
    }
  }, [currentTeamId, userId, router]);

  const handleCreateProject = useCallback(async () => {
    if (!newProjectName.trim() || !isAdmin) return;
    setIsCreatingProject(true);
    try {
        const res = await createProject({ name: newProjectName, teamId: currentTeamId });
        if (res.success) {
            toast.success("Project node initialized. Allocation: $5.00 confirmed.");
            setNewProjectName("");
            refetchProjects();
        } else {
            toast.error(res.error);
        }
    } finally {
        setIsCreatingProject(false);
    }
  }, [newProjectName, currentTeamId, isAdmin, refetchProjects]);

  const handleCreateEmployee = useCallback(async () => {
    if (!empName.trim() || !isAdmin) return;
    setIsCreatingEmp(true);
    try {
        const res = await createEmployee({
            name: empName,
            username: empUsername,
            employeeCode: empCode,
            password: empPass
        });
        if (res.success) {
            toast.success("Unit synchronized and assigned to cluster.");
            setEmpName(""); setEmpUsername(""); setEmpCode(""); setEmpPass("");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        } else {
            toast.error(res.error);
        }
    } finally {
        setIsCreatingEmp(false);
    }
  }, [empName, empUsername, empCode, empPass, isAdmin, queryClient]);

  const handleDeleteUnit = useCallback(async (id: number) => {
    if (confirm("Confirm decommissioning of this unit?")) {
        const res = await deleteEmployee(id);
        if (res.success) {
            toast.info("Unit decommissioned.");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        }
    }
  }, [queryClient]);

  const handleDeleteProject = useCallback(async (id: number) => {
    if (confirm("Terminate project node?")) {
        const res = await deleteProject(id);
        if (res.success) {
            toast.info("Project node detached.");
            refetchProjects();
        }
    }
  }, [refetchProjects]);

  const onGenerateInvite = useCallback(async () => {
    const res = await generateTeamInvite(currentTeamId);
    if (res.success) {
        toast.success("Intelligence frequency generated: " + res.code);
        router.refresh();
    }
  }, [currentTeamId, router]);

  const onJoinTeam = useCallback(async () => {
    if (!joinCodeInput.trim()) return;
    setIsJoining(true);
    try {
        const res = await joinTeamByCode(userId, joinCodeInput);
        if (res.success) {
            toast.success("Neural synchronization complete.");
            setIsJoinSheetOpen(false);
            setJoinCodeInput("");
            router.refresh();
        } else {
            toast.error(res.error);
        }
    } finally {
        setIsJoining(false);
    }
  }, [userId, joinCodeInput, router]);

  const onKickMember = useCallback(async (memberId: number) => {
    if (confirm("Execute expulsion protocol for this unit?")) {
        const res = await removeMemberFromTeam(memberId, currentTeamId);
        if (res.success) {
            toast.warning("Unit disconnected from cluster.");
            queryClient.invalidateQueries({ queryKey: ["members"] });
        } else {
            toast.error(res.error);
        }
    }
  }, [currentTeamId, queryClient]);

  const currentTeam = teams.find(t => t.id === currentTeamId);
  const inviteUrl = typeof window !== 'undefined' ? `${window.location.origin}/join?code=${currentTeam?.inviteCode}` : "";

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button className="p-2 bg-zinc-900 text-white rounded-xl border border-white/10" onClick={() => setIsOpen(!isOpen)}>
          <Menu size={20} />
        </button>
      </div>

      <div className={cn(
          "flex flex-row h-screen border-r border-white/5 bg-zinc-950 text-zinc-100 transition-all duration-500 ease-in-out z-40 relative",
          "fixed inset-y-0 left-0 w-full md:w-auto md:static md:translate-x-0 overflow-hidden",
          isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        {/* 🔹 Teams Rail Component */}
        <TeamRail 
            teams={teams}
            currentTeamId={currentTeamId}
            handleSwitchTeam={handleSwitchTeam}
            setIsSheetOpen={setIsSheetOpen}
            setIsJoinSheetOpen={setIsJoinSheetOpen}
            setIsAdminPanelOpen={setIsAdminPanelOpen}
            isAdmin={isAdmin}
            colors={colors}
        />

        {/* 🔹 Channels Sidebar Component */}
        <ChannelSidebar 
            channels={channels}
            members={members}
            activeChannelId={activeChannelId}
            navigateToChannel={navigateToChannel}
            setIsGroupSheetOpen={setIsGroupSheetOpen}
            isAdmin={isAdmin}
        />

        {/* Sheets for Creation */}
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetContent side="left" className="bg-zinc-950 text-white border-white/5">
              <SheetHeader><SheetTitle className="text-white">NEW CLUSTER</SheetTitle></SheetHeader>
              <div className="py-6"><Input value={newTeamName} onChange={e => setNewTeamName(e.target.value)} placeholder="Cluster Name" className="bg-zinc-900" /></div>
              <Button onClick={handleCreateTeam} disabled={isCreating} className="w-full">INITIALIZE</Button>
            </SheetContent>
        </Sheet>

        <Sheet open={isGroupSheetOpen} onOpenChange={setIsGroupSheetOpen}>
            <SheetContent side="left" className="bg-zinc-950 text-white border-white/5">
              <SheetHeader><SheetTitle className="text-white font-black">NEW BATTLE GROUP</SheetTitle></SheetHeader>
              <div className="py-6"><Input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Group Designation" className="bg-zinc-900 border-white/10" /></div>
              <Button onClick={handleCreateGroup} className="w-full font-bold">SYNC GROUP</Button>
            </SheetContent>
        </Sheet>

        <Sheet open={isJoinSheetOpen} onOpenChange={setIsJoinSheetOpen}>
            <SheetContent side="left" className="bg-zinc-950 text-white border-white/5">
                <SheetHeader>
                    <SheetTitle className="text-white font-black text-xl tracking-tighter">CLUSTER SYNCHRONIZATION</SheetTitle>
                    <SheetDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">Enter Cluster Identity Matrix</SheetDescription>
                </SheetHeader>
                <div className="py-8 space-y-4 text-left">
                    <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-black opacity-40 text-white">Protocol String</Label>
                        <Input 
                            value={joinCodeInput} 
                            onChange={e => setJoinCodeInput(e.target.value.toUpperCase())} 
                            placeholder="CODE-X" 
                            className="bg-zinc-900 border-white/10 h-14 text-center font-black text-2xl tracking-[0.4em] text-white" 
                        />
                    </div>
                    <Button onClick={onJoinTeam} disabled={isJoining || !joinCodeInput.trim()} className="w-full h-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-white">
                        {isJoining ? <Loader2 className="animate-spin" /> : "ESTABLISH UPLINK"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>

        {/* 🛡️ Admin Central Control Component */}
        <AdminPanel 
            isOpen={isAdminPanelOpen}
            setIsOpen={setIsAdminPanelOpen}
            currentTeam={currentTeam}
            inviteUrl={inviteUrl}
            onGenerateInvite={onGenerateInvite}
            newProjectName={newProjectName}
            setNewProjectName={setNewProjectName}
            handleCreateProject={handleCreateProject}
            isCreatingProject={isCreatingProject}
            projects={projects}
            handleDeleteProject={handleDeleteProject}
            empName={empName}
            setEmpName={setEmpName}
            empCode={empCode}
            setEmpCode={setEmpCode}
            empUsername={empUsername}
            setEmpUsername={setEmpUsername}
            empPass={empPass}
            setEmpPass={setEmpPass}
            handleCreateEmployee={handleCreateEmployee}
            isCreatingEmp={isCreatingEmp}
            members={members}
            onKickMember={onKickMember}
            handleDeleteUnit={handleDeleteUnit}
        />
      </div>
    </>
  );
}

export default Chatsmange;
