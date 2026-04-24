"use client";

import { Card } from "@/components/ui/Card";
import { Shield, Zap, Award, Activity, CheckCircle2, AlertTriangle, Loader2, WifiOff } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { getSocket } from "@/lib/socket";
import { useState, useEffect } from "react";

export default function DashboardPage() {
  const { data: stats, isLoading, error } = trpc.getUserStats.useQuery();
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = getSocket();
    
    // Initial state
    setIsConnected(socket.connected);

    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-center gap-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <div>
          <h2 className="text-xl font-bold text-white font-heading">Failed to Load Telemetry</h2>
          <p className="text-foreground/60 font-mono text-sm">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const xpPercentage = Math.round((stats.progressToNextLevel / 100) * 100);
  const nextLevelXp = stats.level * 100;
  
  // Calculate a mock accuracy based on level (just for visual flair since we don't have failed attempts stored yet)
  const accuracy = Math.min(100, 80 + (stats.level * 2)) + "%";

  return (
    <div className="h-full flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-2">
        <div>
          <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-widest">
            Dashboard <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">Overview</span>
          </h1>
          <p className="text-foreground/60 font-mono text-sm mt-1">
            System telemetry and operative statistics.
          </p>
        </div>
        
        {isConnected ? (
          <div className="mt-4 md:mt-0 px-4 py-2 bg-accent/10 border border-accent/30 rounded font-mono text-sm text-accent flex items-center gap-2 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
            <Activity className="w-4 h-4 animate-pulse" />
            Live Connection
          </div>
        ) : (
          <div className="mt-4 md:mt-0 px-4 py-2 bg-red-500/10 border border-red-500/30 rounded font-mono text-sm text-red-500 flex items-center gap-2 shadow-[0_0_10px_rgba(239,68,68,0.1)]">
            <WifiOff className="w-4 h-4" />
            Disconnected
          </div>
        )}
      </div>

      {/* Top Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level & XP Card */}
        <Card glow="cyan" className="col-span-1 md:col-span-2">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg bg-[#020202] border border-accent/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
                <Shield className="w-7 h-7 text-accent" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white font-heading uppercase tracking-wider">Level {stats.level}</h2>
                <p className="text-accent text-sm font-mono">Cyber Operative</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-white font-mono">{stats.totalXp} <span className="text-sm text-foreground/50 font-sans font-normal">/ {nextLevelXp} XP</span></p>
            </div>
          </div>
          
          <div className="w-full bg-[#020202] rounded-full h-4 mb-2 border border-accent/20 overflow-hidden relative shadow-[inset_0_0_5px_rgba(0,0,0,0.8)]">
            <div 
              className="bg-accent h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(0,240,255,0.8)] relative"
              style={{ width: `${xpPercentage}%` }}
            />
          </div>
          <p className="text-right text-xs text-foreground/50 font-mono">{xpPercentage}% to Next Level</p>
        </Card>

        {/* Quick Stats Card */}
        <Card glow="purple" className="flex flex-col justify-center">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 rounded-lg bg-[#020202] border border-accent-alt/20 shadow-[inset_0_0_10px_rgba(122,95,255,0.05)]">
              <Zap className="w-6 h-6 text-accent-alt mx-auto mb-3" />
              <p className="text-3xl font-bold text-white font-mono">{stats.completedModulesCount}</p>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mt-1">Modules</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-[#020202] border border-accent-alt/20 shadow-[inset_0_0_10px_rgba(122,95,255,0.05)]">
              <Award className="w-6 h-6 text-accent-alt mx-auto mb-3" />
              <p className="text-3xl font-bold text-white font-mono">{accuracy}</p>
              <p className="text-xs text-foreground/50 uppercase tracking-wider mt-1">Accuracy</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Badges Section */}
      <div className="mt-4 flex-1">
        <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent-alt" />
          Badges & <span className="text-accent-alt">Achievements</span>
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.badges.map((badge: any) => (
            <Card key={badge.id} glow="cyan" className="text-center p-6 flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <Shield className="w-8 h-8 text-accent drop-shadow-[0_0_5px_rgba(0,240,255,1)]" />
              </div>
              <h4 className="font-bold text-white uppercase tracking-widest text-sm">{badge.name}</h4>
              <p className="text-xs text-foreground/60 mt-2 font-mono leading-relaxed">{badge.description}</p>
            </Card>
          ))}

          {stats.badges.length === 0 && (
            <div className="col-span-full p-8 text-center border border-dashed border-white/20 rounded-xl bg-white/5">
              <p className="text-foreground/50 font-mono text-sm uppercase tracking-widest">No badges earned yet. Complete modules to unlock achievements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
