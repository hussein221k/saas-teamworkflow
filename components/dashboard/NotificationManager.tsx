"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export function NotificationManager() {
  useEffect(() => {
    const requestPermission = async () => {
      if (!("Notification" in window)) {
        console.warn("This browser does not support desktop notification");
        return;
      }

      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification("Neural Uplink Established", {
            body: "You are now connected to the Team Work Flow network.",
            icon: "/favicon.ico"
          });
        }
      }
    };

    requestPermission();
  }, []);

  return null;
}

export function sendLocalNotification(title: string, body: string) {
  if (typeof window !== "undefined" && Notification.permission === "granted") {
    new Notification(title, { body, icon: "/favicon.ico" });
  } else {
      toast(title, { description: body });
  }
}
