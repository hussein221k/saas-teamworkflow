"use client";

import React, { Suspense } from "react";
import Ai from "@/components/dashboard/Ai";
import DashboardLoading from "./DashboardLoading";

export default function AiSection() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <Ai />
    </Suspense>
  );
}
