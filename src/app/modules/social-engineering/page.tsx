"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ArrowLeft, ShieldAlert, MessageCircle, User, AlertTriangle, Activity } from "lucide-react";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { socialEngineeringScenario, DialogueChoice } from "@/data/socialEngineeringData";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc/client";
import { useRouter } from "next/navigation";

export default function SocialEngineeringSimulation() {
  const [currentNodeId, setCurrentNodeId] = useState("start");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: socialEngineeringScenario.start.botMessage, time: new Date() }
  ]);
  const [suspicionLevel, setSuspicionLevel] = useState(50);
  const [detectedTactics, setDetectedTactics] = useState<string[]>([]);
  const [simulationStatus, setSimulationStatus] = useState<'active' | 'success' | 'failure'>('active');
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter();
  const completeModuleMutation = trpc.completeModule.useMutation();

  const currentNode = socialEngineeringScenario[currentNodeId];

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  const handleChoice = (choice: DialogueChoice) => {
    if (simulationStatus !== 'active') return;

    // Add user response to history
    setChatHistory(prev => [...prev, { sender: "user", text: choice.text, time: new Date() }]);

    // Update state based on choice
    const newSuspicion = Math.min(100, Math.max(0, suspicionLevel + choice.suspicionDelta));
    setSuspicionLevel(newSuspicion);

    if (choice.tacticsDetected) {
      setDetectedTactics(prev => [...new Set([...prev, ...choice.tacticsDetected!])]);
    }

    if (choice.isEnding) {
      setSimulationStatus(choice.isEnding);
      return;
    }

    // Process next bot message with slight delay for realism
    if (choice.nextNodeId) {
      const nextNode = socialEngineeringScenario[choice.nextNodeId];
      setCurrentNodeId(choice.nextNodeId);
      
      setTimeout(() => {
        setChatHistory(prev => [...prev, { sender: "bot", text: nextNode.botMessage, time: new Date() }]);
      }, 1000);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleComplete = () => {
    completeModuleMutation.mutate(
      { moduleId: "social-engineering", score: suspicionLevel },
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
        {simulationStatus !== 'active' && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-2xl text-center"
            >
              <Card glow={simulationStatus === 'success' ? 'green' : 'red'} className={`p-10 border flex flex-col items-center ${simulationStatus === 'success' ? 'border-green-500/50 shadow-[0_0_30px_rgba(34,197,94,0.15)]' : 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.15)]'}`}>
                <ShieldAlert className={`w-16 h-16 mb-6 ${simulationStatus === 'success' ? 'text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]' : 'text-red-500 animate-pulse drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]'}`} />
                <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-2">
                  {simulationStatus === 'success' ? 'Attack Thwarted' : 'System Compromised'}
                </h2>
                <p className={`font-mono mb-8 ${simulationStatus === 'success' ? 'text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]'}`}>
                  {simulationStatus === 'success' ? 'Social Engineering Defense Successful.' : 'MFA Token Surrendered.'}
                </p>
                
                <div className="w-full bg-[#020202] border border-white/10 rounded-lg p-6 mb-8 text-left shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
                  <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest border-b border-white/10 pb-2">Debriefing</h3>
                  <p className="text-foreground/80 mb-6 leading-relaxed">
                    {simulationStatus === 'success' 
                      ? "Excellent work. You correctly identified suspicious behavior and refused to bypass security protocols. The attacker was attempting to leverage the following psychological tactics:"
                      : "You fell victim to a social engineering attack. By surrendering your MFA token, the attacker now has full access to the corporate network. They manipulated you using the following tactics:"}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {detectedTactics.length > 0 ? (
                      detectedTactics.map(tactic => (
                        <span key={tactic} className="px-3 py-1.5 bg-white/5 border border-white/10 rounded text-accent font-mono text-xs uppercase shadow-sm">
                          {tactic}
                        </span>
                      ))
                    ) : (
                      <span className="text-foreground/50 italic text-sm font-mono">None identified before compromise.</span>
                    )}
                  </div>
                </div>

                <div className="w-full flex justify-between items-center mb-8 border border-white/10 bg-white/5 p-4 rounded-lg">
                  <span className="font-mono text-foreground/70 uppercase tracking-widest text-sm">Final Suspicion Score</span>
                  <span className={`font-mono font-bold text-xl ${suspicionLevel >= 70 ? 'text-green-500' : suspicionLevel <= 30 ? 'text-red-500' : 'text-yellow-500'}`}>
                    {suspicionLevel}/100
                  </span>
                </div>

                <Button 
                  variant="primary" 
                  className={`w-full h-14 text-lg tracking-widest uppercase border ${simulationStatus === 'success' ? 'border-green-500/50 hover:bg-green-500/20 text-green-400' : 'border-red-500/50 hover:bg-red-500/20 text-red-400'}`}
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
              <ShieldAlert className="w-6 h-6 text-accent" />
              Module: <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">Social Engineering</span>
            </h1>
            <p className="text-foreground/60 font-mono text-sm">Analyze the conversation and detect manipulative tactics.</p>
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* Left Column: Chat Interface (Takes 2 columns) */}
        <Card glow="cyan" className="lg:col-span-2 flex flex-col bg-[#050505] border-accent/20 overflow-hidden relative p-0">
          <div className="p-4 border-b border-white/10 bg-[#020202] flex items-center justify-between z-10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                <User className="w-4 h-4 text-white/70" />
              </div>
              <div>
                <span className="font-sans font-bold text-sm text-white flex items-center gap-2">
                  IT Support - David
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">Nexus Corporate CommLink</span>
              </div>
            </div>
            <MessageCircle className="w-5 h-5 text-accent/50" />
          </div>
          
          <div ref={chatContainerRef} className="flex-1 p-6 overflow-y-auto bg-slate-950 flex flex-col gap-4">
            
            {chatHistory.map((msg, idx) => (
              <div key={idx} className={`flex items-start gap-3 max-w-[80%] ${msg.sender === 'user' ? 'self-end flex-row-reverse' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border mt-1 ${
                  msg.sender === 'user' ? 'bg-accent/20 border-accent/30' : 'bg-slate-800 border-white/10'
                }`}>
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4 text-accent" />
                  ) : (
                    <span className="text-xs font-bold text-white">D</span>
                  )}
                </div>
                <div className={`p-4 rounded-2xl text-sm text-white leading-relaxed shadow-lg border ${
                  msg.sender === 'user' 
                    ? 'bg-accent/10 border-accent/20 rounded-tr-none' 
                    : 'bg-slate-800/80 border-slate-700/50 rounded-tl-none'
                }`}>
                  {msg.text}
                  <div className={`text-[10px] mt-2 font-mono ${msg.sender === 'user' ? 'text-accent/60 text-right' : 'text-slate-400'}`}>
                    {formatTime(msg.time)}
                  </div>
                </div>
              </div>
            ))}

            {/* Typing indicator (simulated) */}
            {chatHistory.length > 0 && chatHistory[chatHistory.length - 1].sender === 'user' && simulationStatus === 'active' && (
              <div className="flex items-start gap-3 max-w-[80%] opacity-50 animate-pulse">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center shrink-0 border border-white/10 mt-1">
                  <span className="text-xs font-bold text-white">D</span>
                </div>
                <div className="bg-slate-800/80 border border-slate-700/50 p-4 rounded-2xl rounded-tl-none text-sm text-white">
                  ...
                </div>
              </div>
            )}

          </div>

          {/* Response Selection Area */}
          <div className="p-4 bg-[#020202] border-t border-white/10">
            <h3 className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-3 flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${simulationStatus === 'active' ? 'bg-accent/50' : 'bg-slate-700'}`} />
              {simulationStatus === 'active' ? 'Select Response' : 'Simulation Concluded'}
            </h3>
            <div className="flex flex-col gap-2">
              {simulationStatus === 'active' ? (
                currentNode.choices.map((choice) => (
                  <Button 
                    key={choice.id}
                    variant="secondary" 
                    onClick={() => handleChoice(choice)}
                    className="justify-start h-auto py-3 px-4 text-left font-sans text-sm border-white/10 hover:border-accent/50 hover:bg-accent/5 transition-all"
                  >
                    "{choice.text}"
                  </Button>
                ))
              ) : (
                <div className="p-4 text-center font-mono text-sm text-foreground/50 bg-white/5 rounded border border-white/10">
                  {simulationStatus === 'success' 
                    ? "Target secured. Threat neutralized." 
                    : "Target compromised. Data lost."}
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Right Column: Suspicion Analyzer */}
        <Card glow="none" className="flex flex-col bg-[#050505] border-white/10 overflow-hidden relative p-0">
          <div className="p-4 border-b border-white/10 bg-[#020202] flex items-center gap-3">
            <Activity className="w-4 h-4 text-foreground/50" />
            <span className="font-mono text-xs uppercase tracking-widest text-foreground/50">Suspicion Analyzer</span>
          </div>

          <div className="p-6 flex flex-col gap-8 flex-1 bg-slate-950/50">
            {/* Target Profile */}
            <div>
              <h3 className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Sender Profile Analysis</h3>
              <div className="bg-black/40 border border-white/5 rounded p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Internal ID</span>
                  <span className="text-sm font-mono text-white">#IT-8492</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Department</span>
                  <span className="text-sm font-mono text-white">IT Infrastructure</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">Relationship</span>
                  <span className="text-sm font-mono text-yellow-500 bg-yellow-500/10 px-2 py-0.5 rounded">Unknown Contact</span>
                </div>
              </div>
            </div>

            {/* Suspicion Meter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-mono text-xs text-foreground/50 uppercase tracking-widest">Suspicion Level</h3>
                <span className={`font-mono text-xs font-bold ${
                  suspicionLevel > 70 ? 'text-green-500' : suspicionLevel < 30 ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {suspicionLevel}%
                </span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    suspicionLevel > 70 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' 
                    : suspicionLevel < 30 ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' 
                    : 'bg-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]'
                  }`}
                  style={{ width: `${suspicionLevel}%` }}
                />
              </div>
            </div>

            {/* Identified Tactics */}
            <div className="flex-1">
              <h3 className="font-mono text-xs text-foreground/50 uppercase tracking-widest mb-3 border-b border-white/10 pb-2">Identified Tactics</h3>
              <div className="space-y-3">
                {detectedTactics.length === 0 ? (
                  <div className="text-sm font-mono text-foreground/40 italic">Awaiting threat intelligence...</div>
                ) : (
                  detectedTactics.map((tactic, idx) => (
                    <div key={idx} className="bg-red-500/10 border border-red-500/20 p-3 rounded flex items-start gap-3 animate-in fade-in slide-in-from-right-4 duration-500">
                      <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">{tactic}</div>
                        <div className="text-xs text-red-200/70 leading-relaxed">
                          {tactic === 'Urgency' && "Sender is creating artificial time pressure to force quick, unthinking action."}
                          {tactic === 'Authority' && "Sender is leveraging an executive figure to bypass standard verification protocols."}
                          {tactic === 'Guilt Tripping' && "Sender is attempting to make the victim feel responsible for potential negative outcomes."}
                          {tactic === 'Intimidation' && "Sender is using threats of disciplinary action to force compliance."}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>
        </Card>

      </div>
    </div>
  );
}
