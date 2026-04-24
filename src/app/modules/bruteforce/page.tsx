"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShieldAlert, Terminal, Lock, Server, Database, Play } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { getSocket } from "@/lib/socket";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function BruteForceSimulation() {
  const router = useRouter();
  const completeModuleMutation = trpc.completeModule.useMutation();
  const [showSuccess, setShowSuccess] = useState(false);
  const [targetUsername] = useState("admin");
  const [wordlist, setWordlist] = useState("common");
  const [threads, setThreads] = useState(16);
  const [isAttacking, setIsAttacking] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [crackedPassword, setCrackedPassword] = useState<string | null>(null);
  const logsEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  useEffect(() => {
    const socket = getSocket();

    const handleLog = (msg: string) => {
      setLogs((prev) => [...prev, msg]);
    };

    const handleEnd = (result: { success: boolean, password?: string }) => {
      setIsAttacking(false);
      if (result.success && result.password) {
        setCrackedPassword(result.password);
      }
    };

    socket.on("bruteforce-log", handleLog);
    socket.on("bruteforce-end", handleEnd);

    return () => {
      socket.off("bruteforce-log", handleLog);
      socket.off("bruteforce-end", handleEnd);
    };
  }, []);

  const handleStartAttack = () => {
    setIsAttacking(true);
    setCrackedPassword(null);
    setLogs([
      "Hydra v9.5 (c) 2023 by van Hauser/THC",
      `Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at ${new Date().toISOString()}`,
      `[DATA] max ${threads} tasks per 1 server, overall ${threads} tasks`,
      `[DATA] wordlist selected: ${wordlist}`,
      "[DATA] attacking https-post-form://192.168.1.105:443/login",
      "Initializing connection to target...",
      "> Awaiting datastream..."
    ]);

    const socket = getSocket();
    socket.emit("start-bruteforce", { wordlist, threads, targetUsername });
  };

  const handleAccess = () => {
    setShowSuccess(true);
  };

  const handleComplete = () => {
    completeModuleMutation.mutate(
      { moduleId: "bruteforce", score: 100 },
      {
        onSuccess: () => {
          router.push("/dashboard/modules");
        }
      }
    );
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 max-w-[1500px] mx-auto relative">
      
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl"
            >
              <Card glow="green" className="p-8 border-green-500/50 flex flex-col items-center">
                <ShieldAlert className="w-16 h-16 text-green-500 mb-6 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-2">Mainframe Compromised</h2>
                <p className="text-green-400 font-mono mb-8 text-center uppercase tracking-widest drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]">Authentication Bypass Successful</p>
                
                <div className="w-full bg-[#020202] border border-white/10 rounded-lg p-6 mb-8 shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                  <h3 className="text-lg font-bold text-white mb-5 uppercase tracking-widest border-b border-white/10 pb-3">Vulnerability Analysis</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-red-400 font-mono text-sm uppercase mb-2">1. Weak Password Policy</h4>
                      <p className="text-foreground/70 text-sm leading-relaxed">
                        The target used a common password ("<span className="text-accent font-bold">{crackedPassword}</span>") found in standard dictionaries like rockyou.txt. 
                        <span className="text-white block mt-1"><span className="text-green-400 font-mono text-xs uppercase">Defense:</span> Enforce complex passwords and check them against known breached databases.</span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-red-400 font-mono text-sm uppercase mb-2">2. No Rate Limiting</h4>
                      <p className="text-foreground/70 text-sm leading-relaxed">
                        The server allowed {threads} concurrent connections making hundreds of requests per second without blocking the attacker's IP.
                        <span className="text-white block mt-1"><span className="text-green-400 font-mono text-xs uppercase">Defense:</span> Implement strict rate limiting (e.g., 5 attempts/min), progressive delays, and temporary IP banning.</span>
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-red-400 font-mono text-sm uppercase mb-2">3. Lack of MFA</h4>
                      <p className="text-foreground/70 text-sm leading-relaxed">
                        Authentication relied solely on a single factor (knowledge of the password). 
                        <span className="text-white block mt-1"><span className="text-green-400 font-mono text-xs uppercase">Defense:</span> Require a second factor (Authenticator App, SMS, Hardware Token) to render stolen passwords useless.</span>
                      </p>
                    </div>
                  </div>
                </div>

                <Button 
                  variant="primary" 
                  className="w-full h-14 text-lg tracking-widest uppercase border-green-500/50 hover:bg-green-500/20 text-green-400"
                  onClick={handleComplete}
                  disabled={completeModuleMutation.isPending}
                >
                  {completeModuleMutation.isPending ? "Syncing Grid..." : "Acknowledge & Complete Module"}
                </Button>
              </Card>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/modules">
            <Button variant="ghost" className="px-3 border-white/10 hover:bg-white/5">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Abort
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-widest flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-accent-alt" />
              Module: <span className="text-accent-alt drop-shadow-[0_0_10px_rgba(122,95,255,0.6)]">Auth Bypass</span>
            </h1>
            <p className="text-foreground/60 font-mono text-sm">Execute dictionary attack against target mainframe.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
        
        {/* Left Column: Target System */}
        <Card glow="none" className="flex flex-col bg-[#050505] border-white/10 overflow-hidden relative p-0">
          <div className="p-4 border-b border-white/10 bg-[#020202] flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <Server className="w-4 h-4 text-foreground/50" />
              <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">Target Environment: 192.168.1.105</span>
            </div>
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
            </div>
          </div>
          
          <div className="flex-1 flex items-center justify-center relative overflow-hidden bg-slate-950">
            {/* Target UI Background Grid */}
            <div 
              className="absolute inset-0 opacity-10 pointer-events-none mix-blend-screen"
              style={{ backgroundImage: 'linear-gradient(rgba(100, 116, 139, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
            />
            
            {/* Mock Login Form */}
            <div className="relative w-full max-w-sm p-10 bg-slate-900 border border-slate-700/50 rounded-xl shadow-2xl z-10">
              <div className="text-center mb-8">
                <Database className="w-14 h-14 text-slate-400 mx-auto mb-4" />
                <h2 className="text-2xl font-sans font-bold text-white tracking-wide">NEXUS Financial</h2>
                <p className="text-xs text-slate-400 mt-2 uppercase tracking-widest font-mono">Authorized Personnel Only</p>
              </div>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Username</label>
                  <input 
                    type="text" 
                    value={targetUsername}
                    readOnly
                    className="w-full bg-slate-800/50 border border-slate-600 rounded px-4 py-3 text-white outline-none font-mono selection:bg-slate-700"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      value={crackedPassword || ""}
                      placeholder="••••••••"
                      readOnly
                      className={`w-full bg-slate-800/50 border rounded px-4 py-3 outline-none font-mono placeholder:text-slate-600 transition-colors ${crackedPassword ? 'text-green-400 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'text-white border-slate-600'}`}
                    />
                    <Lock className={`w-4 h-4 absolute right-4 top-1/2 -translate-y-1/2 ${crackedPassword ? 'text-green-500' : 'text-slate-500'}`} />
                  </div>
                </div>
                <button 
                  disabled={!crackedPassword} 
                  onClick={handleAccess}
                  className={`w-full font-semibold py-3.5 rounded transition-all mt-6 ${crackedPassword ? 'bg-green-600 hover:bg-green-500 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' : 'bg-slate-700 text-white opacity-50 cursor-not-allowed'}`}
                >
                  Access Secure Node
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Right Column: Attacker Terminal */}
        <Card glow="purple" className="flex flex-col bg-[#020202] border-accent-alt/30 overflow-hidden relative p-0">
          <div className="p-4 border-b border-accent-alt/20 bg-[#050505] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="w-5 h-5 text-accent-alt" />
              <span className="font-mono text-sm uppercase tracking-widest text-accent-alt font-bold drop-shadow-[0_0_5px_rgba(122,95,255,0.4)]">Hydra v9.5 Attack Node</span>
            </div>
          </div>

          {/* Configuration Panel */}
          <div className="p-6 border-b border-white/5 bg-[#030303]">
            <h3 className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-5 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-accent-alt/50" />
              Attack Configuration
            </h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2 tracking-widest">Target IP / Port</label>
                <div className="font-mono text-sm text-white bg-black p-2.5 rounded border border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">192.168.1.105:443</div>
              </div>
              <div>
                <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2 tracking-widest">Target User</label>
                <div className="font-mono text-sm text-white bg-black p-2.5 rounded border border-white/10 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">admin</div>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2 tracking-widest">Wordlist</label>
                <select 
                  value={wordlist}
                  onChange={(e) => setWordlist(e.target.value)}
                  disabled={isAttacking}
                  className="w-full font-mono text-sm text-white bg-black p-2.5 rounded border border-white/10 outline-none focus:border-accent-alt/50 appearance-none cursor-pointer shadow-[inset_0_0_10px_rgba(0,0,0,0.5)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="common">rockyou_common.txt (1,000 passwords)</option>
                  <option value="full">rockyou_full.txt (14,344,392 passwords)</option>
                  <option value="custom">custom_targeted.txt (500 passwords)</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] font-mono text-foreground/40 uppercase mb-2 tracking-widest">Concurrent Threads</label>
                <div className="flex items-center gap-4 bg-black p-2.5 rounded border border-white/10">
                  <input 
                    type="range" 
                    min="1" 
                    max="64" 
                    value={threads}
                    onChange={(e) => setThreads(parseInt(e.target.value))}
                    disabled={isAttacking}
                    className="flex-1 accent-accent-alt cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" 
                  />
                  <span className="font-mono text-sm text-accent-alt font-bold w-6 text-right drop-shadow-[0_0_5px_rgba(122,95,255,0.4)]">{threads}</span>
                </div>
              </div>
            </div>

            <Button 
              variant="secondary" 
              onClick={handleStartAttack}
              disabled={isAttacking}
              className="w-full mt-6 h-12 flex items-center justify-center gap-3 border-accent-alt/50 text-accent-alt hover:bg-accent-alt/10 hover:shadow-[0_0_15px_rgba(122,95,255,0.2)] transition-all uppercase tracking-widest font-mono disabled:opacity-50"
            >
              <Play className="w-4 h-4 fill-current" />
              {isAttacking ? "Attack Sequence Initiated..." : "Initialize Attack Sequence"}
            </Button>
          </div>

          {/* Terminal Output */}
          <div className="flex-1 p-6 overflow-y-auto bg-black font-mono text-sm leading-relaxed text-foreground/70 selection:bg-accent-alt selection:text-black">
            <div className="opacity-60 space-y-1">
              {!isAttacking ? (
                <>
                  <p>Hydra v9.5 (c) 2023 by van Hauser/THC</p>
                  <p>Hydra (https://github.com/vanhauser-thc/thc-hydra) starting at 2026-04-24 10:00:00</p>
                  <p>[DATA] max 16 tasks per 1 server, overall 16 tasks, 1000 login tries (l:1/p:1000), ~63 tries per task</p>
                  <p>[DATA] attacking https-post-form://192.168.1.105:443/login</p>
                  <br/>
                  <p className="text-yellow-500/80 animate-pulse drop-shadow-[0_0_5px_rgba(234,179,8,0.5)]">&gt; Awaiting attack initialization...</p>
                </>
              ) : (
                <>
                  {logs.map((log, i) => (
                    <p key={i} className={log.includes("SUCCESS") ? "text-green-500 font-bold drop-shadow-[0_0_5px_rgba(34,197,94,0.5)]" : log.includes("ERROR") ? "text-red-500 font-bold" : ""}>
                      {log}
                    </p>
                  ))}
                  <div ref={logsEndRef} />
                </>
              )}
            </div>
          </div>
        </Card>

      </div>
    </div>
  );
}
