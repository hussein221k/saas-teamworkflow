"use client";

import React from "react";
import {
  ShieldCheck,
  QrCode,
  Link2,
  LogIn,
  Loader2,
  Trash2,
  UserPlus,
  MessageSquare,
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { CreditCard } from "lucide-react";
import { toast } from "sonner";
import { ActiveSheet } from "./Chatchannels";

interface AdminPanelProps {
  isOpen: ActiveSheet | undefined;
  setIsOpen: (open: ActiveSheet | undefined) => void;
  currentTeam:
    | {
        id: string;
        name: string;
        inviteCode: string | null;
      }
    | undefined;
  inviteUrl: string;
  onGenerateInvite: () => void;
  empName: string;
  setEmpName: (v: string) => void;
  empCode: string;
  setEmpCode: (v: string) => void;
  empUsername: string;
  setEmpUsername: (v: string) => void;
  empPass: string;
  setEmpPass: (v: string) => void;
  handleCreateEmployee: () => void;
  isCreatingEmp: boolean;
  members: {
    id: string;
    name: string;
    role: string;
    employee_code: string | null;
  }[];
  onKickMember: (id: string) => void;
  handleDeleteUnit: (id: string) => void;
}

export function AdminPanel({
  isOpen,
  setIsOpen,
  currentTeam,
  inviteUrl,
  onGenerateInvite,
  empName,
  setEmpName,
  empCode,
  setEmpCode,
  empUsername,
  setEmpUsername,
  empPass,
  setEmpPass,
  handleCreateEmployee,
  isCreatingEmp,
  members,
  onKickMember,
  handleDeleteUnit,
}: AdminPanelProps) {
  return (
    <Sheet
      open={isOpen === ActiveSheet.admin}
      onOpenChange={(open) => !open && setIsOpen(undefined)}
    >
      <SheetContent
        side="right"
        className="bg-zinc-950 text-white border-white/10 w-full sm:max-w-xl overflow-y-auto"
      >
        <SheetHeader className="pb-6 border-b border-white/5">
          <SheetTitle className="text-primary font-black text-2xl tracking-tighter flex items-center gap-3">
            <ShieldCheck className="w-8 h-8" /> STRATEGIC COMMAND
          </SheetTitle>
          <SheetDescription className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">
            Centralized Cluster Management & Logic Optimization
          </SheetDescription>
        </SheetHeader>

        <div className="py-8 space-y-12">
          {/* 📡 Neural Link (Join/Invite) */}
          <div className="space-y-6 p-6 rounded-2xl bg-primary/5 border border-primary/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <QrCode className="w-24 h-24" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white">
              <Link2 className="w-4 h-4 text-primary" /> Intelligence Link
            </h3>

            {currentTeam?.inviteCode ? (
              <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-2xl">
                  <QRCodeSVG
                    value={inviteUrl}
                    size={160}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="mt-4 text-[10px] font-black uppercase text-black tracking-[0.2em]">
                    Cluster Identity Matrix
                  </div>
                </div>
                <div className="space-y-2 text-left">
                  <Label className="text-[10px] uppercase font-black opacity-40 text-white">
                    Protocol String (Join Code)
                  </Label>
                  <div className="flex gap-2">
                    <div className="flex-1 bg-black/40 border border-white/10 rounded-xl h-12 flex items-center justify-center font-black text-lg tracking-[0.3em] overflow-hidden text-white">
                      {currentTeam.inviteCode}
                    </div>
                    <Button
                      size="icon"
                      className="h-12 w-12 bg-zinc-800 rounded-xl"
                      onClick={() => {
                        navigator.clipboard.writeText(currentTeam.inviteCode!);
                        toast.success("Code copied to neural buffer.");
                      }}
                    >
                      <LogIn className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-[9px] text-zinc-500 font-bold text-center">
                    Scan to synchronize or enter code manually.
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <p className="text-xs text-zinc-400 font-medium">
                  Join Protocol is currently disabled for this cluster.
                </p>
                <Button
                  onClick={onGenerateInvite}
                  className="w-full h-12 font-black uppercase tracking-widest bg-primary shadow-lg shadow-primary/20 text-white"
                >
                  Enable Intelligence Link
                </Button>
              </div>
            )}
            {currentTeam?.inviteCode && (
              <Button
                variant="ghost"
                className="w-full text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white"
                onClick={onGenerateInvite}
              >
                Reset Neural Link
              </Button>
            )}
          </div>

          {/* 👥 Unit Synchronization (Employee Management) */}
          <div className="space-y-6 text-left">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white">
              <UserPlus className="w-4 h-4 text-primary" /> Unit Synchronization
            </h3>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black opacity-40 text-white">
                    Full Name
                  </Label>
                  <Input
                    value={empName}
                    onChange={(e) => setEmpName(e.target.value)}
                    placeholder="Unit Name"
                    className="bg-black/40 border-white/5 h-10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black opacity-40 text-white">
                    Designation Code
                  </Label>
                  <Input
                    value={empCode}
                    onChange={(e) => setEmpCode(e.target.value)}
                    placeholder="EMP-000"
                    className="bg-black/40 border-white/5 h-10 text-white"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black opacity-40 text-white">
                    Neural Link ID (Username)
                  </Label>
                  <Input
                    value={empUsername}
                    onChange={(e) => setEmpUsername(e.target.value)}
                    placeholder="username"
                    className="bg-black/40 border-white/5 h-10 text-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] uppercase font-black opacity-40 text-white">
                    Access Protocol (Password)
                  </Label>
                  <Input
                    value={empPass}
                    type="password"
                    onChange={(e) => setEmpPass(e.target.value)}
                    placeholder="••••••••"
                    className="bg-black/40 border-white/5 h-10 text-white"
                  />
                </div>
              </div>
              <Button
                onClick={handleCreateEmployee}
                disabled={isCreatingEmp}
                className="w-full h-12 font-black uppercase tracking-[0.3em] bg-zinc-100 text-black hover:bg-white transition-all shadow-xl shadow-white/5 mt-4"
              >
                {isCreatingEmp ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  "Authorize Synchronization"
                )}
              </Button>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600">
                Active Cluster Units
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {members
                  .filter((m) => m.role === "EMPLOYEE")
                  .map((m) => (
                    <div
                      key={m.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 group"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8 border border-white/10">
                          <AvatarFallback className="bg-zinc-800 text-[10px] font-black uppercase">
                            {m.name[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="text-xs font-bold leading-none mb-1 text-white">
                            {m.name}
                          </span>
                          <span className="text-[9px] font-black uppercase text-zinc-500">
                            {m.employee_code || "SYS-NODE"}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-zinc-600 hover:text-primary"
                          title="Chat with Unit"
                          onClick={() => {
                            window.location.href = `/admin/dashboard/${currentTeam?.id}?receiver_id=${m.id}`;
                          }}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-zinc-600 hover:text-orange-500"
                          title="Expel Unit"
                          onClick={() => onKickMember(m.id)}
                        >
                          <LogIn className="w-4 h-4 rotate-180" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="opacity-0 group-hover:opacity-100 h-8 w-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all font-bold"
                          onClick={() => handleDeleteUnit(m.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 📡 All Team Members for Chat */}
            <div className="space-y-6 text-left">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2 text-white">
                <MessageSquare className="w-4 h-4 text-primary" /> Neural
                Communication
              </h3>
              <p className="text-[10px] text-zinc-500 font-medium">
                Click to initiate direct communication with any team member
              </p>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-black/40 border border-white/5 group hover:border-primary/30 transition-all cursor-pointer"
                    onClick={() => {
                      window.location.href = `/admin/dashboard/${currentTeam?.id}?receiver_id=${m.id}`;
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarFallback className="bg-zinc-800 text-[10px] font-black uppercase">
                          {m.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold leading-none mb-1 text-white">
                          {m.name}
                        </span>
                        <span className="text-[9px] font-black uppercase text-zinc-500">
                          {m.role}
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-zinc-600 hover:text-primary"
                      title="Chat"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.location.href = `/admin/dashboard/${currentTeam?.id}?receiver_id=${m.id}`;
                      }}
                    >
                      <MessageSquare className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <SheetFooter className="pt-8 border-t border-white/5">
          <div className="w-full flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-zinc-700">
            <span>Cluster Status: Nominal</span>
            <div className="flex items-center gap-2">
              <CreditCard className="w-3 h-3" />
              <span>Billing: Verified</span>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
