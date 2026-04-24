"use client";

import { Card } from "@/components/ui/Card";
import { User, Shield, Award } from "lucide-react";
import { trpc } from "@/lib/trpc/client";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: stats } = trpc.getUserStats.useQuery();
  const { data: session } = useSession();

  const operativeName = session?.user?.name || session?.user?.email?.split('@')[0] || "Guest Operative";

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 max-w-[1200px] mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded bg-[#020202] border border-accent-alt/50 flex items-center justify-center shadow-[0_0_15px_rgba(122,95,255,0.2)]">
          <User className="w-5 h-5 text-accent-alt" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-widest">
            Operative <span className="text-accent-alt drop-shadow-[0_0_10px_rgba(122,95,255,0.6)]">Profile</span>
          </h1>
          <p className="text-foreground/60 font-mono text-sm">Personnel dossier and statistics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card glow="purple" className="col-span-1 md:col-span-2 p-8 flex items-center gap-8 bg-[#050505]">
          <div className="w-32 h-32 rounded-full bg-[#020202] border-2 border-accent-alt/50 flex items-center justify-center shadow-[0_0_30px_rgba(122,95,255,0.2)]">
            <User className="w-16 h-16 text-accent-alt" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white font-heading uppercase tracking-widest mb-1">{stats?.fullName || operativeName}</h2>
            <p className="text-accent-alt/70 font-mono text-sm mb-2 uppercase tracking-widest">ID: {operativeName}</p>
            <p className="text-accent-alt font-mono mb-4">Level {stats?.level || 1} Cyber Specialist</p>
            
            <div className="flex gap-6">
              <div>
                <p className="text-xs text-foreground/50 font-mono uppercase tracking-widest">Total XP</p>
                <p className="text-xl font-bold text-white font-mono">{stats?.totalXp || 0}</p>
              </div>
              <div>
                <p className="text-xs text-foreground/50 font-mono uppercase tracking-widest">Modules Completed</p>
                <p className="text-xl font-bold text-white font-mono">{stats?.completedModulesCount || 0}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card glow="none" className="col-span-1 flex flex-col justify-center items-center p-8 bg-[#050505]">
          <Shield className="w-12 h-12 text-accent/50 mb-4" />
          <h3 className="text-xl font-bold text-white font-heading uppercase tracking-widest text-center">Security Clearance</h3>
          <p className="text-accent font-mono text-center mt-2 px-4 py-1 bg-accent/10 border border-accent/20 rounded">
            Level {stats?.level || 1} Access
          </p>
        </Card>

        <Card glow="cyan" className="col-span-1 md:col-span-3 p-8 bg-[#050505]">
          <h3 className="text-xl font-bold text-white font-heading uppercase tracking-widest mb-6 border-b border-white/10 pb-4">Classified Personnel Dossier</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 font-mono">
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-widest mb-2">Full Legal Name</p>
              <div className="bg-[#020202] border border-white/10 p-3 rounded text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                {stats?.fullName || "REDACTED"}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-widest mb-2">Date of Birth</p>
              <div className="bg-[#020202] border border-white/10 p-3 rounded text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                {stats?.dateOfBirth || "REDACTED"}
              </div>
            </div>

            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-widest mb-2">Operative ID</p>
              <div className="bg-[#020202] border border-white/10 p-3 rounded text-white shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                {operativeName}
              </div>
            </div>

            <div>
              <p className="text-xs text-foreground/50 uppercase tracking-widest mb-2">Service Status</p>
              <div className="bg-[#020202] border border-green-500/30 p-3 rounded text-green-400 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Active Duty
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
