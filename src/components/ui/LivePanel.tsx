"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LogEntry {
  id: string;
  message: string;
  type?: "info" | "error" | "success" | "warning";
  timestamp?: Date;
}

interface LivePanelProps extends React.HTMLAttributes<HTMLDivElement> {
  logs: LogEntry[];
}

export function LivePanel({ logs, className = "", ...props }: LivePanelProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const getColorForType = (type?: string) => {
    switch (type) {
      case "error":
        return "text-red-500 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]";
      case "success":
        return "text-green-400 drop-shadow-[0_0_5px_rgba(74,222,128,0.8)]";
      case "warning":
        return "text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]";
      case "info":
      default:
        return "text-accent drop-shadow-[0_0_5px_rgba(0,240,255,0.6)]";
    }
  };

  return (
    <div
      className={`relative overflow-hidden bg-[#020202] border border-accent/20 rounded shadow-[inset_0_0_30px_rgba(0,240,255,0.05)] font-mono text-sm sm:text-base ${className}`}
      {...props}
    >
      {/* Animated Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0, 240, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.4) 1px, transparent 1px)",
          backgroundSize: "20px 20px",
          backgroundPosition: "center center",
        }}
      />

      {/* CRT Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] opacity-30 z-10" />

      {/* Soft Vignette */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(0,0,0,0.8)] z-10" />

      {/* Logs Container */}
      <div className="relative z-20 h-full p-4 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-accent/20 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-accent/50">
        <div className="flex flex-col gap-1.5 pb-2">
          {logs.length === 0 && (
            <div className="text-accent/40 italic">Waiting for incoming telemetry...</div>
          )}
          <AnimatePresence initial={false}>
            {logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`flex gap-3 ${getColorForType(log.type)}`}
              >
                {log.timestamp && (
                  <span className="opacity-50 shrink-0">
                    [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                  </span>
                )}
                <span className="break-words whitespace-pre-wrap">{log.message}</span>
              </motion.div>
            ))}
          </AnimatePresence>
          {/* Dummy element to anchor the scroll */}
          <div ref={bottomRef} className="h-1 shrink-0" />
        </div>
      </div>
    </div>
  );
}
