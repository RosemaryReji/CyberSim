"use client";

import { Card } from "@/components/ui/Card";
import { Terminal as TerminalIcon } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { TerminalInput } from "@/components/ui/TerminalInput";

export default function GlobalTerminalPage() {
  const [logs, setLogs] = useState<string[]>([
    "Welcome to CyberSim Global Terminal v1.0.0",
    "Type 'help' to see available commands."
  ]);
  const [inputValue, setInputValue] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const handleCommandSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const cmd = inputValue.trim().toLowerCase();
    const newLogs = [...logs, `root@cybersim:~$ ${inputValue}`];

    switch (cmd) {
      case "help":
        newLogs.push("Available commands: help, whoami, date, clear, ping, sudo");
        break;
      case "whoami":
        newLogs.push("root - Guest Operative");
        break;
      case "date":
        newLogs.push(new Date().toString());
        break;
      case "clear":
        setLogs([]);
        setInputValue("");
        return;
      case "ping":
        newLogs.push("PONG. Connection to mainframe established.");
        break;
      case "sudo":
        newLogs.push("Nice try. This incident will be reported.");
        break;
      default:
        newLogs.push(`Command not found: ${cmd}`);
    }

    setLogs(newLogs);
    setInputValue("");
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded bg-[#020202] border border-accent/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <TerminalIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-widest">
            Global <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">Terminal</span>
          </h1>
          <p className="text-foreground/60 font-mono text-sm">Central command interface.</p>
        </div>
      </div>

      <Card glow="cyan" className="flex-1 bg-[#050505] border-accent/20 flex flex-col p-0 overflow-hidden shadow-[0_0_30px_rgba(0,240,255,0.05)]">
        <div className="p-4 border-b border-white/10 bg-[#020202] flex items-center gap-3">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
          </div>
          <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">root@cybersim:~</span>
        </div>
        
        <div className="flex-1 p-6 font-mono text-sm text-accent/80 overflow-y-auto" onClick={() => document.getElementById('terminal-input')?.focus()}>
          {logs.map((log, idx) => (
            <div key={idx} className={`mb-1 ${log.startsWith('root@cybersim') ? 'text-white' : ''}`}>
              {log}
            </div>
          ))}
          
          <form onSubmit={handleCommandSubmit} className="flex items-center gap-2 mt-2">
            <span className="text-green-500">root@cybersim:~$</span>
            <input
              id="terminal-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-white font-mono placeholder:text-foreground/20"
              autoComplete="off"
              autoFocus
            />
          </form>
          <div ref={bottomRef} />
        </div>
      </Card>
    </div>
  );
}
