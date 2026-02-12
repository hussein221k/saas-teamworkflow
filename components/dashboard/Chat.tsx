"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Send,
  Loader2,
  User,
  Hash,
  Search,
  MoreVertical,
  Paperclip,
  Smile,
} from "lucide-react";
import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import Microphone from "./Microphone";
import { sendLocalNotification } from "./NotificationManager";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useChat } from "@/hooks/useChat";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useSearchParams } from "next/navigation";


interface ChatProps {
  teamId: number;
  currentUserId: number;
}

function Chat({ teamId, currentUserId }: ChatProps) {
  const searchParams = useSearchParams();
  const channelId = searchParams.get("channelId")
    ? Number(searchParams.get("channelId"))
    : undefined;

  const { messages, loading, send, isSending } = useChat(teamId, channelId);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  const handleSend = useCallback(async () => {
    if (!inputValue.trim() || isSending) return;
    const content = inputValue;
    setInputValue("");
    await send(content);
    sendLocalNotification(
      "Neural Transmission confirmed",
      `Message fragment: "${content.substring(0, 20)}..."`,
    );
  }, [inputValue, isSending, send]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend],
  );

  const handleMicResult = useCallback((text: string) => {
    setInputValue((prev) => prev + " " + text);
  }, []);

  const messageList = useMemo(() => {
    if (messages.length === 0) return null;
    return messages.map((msg) => {
      const isMe = msg.userId === currentUserId;
      return (
        <div
          key={msg.id}
          className={cn(
            "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300",
            isMe ? "justify-end" : "justify-start",
          )}
        >
          <div
            className={cn(
              "flex max-w-[80%] gap-3 group",
              isMe ? "flex-row-reverse" : "flex-row",
            )}
          >
            <Avatar className="w-9 h-9 border border-white/5 shadow-2xl shrink-0">
              <AvatarFallback className="bg-zinc-800 text-zinc-400 text-xs font-bold">
                {msg.user?.name?.[0] || "U"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <div className={isMe ? "items-end" : "items-start"}>
                <div className="flex items-center gap-2 mb-1 px-1">
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">
                    {msg.user?.name}
                  </span>
                  <span className="text-[9px] text-zinc-600 font-medium">
                    {format(new Date(msg.createdAt), "HH:mm")}
                  </span>
                </div>
                <div
                  className={cn(
                    "p-3 rounded-2xl text-sm shadow-xl transition-all duration-300",
                    isMe
                      ? "bg-primary text-primary-foreground rounded-tr-none border-b-2 border-primary-foreground/20"
                      : "bg-zinc-900 text-zinc-100 rounded-tl-none border border-white/5 group-hover:border-primary/20",
                  )}
                >
                  {msg.content}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  }, [messages, currentUserId]);

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 border-r border-white/5 overflow-hidden">
      {/* Chat Header */}
      <header className="p-4 border-b border-white/10 bg-zinc-900/50 backdrop-blur-md flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2 rounded-xl">
            <Hash className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2 uppercase tracking-widest italic">
              {channelId ? `Group Node ${channelId}` : "Global Neural Uplink"}
              <Badge
                variant="outline"
                className="text-[9px] h-4 border-emerald-500/50 text-emerald-500 bg-emerald-500/5 px-1.5 uppercase tracking-tighter"
              >
                Live
              </Badge>
            </h2>
            <p className="text-[10px] text-zinc-500 font-medium tracking-tight">
              Synchronized with planetary grid.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <Search className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <User className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-zinc-400 hover:text-white hover:bg-white/5"
          >
            <MoreVertical className="w-4 h-4" />
          </Button>
        </div>
      </header>

      {/* Chat Messages */}
      <ScrollArea className="flex-1 bg-black">
        <div
          className="p-6 space-y-6 min-h-full flex flex-col justify-end"
          ref={scrollRef}
        >
          {loading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={cn(
                    "flex w-full gap-3",
                    i % 2 === 0 ? "flex-row-reverse" : "flex-row",
                  )}
                >
                  <Skeleton className="w-9 h-9 rounded-full bg-white/5 shrink-0" />
                  <div
                    className={cn(
                      "flex flex-col gap-2",
                      i % 2 === 0 ? "items-end" : "items-start",
                    )}
                  >
                    <Skeleton className="h-2 w-20 bg-white/5" />
                    <Skeleton
                      className={cn(
                        "h-10 rounded-2xl bg-white/5",
                        i % 2 === 0 ? "w-64" : "w-48",
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : messageList === null ? (
            <div className="flex flex-col items-center justify-center h-full text-zinc-600 space-y-4 py-20 grayscale opacity-20">
              <Hash className="w-16 h-16 stroke-[0.5]" />
              <p className="text-sm font-light uppercase tracking-widest italic">
                The channel is silent. First blood?
              </p>
            </div>
          ) : (
            messageList
          )}
        </div>
      </ScrollArea>

      {/* Chat Input */}
      <div className="p-4 bg-zinc-900/50 backdrop-blur-xl border-t border-white/10 relative overflow-hidden">
        {(loading || isSending) && (
          <div className="absolute top-0 left-0 h-0.5 bg-primary animate-pulse w-full" />
        )}

        <div className="flex items-center gap-2 max-w-5xl mx-auto">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-500 hover:text-white hover:bg-white/5 transition-colors"
            >
              <Paperclip className="w-4 h-4" />
            </Button>
            <Microphone onResult={handleMicResult} />
          </div>

          <div className="flex-1 relative">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter command or message..."
              className="h-10 border-white/10 bg-zinc-800/50 text-zinc-100 focus-visible:ring-primary focus-visible:ring-1 pr-10 rounded-xl"
              disabled={isSending}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-zinc-500 hover:text-primary hover:bg-transparent"
            >
              <Smile className="w-4 h-4" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            disabled={isSending || !inputValue.trim()}
            className="rounded-xl h-10 px-5 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95 bg-primary text-white font-black"
          >
            {isSending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
        <p className="text-[10px] text-zinc-600 text-center mt-3 font-black uppercase tracking-widest opacity-50 italic">
          Secure transmission active
        </p>
      </div>
    </div>
  );
}

export default Chat;
