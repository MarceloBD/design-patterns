"use client";

import { useState, useEffect, useCallback } from "react";
import { BoltIcon, TrophyIcon, SparklesIcon } from "@/components/icons";

interface Notification {
  id: string;
  message: string;
  type: "xp" | "badge" | "level-up";
}

let addNotificationFn: ((notification: Omit<Notification, "id">) => void) | null = null;

export function triggerNotification(message: string, type: Notification["type"]) {
  addNotificationFn?.({ message, type });
}

const TYPE_CONFIG: Record<Notification["type"], { gradient: string; textColor: string }> = {
  xp: { gradient: "from-[var(--accent-green)] via-[var(--border-default)] to-[var(--accent-green)]", textColor: "text-[var(--accent-green)]" },
  badge: { gradient: "from-[var(--accent-blue)] via-[var(--border-default)] to-[var(--accent-teal)]", textColor: "text-[var(--accent-blue)]" },
  "level-up": { gradient: "from-[var(--accent-teal)] via-[var(--accent-blue)] to-[var(--accent-teal-light)]", textColor: "text-[var(--accent-teal-light)]" },
};

export function XpNotification() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((notification: Omit<Notification, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setNotifications((previous) => [...previous, { ...notification, id }]);

    setTimeout(() => {
      setNotifications((previous) => previous.filter((n) => n.id !== id));
    }, 3500);
  }, []);

  useEffect(() => {
    addNotificationFn = addNotification;
    return () => { addNotificationFn = null; };
  }, [addNotification]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-[90] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notification) => {
        const config = TYPE_CONFIG[notification.type];
        return (
          <div
            key={notification.id}
            className={`rounded-lg p-[1px] bg-gradient-to-r ${config.gradient} animate-xp-gain pointer-events-auto`}
          >
            <div className="rounded-[7px] bg-[var(--surface-raised)] px-4 py-2.5 flex items-center gap-2.5">
              {notification.type === "xp" && <BoltIcon size={13} className="text-[var(--accent-green)]" />}
              {notification.type === "badge" && <TrophyIcon size={13} className="text-[var(--accent-blue)]" />}
              {notification.type === "level-up" && <SparklesIcon size={13} className="text-[var(--accent-teal-light)]" />}
              <span className={`text-[11px] font-bold ${config.textColor}`}>
                {notification.message}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
