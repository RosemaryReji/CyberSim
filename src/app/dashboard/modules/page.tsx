"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Mail, Key, Code, Lock, PlayCircle, CheckCircle2, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc/client";

export default function ModulesPage() {
  const { data: stats } = trpc.getUserStats.useQuery();

  const baseModules = [
    {
      id: "phishing",
      title: "Phishing",
      description: "Analyze email headers, identify malicious links, and protect the grid from targeted attacks.",
      icon: Mail,
      glow: "cyan" as const,
      difficulty: "Beginner",
      path: "/dashboard/modules/phishing"
    },
    {
      id: "bruteforce",
      title: "Brute Force",
      description: "Execute a simulated dictionary attack against a target authentication system and learn defense mechanisms.",
      icon: Key,
      glow: "purple" as const,
      difficulty: "Intermediate",
      path: "/dashboard/modules/bruteforce"
    },
    {
      id: "xss",
      title: "XSS Injection",
      description: "Inject and detect malicious cross-site scripts in a simulated web application environment.",
      icon: Code,
      glow: "purple" as const,
      difficulty: "Advanced",
      path: "/dashboard/modules/xss"
    },
    {
      id: "social-engineering",
      title: "Social Engineering",
      description: "Engage in dialogue with a simulated threat actor to identify manipulative psychological tactics.",
      icon: MessageSquare,
      glow: "cyan" as const,
      difficulty: "Expert",
      path: "/dashboard/modules/social-engineering"
    }
  ];

  const completedModules = stats?.completedModules || [];

  const modules = baseModules.map((mod, index) => {
    let status = "locked";
    
    if (completedModules.includes(mod.id)) {
      status = "completed";
    } else if (index === 0 || completedModules.includes(baseModules[index - 1].id)) {
      status = "unlocked";
    }

    // Temporary override to unlock everything for testing purposes if stats aren't loaded yet
    if (!stats) status = index === 0 ? "unlocked" : "locked";

    return { ...mod, status };
  });

  return (
    <div className="h-full flex flex-col">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-widest">
          Simulation <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">Grid</span>
        </h1>
        <p className="text-foreground/60 font-mono text-sm mt-1">
          Select an available combat scenario to initialize training.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {modules.map((mod) => {
          const Icon = mod.icon;
          const isLocked = mod.status === "locked";
          const isCompleted = mod.status === "completed";

          return (
            <Card key={mod.id} glow={isLocked ? "none" : mod.glow} className={`flex flex-col h-full ${isLocked ? 'opacity-70' : ''}`}>
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-lg bg-[#020202] border flex items-center justify-center ${
                  isLocked 
                    ? 'border-white/10 text-white/40' 
                    : mod.glow === 'cyan' 
                      ? 'border-accent/50 text-accent shadow-[0_0_15px_rgba(0,240,255,0.2)]' 
                      : 'border-accent-alt/50 text-accent-alt shadow-[0_0_15px_rgba(122,95,255,0.2)]'
                }`}>
                  <Icon className="w-7 h-7" />
                </div>
                
                {isLocked ? (
                  <div className="px-3 py-1.5 rounded bg-[#020202] border border-white/10 flex items-center gap-2">
                    <Lock className="w-3 h-3 text-white/40" />
                    <span className="text-xs font-mono text-white/40 uppercase tracking-widest">Locked</span>
                  </div>
                ) : isCompleted ? (
                  <div className="px-3 py-1.5 rounded bg-accent/10 border border-accent/30 flex items-center gap-2">
                    <CheckCircle2 className="w-3 h-3 text-accent" />
                    <span className="text-xs font-mono text-accent uppercase tracking-widest">Cleared</span>
                  </div>
                ) : (
                  <div className="px-3 py-1.5 rounded bg-accent/5 border border-accent/30 flex items-center gap-2 shadow-[0_0_10px_rgba(0,240,255,0.1)]">
                    <PlayCircle className="w-3 h-3 text-accent animate-pulse" />
                    <span className="text-xs font-mono text-accent uppercase tracking-widest">Active</span>
                  </div>
                )}
              </div>

              <h2 className="text-2xl font-bold text-white font-heading tracking-wider mb-3 uppercase">{mod.title}</h2>
              <div className="flex gap-2 mb-4">
                <span className={`text-[10px] font-mono uppercase px-2.5 py-1 rounded border tracking-widest ${
                  mod.difficulty === 'Beginner' ? 'border-green-500/30 text-green-400 bg-green-500/5' :
                  mod.difficulty === 'Intermediate' ? 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5' :
                  mod.difficulty === 'Advanced' ? 'border-orange-500/30 text-orange-400 bg-orange-500/5' :
                  'border-red-500/30 text-red-400 bg-red-500/5'
                }`}>
                  {mod.difficulty}
                </span>
              </div>
              
              <p className="text-foreground/70 text-sm font-sans leading-relaxed flex-grow mb-8">
                {mod.description}
              </p>

              <div className="mt-auto">
                {isLocked ? (
                  <Button variant="ghost" className="w-full border-white/10 text-white/30 hover:text-white/30 cursor-not-allowed bg-black/50" disabled>
                    Insufficient Clearance
                  </Button>
                ) : (
                  <Link href={mod.path} className="block w-full">
                    <Button variant={mod.glow === 'cyan' ? 'primary' : 'secondary'} className="w-full">
                      {isCompleted ? "Replay Module" : "Initialize Module"}
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
