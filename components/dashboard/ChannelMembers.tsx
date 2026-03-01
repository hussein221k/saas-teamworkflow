"use client";

import React, { useState, useMemo } from "react";
import { useChannelMembers } from "@/hooks/useChannelMembers";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X } from "lucide-react";

interface MemberLike {
  id: string;
  name?: string | null;
  email?: string | null;
  username?: string | null;
}

interface ChannelMembersProps {
  channel_id: string;
  team_id: string;
  currentuser_id: string;
  isAdmin?: boolean;
  onClose: () => void;
}

export default function ChannelMembers({
  channel_id,
  team_id,
  currentuser_id,
  isAdmin = false,
  onClose,
}: ChannelMembersProps) {
  const {
    members,
    loadingMembers,
    teamMembers,
    loadingTeamMembers,
    addUser,
    removeUser,
    addLoading,
    removeLoading,
  } = useChannelMembers(channel_id, team_id);

  const [toAddId, setToAddId] = useState<string>("");

  const availableToAdd = useMemo(() => {
    return teamMembers.filter((tm: MemberLike) =>
      !members.some((m) => m.id === tm.id)
    );
  }, [teamMembers, members]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-zinc-900 rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h3 className="text-lg font-bold">Channel Members</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
        <div className="p-4 flex-1 overflow-hidden">
          {(loadingMembers || loadingTeamMembers) && (
            <p className="text-center text-sm text-zinc-400">Loading...</p>
          )}
          {!loadingMembers && members.length === 0 && (
            <p className="text-center text-sm text-zinc-400">
              No members in this channel.
            </p>
          )}
          <ScrollArea className="h-full">
            <ul className="space-y-2">
              {members.map((m) => (
                <li key={m.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback>{m.name?.[0] || "U"}</AvatarFallback>
                    </Avatar>
                    <span>{m.name || m.email || m.username}</span>
                  </div>
                  {isAdmin && m.id !== currentuser_id && (
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={removeLoading}
                      onClick={() => removeUser(m.id)}
                    >
                      Kick
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </ScrollArea>
        </div>
        {isAdmin && (
          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <select
                className="flex-1 bg-zinc-800 border border-white/20 text-sm p-2 rounded"
                value={toAddId}
                onChange={(e) => setToAddId(e.target.value)}
              >
                <option value="">Add member...</option>
                {availableToAdd.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name || u.username || u.email}
                  </option>
                ))}
              </select>
              <Button
                disabled={!toAddId || addLoading}
                onClick={() => {
                  if (toAddId) {
                    addUser(toAddId).then(() => setToAddId(""));
                  }
                }}
              >
                Add
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
