"use client";

import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-zinc-950">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest">
          Synchronizing neural interface...
        </p>
      </div>
    </div>
  );
}
