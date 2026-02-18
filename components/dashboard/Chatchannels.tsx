/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import React, { useState, useMemo, useCallback } from "react";
import { Menu, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  createTeam,
  switchTeam,
  getTeamMembers,
  generateTeamInvite,
  joinTeamByCode,
  removeMemberFromTeam,
} from "@/server/actions/team";
import { createChannel, getTeamChannels } from "@/server/actions/channel";
import { createProject, getTeamProjects, deleteProject } from "@/server/actions/project";
import { createEmployee, deleteEmployee, provisionGhostUsers } from "@/server/actions/employee";
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
  user_id: string;
  currentteam_id: string;
  initialTeams: {
    id: string;
    name: string;
    owner_id?: string;
    inviteCode: string | null;
  }[];
  isAdmin: boolean;
}
export enum ActiveSheet {
  team = "team",
  admin = "admin",
  group = "group",
  join = "join",
}

function Chatsmange({
  user_id,
  currentteam_id,
  initialTeams,
  isAdmin,
}: ChatsmangeProps) {
  // 🔹 Consolidated State Blocks
  const [ui, setUi] = useState({
    activeSheet: undefined as ActiveSheet | undefined,
    isMenuOpen: false,
    isEncryptionMode: false,
  });

  const [formData, setFormData] = useState({
    teamName: "",
    groupName: "",
    projectName: "",
    empName: "",
    empUsername: "",
    empCode: "",
    empPass: "",
    joinCode: "",
    externalIdentities: "",
  });

  const [loading, setLoading] = useState({
    team: false,
    project: false,
    employee: false,
    join: false,
  });

  const [teams, setTeams] = useState(initialTeams || []);

  // Helper to update specific form fields
  const updateForm = (updates: Partial<typeof formData>) => 
    setFormData(prev => ({ ...prev, ...updates }));

  // Helper to update UI state
  const updateUi = (updates: Partial<typeof ui>) =>
    setUi(prev => ({ ...prev, ...updates }));

  // Helper to update loading status
  const updateLoading = (updates: Partial<typeof loading>) =>
    setLoading(prev => ({ ...prev, ...updates }));

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const activeChannelId = searchParams.get("channel_id");
  const activeReceiverId = searchParams.get("receiver_id");

  const navigateToChannel = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) {
        params.set("channel_id", id);
        params.delete("receiver_id");
      } else {
        params.delete("channel_id");
        params.delete("receiver_id");
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const navigateToMember = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("receiver_id", id);
      params.delete("channel_id");
      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const { data: members = [] } = useQuery({
    queryKey: ["members", currentteam_id],
    queryFn: () => getTeamMembers(currentteam_id),
    enabled: !!currentteam_id,
    staleTime: 1000 * 60 * 10,
  });

  const { data: channels = [], refetch: refetchChannels } = useQuery({
    queryKey: ["channels", currentteam_id],
    queryFn: async () => {
      const res = await getTeamChannels(currentteam_id);
      return res.channels || [];
    },
    enabled: !!currentteam_id,
  });

  const { data: projects = [], refetch: refetchProjects } = useQuery({
    queryKey: ["projects", currentteam_id],
    queryFn: async () => {
      return await getTeamProjects(currentteam_id);
    },
    enabled: !!currentteam_id,
  });

  const colors = useMemo(
    () => [
      "bg-indigo-600",
      "bg-emerald-600",
      "bg-violet-600",
      "bg-amber-600",
      "bg-rose-600",
      "bg-blue-600",
    ],
    [],
  );

  const handleCreateTeam = useCallback(async () => {
    if (!formData.teamName.trim()) return;
    updateLoading({ team: true });
    try {
      const result = await createTeam(formData.teamName, user_id);
      if (result.success && result.team) {
        setTeams((prev) => [
          ...prev,
          {
            id: result.team!.id,
            name: result.team!.name,
            owner_id: result.team!.owner_id,
            inviteCode: result.team!.invite_code,
          },
        ]);
        updateForm({ teamName: "" });
        updateUi({ activeSheet: ActiveSheet.team });
        toast.success("Team synchronized.");
        router.refresh();
      } else {
        toast.error(result.error || "Integration failure");
      }
    } finally {
      updateLoading({ team: false });
    }
  }, [formData.teamName, user_id, router]);

  const handleCreateGroup = useCallback(async () => {
    if (!formData.groupName.trim() || !isAdmin) return;
    try {
      const res = await createChannel(currentteam_id, formData.groupName);
      if (res.success) {
        if (ui.isEncryptionMode && formData.externalIdentities.trim()) {
          const names = formData.externalIdentities.split(",").filter(n => n.trim());
          const provRes = await provisionGhostUsers(currentteam_id, names);
          if (provRes.success) {
            toast.success(`${provRes.provisioned?.length} Encrypted Identities synchronized.`);
          }
        } else {
          toast.success("New communication node initialized.");
        }
        
        updateForm({ groupName: "", externalIdentities: "" });
        updateUi({ isEncryptionMode: false, activeSheet: undefined });
        refetchChannels();
        queryClient.invalidateQueries({ queryKey: ["members"] });
      } else {
        toast.error(res.error);
      }
    } catch (e) {
      toast.error("Uplink failed");
    }
  }, [formData.groupName, formData.externalIdentities, currentteam_id, isAdmin, refetchChannels, ui.isEncryptionMode, queryClient]);

  const handleSwitchTeam = useCallback(
    async (team_id: string) => {
      if (team_id === currentteam_id) return;
      const result = await switchTeam(user_id, team_id);
      if (result.success) {
        toast.success("Neural link established.");
        router.refresh();
      }
    },
    [currentteam_id, user_id, router],
  );

  const handleCreateProject = useCallback(async () => {
    if (!formData.projectName.trim() || !isAdmin) return;
    updateLoading({ project: true });
    try {
      const res = await createProject({
        name: formData.projectName,
        team_id: currentteam_id,
      });
      if (res.success) {
        toast.success("Project node initialized. Allocation: $5.00 confirmed.");
        updateForm({ projectName: "" });
        refetchProjects();
      } else {
        toast.error(res.error);
      }
    } finally {
      updateLoading({ project: false });
    }
  }, [formData.projectName, currentteam_id, isAdmin, refetchProjects]);

  const handleCreateEmployee = useCallback(async () => {
    if (!formData.empName.trim() || !isAdmin) return;
    updateLoading({ employee: true });
    try {
      const res = await createEmployee({
        name: formData.empName,
        username: formData.empUsername,
        employee_code: formData.empCode,
        password: formData.empPass,
      });
      if (res.success) {
        toast.success("Unit synchronized and assigned to cluster.");
        updateForm({ empName: "", empUsername: "", empCode: "", empPass: "" });
        queryClient.invalidateQueries({ queryKey: ["members"] });
      } else {
        toast.error(res.error);
      }
    } finally {
      updateLoading({ employee: false });
    }
  }, [formData.empName, formData.empUsername, formData.empCode, formData.empPass, isAdmin, queryClient]);

  const handleDeleteUnit = useCallback(
    async (id: string) => {
      if (confirm("Confirm decommissioning of this unit?")) {
        const res = await deleteEmployee(id);
        if (res.success) {
          toast.info("Unit decommissioned.");
          queryClient.invalidateQueries({ queryKey: ["members"] });
        }
      }
    },
    [queryClient],
  );

  const handleDeleteProject = useCallback(
    async (id: string) => {
      if (confirm("Terminate project node?")) {
        const res = await deleteProject(id);
        if (res.success) {
          toast.info("Project node detached.");
          refetchProjects();
        }
      }
    },
    [refetchProjects],
  );

  const onGenerateInvite = useCallback(async () => {
    const res = await generateTeamInvite(currentteam_id);
    if (res.success) {
      toast.success("Intelligence frequency generated: " + res.code);
      router.refresh();
    }
  }, [currentteam_id, router]);

  const onJoinTeam = useCallback(async () => {
    if (!formData.joinCode.trim()) return;
    updateLoading({ join: true });
    try {
      const res = await joinTeamByCode(user_id, formData.joinCode);
      if (res.success) {
        toast.success("Neural synchronization complete.");
        updateUi({ activeSheet: ActiveSheet.join });
        updateForm({ joinCode: "" });
        router.refresh();
      } else {
        toast.error(res.error);
      }
    } finally {
      updateLoading({ join: false });
    }
  }, [user_id, formData.joinCode, router]);

  const onKickMember = useCallback(
    async (memberId: string) => {
      if (confirm("Execute expulsion protocol for this unit?")) {
        const res = await removeMemberFromTeam(memberId, currentteam_id);
        if (res.success) {
          toast.warning("Unit disconnected from cluster.");
          queryClient.invalidateQueries({ queryKey: ["members"] });
        } else {
          toast.error(res.error);
        }
      }
    },
    [currentteam_id, queryClient],
  );

  const currentTeam = teams.find((t) => t.id === currentteam_id);
  const inviteUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/join?code=${currentTeam?.inviteCode}`
      : "";

  return (
    <>
      <div className="md:hidden fixed top-4 left-4 z-50">
        <Button
          className="p-2 bg-zinc-900 text-white rounded-xl border border-white/10"
          onClick={() => updateUi({ isMenuOpen: !ui.isMenuOpen })}
        >
          <Menu size={20} />
        </Button>
      </div>
      <div
        className={cn(
          "flex flex-row h-screen border-r border-white/5 bg-zinc-950 text-zinc-100 transition-all duration-500 ease-in-out z-40 relative",
          "fixed inset-y-0 left-0 w-full md:w-auto md:static md:translate-x-0 overflow-hidden",
          ui.isMenuOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {/* 🔹 Teams Rail Component */}
        <TeamRail
          teams={teams}
          currentteam_id={currentteam_id}
          handleSwitchTeam={handleSwitchTeam}
          setActiveSheet={(sheet) => updateUi({ activeSheet: sheet })}
          isAdmin={isAdmin}
          colors={colors}
        />

        {/* 🔹 Channels Sidebar Component */}
        <ChannelSidebar
          activeSheet={ui.activeSheet}
          activeChannelId={activeChannelId}
          activeReceiverId={activeReceiverId}
          channels={channels}
          members={members}
          navigateToChannel={navigateToChannel}
          navigateToMember={navigateToMember}
          setActiveSheet={(sheet) => updateUi({ activeSheet: sheet })}
          isAdmin={isAdmin}
        />

        {/* 🔹 Team Creation Sheet */}
        <Sheet
          open={ui.activeSheet === ActiveSheet.team}
          onOpenChange={(open) => !open && updateUi({ activeSheet: undefined })}
        >
          <SheetContent
            side="left"
            className="bg-zinc-950 text-white border-white/5"
          >
            <SheetHeader>
              <SheetTitle className="text-white font-black">NEW CLUSTER</SheetTitle>
              <SheetDescription className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                Initialize a new organizational grid
              </SheetDescription>
            </SheetHeader>
            <div className="py-8 space-y-4">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black opacity-40">Cluster Name</Label>
                <Input
                  value={formData.teamName}
                  onChange={(e) => updateForm({ teamName: e.target.value })}
                  placeholder="OMEGA-7"
                  className="bg-zinc-900 border-white/10"
                />
              </div>
              <Button
                onClick={handleCreateTeam}
                disabled={loading.team}
                className="w-full font-bold"
              >
                {loading.team ? <Loader2 className="animate-spin" /> : "INITIALIZE"}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* 🔹 Group Creation Sheet (With Encryption Mode) */}
        <Sheet
          open={ui.activeSheet === ActiveSheet.group}
          onOpenChange={(open) => !open && updateUi({ activeSheet: undefined })}
        >
          <SheetContent
            side="left"
            className="bg-zinc-950 text-white border-white/5"
          >
            <SheetHeader>
              <SheetTitle className="text-white font-black">
                NEW BATTLE GROUP
              </SheetTitle>
              <SheetDescription className="text-zinc-500 text-[10px] uppercase tracking-widest font-bold">
                Deploy a specialized communication node
              </SheetDescription>
            </SheetHeader>
            <div className="py-8 space-y-6">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black opacity-40">Group Designation</Label>
                <Input
                  value={formData.groupName}
                  onChange={(e) => updateForm({ groupName: e.target.value })}
                  placeholder="RECON-SQUAD"
                  className="bg-zinc-900 border-white/10"
                />
              </div>

              <div className="p-4 rounded-xl bg-primary/5 border border-primary/10 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-[10px] font-black uppercase tracking-wider text-primary">Encryption Mode</Label>
                    <p className="text-[9px] text-zinc-500 leading-tight">Auto-provision unauthorized units into the app</p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => updateUi({ isEncryptionMode: !ui.isEncryptionMode })}
                    className={cn(
                      "h-6 text-[8px] font-black uppercase tracking-widest border px-2",
                      ui.isEncryptionMode ? "border-primary text-primary bg-primary/20" : "border-white/10 text-zinc-500"
                    )}
                  >
                    {ui.isEncryptionMode ? "ACTIVE" : "OFF"}
                  </Button>
                </div>

                {ui.isEncryptionMode && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <Label className="text-[9px] font-black uppercase opacity-60">Identity Matrix (Comma separated names)</Label>
                    <textarea
                      value={formData.externalIdentities}
                      onChange={(e) => updateForm({ externalIdentities: e.target.value })}
                      placeholder="Ghost, Phantom, Spectre..."
                      className="w-full bg-zinc-900/50 border border-white/10 rounded-lg p-3 text-[10px] font-bold h-20 focus:outline-none focus:border-primary/50 text-white"
                    />
                  </div>
                )}
              </div>

              <Button onClick={handleCreateGroup} className="w-full font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                SYNC GROUP NODE
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* 🔹 Join Team Sheet */}
        <Sheet
          open={ui.activeSheet === ActiveSheet.join}
          onOpenChange={(open) => !open && updateUi({ activeSheet: undefined })}
        >
          <SheetContent
            side="left"
            className="bg-zinc-950 text-white border-white/5"
          >
            <SheetHeader>
              <SheetTitle className="text-white font-black text-xl tracking-tighter">
                CLUSTER SYNCHRONIZATION
              </SheetTitle>
              <SheetDescription className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                Enter Cluster Identity Matrix
              </SheetDescription>
            </SheetHeader>
            <div className="py-8 space-y-4 text-left">
              <div className="space-y-2">
                <Label className="text-[10px] uppercase font-black opacity-40 text-white">
                  Protocol String
                </Label>
                <Input
                  value={formData.joinCode}
                  onChange={(e) =>
                    updateForm({ joinCode: e.target.value.toUpperCase() })
                  }
                  placeholder="CODE-X"
                  className="bg-zinc-900 border-white/10 h-14 text-center font-black text-2xl tracking-[0.4em] text-white"
                />
              </div>
              <Button
                onClick={onJoinTeam}
                disabled={loading.join || !formData.joinCode.trim()}
                className="w-full h-12 font-black uppercase tracking-widest shadow-xl shadow-primary/20 text-white"
              >
                {loading.join ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "ESTABLISH UPLINK"
                )}
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        {/* 🛡️ Admin Central Control Component */}
        <AdminPanel
          isOpen={ui.activeSheet}
          setIsOpen={(sheet) => updateUi({ activeSheet: sheet })}
          currentTeam={currentTeam}
          inviteUrl={inviteUrl}
          onGenerateInvite={onGenerateInvite}
          newProjectName={formData.projectName}
          setNewProjectName={(name) => updateForm({ projectName: name })}
          handleCreateProject={handleCreateProject}
          isCreatingProject={loading.project}
          projects={projects}
          handleDeleteProject={handleDeleteProject}
          empName={formData.empName}
          setEmpName={(name) => updateForm({ empName: name })}
          empCode={formData.empCode}
          setEmpCode={(code) => updateForm({ empCode: code })}
          empUsername={formData.empUsername}
          setEmpUsername={(username) => updateForm({ empUsername: username })}
          empPass={formData.empPass}
          setEmpPass={(pass) => updateForm({ empPass: pass })}
          handleCreateEmployee={handleCreateEmployee}
          isCreatingEmp={loading.employee}
          members={members}
          onKickMember={onKickMember}
          handleDeleteUnit={handleDeleteUnit}
        />
      </div>
    </>
  );
}

export default Chatsmange;
