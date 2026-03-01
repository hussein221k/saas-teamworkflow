"use client";

import React from "react";

interface DashboardErrorBoundaryProps {
  error?: Error;
  reset?: () => void;
}

export default function DashboardErrorBoundary({
  error,
  reset,
}: DashboardErrorBoundaryProps) {
  return (
    <div className="flex items-center justify-center w-full h-full bg-zinc-950">
      <div className="flex flex-col items-center gap-4 text-center max-w-md">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
          <span className="text-2xl text-red-500">⚠️</span>
        </div>
        <div>
          <h2 className="text-lg font-bold text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-zinc-400 text-sm mb-4">
            {error?.message || "An error occurred while loading the dashboard"}
          </p>
        </div>
        {reset && (
          <button
            onClick={reset}
            className="px-6 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium text-sm transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
