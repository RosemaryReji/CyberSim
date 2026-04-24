"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, Inbox, AlertTriangle, Send, Trash2, ArrowLeft, ShieldAlert, CheckCircle, XCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { phishingEmails } from "@/data/phishingEmails";
import { motion, AnimatePresence } from "framer-motion";
import { trpc } from "@/lib/trpc/client";

export default function PhishingSimulation() {
  const router = useRouter();
  const completeModuleMutation = trpc.completeModule.useMutation();
  const [selectedEmailId, setSelectedEmailId] = useState<number | null>(phishingEmails[0].id);
  const [classifications, setClassifications] = useState<Record<number, "safe" | "phishing">>({});
  const [showFinalScore, setShowFinalScore] = useState(false);
  const [feedbackModal, setFeedbackModal] = useState<{
    isOpen: boolean;
    isCorrect: boolean;
    explanation: string;
  } | null>(null);

  const selectedEmail = phishingEmails.find(e => e.id === selectedEmailId);

  const handleClassify = (choice: "safe" | "phishing") => {
    if (!selectedEmail || classifications[selectedEmail.id]) return;

    const isCorrect = 
      (choice === "phishing" && selectedEmail.isPhishing) || 
      (choice === "safe" && !selectedEmail.isPhishing);

    setClassifications(prev => ({ ...prev, [selectedEmail.id]: choice }));
    
    setFeedbackModal({
      isOpen: true,
      isCorrect,
      explanation: selectedEmail.explanation
    });
  };

  const handleNextEmail = () => {
    setFeedbackModal(null);
    
    if (allClassified) {
      setShowFinalScore(true);
      return;
    }

    const nextEmail = phishingEmails.find(e => !classifications[e.id] && e.id !== selectedEmailId);
    if (nextEmail) {
      setSelectedEmailId(nextEmail.id);
    }
  };

  const handleFinishModule = () => {
    completeModuleMutation.mutate(
      { moduleId: "phishing", score: correctCount },
      {
        onSuccess: () => {
          router.push("/dashboard/modules");
        }
      }
    );
  };

  const correctCount = Object.keys(classifications).filter(
    id => {
      const email = phishingEmails.find(e => e.id === Number(id));
      const choice = classifications[Number(id)];
      return (choice === "phishing" && email?.isPhishing) || (choice === "safe" && !email?.isPhishing);
    }
  ).length;

  const totalEmails = phishingEmails.length;
  const allClassified = Object.keys(classifications).length === totalEmails;

  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-4 max-w-7xl mx-auto relative">
      
      {/* Feedback Modal Overlay */}
      <AnimatePresence>
        {feedbackModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-lg"
            >
              <Card glow={feedbackModal.isCorrect ? "cyan" : "none"} className={`p-6 border-2 ${feedbackModal.isCorrect ? 'border-green-500/50' : 'border-red-500/50'}`}>
                <div className="flex items-center gap-4 mb-4">
                  {feedbackModal.isCorrect ? (
                    <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/50 text-green-400 shadow-[0_0_15px_rgba(34,197,94,0.3)]">
                      <CheckCircle className="w-6 h-6" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50 text-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                      <XCircle className="w-6 h-6" />
                    </div>
                  )}
                  <div>
                    <h3 className={`text-xl font-bold font-heading uppercase tracking-widest ${feedbackModal.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                      {feedbackModal.isCorrect ? "Classification Correct" : "Classification Incorrect"}
                    </h3>
                  </div>
                </div>
                
                <div className="bg-[#020202] p-4 rounded border border-white/10 mb-6 shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]">
                  <p className="text-foreground/80 font-sans text-sm leading-relaxed">
                    {feedbackModal.explanation}
                  </p>
                </div>

                <Button 
                  variant={feedbackModal.isCorrect ? "primary" : "ghost"} 
                  className={`w-full ${!feedbackModal.isCorrect ? 'border-white/20 text-white hover:bg-white/10' : ''}`}
                  onClick={handleNextEmail}
                >
                  {allClassified ? "View Final Score" : "Continue Assessment"}
                </Button>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Final Score Overlay */}
        {showFinalScore && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="w-full max-w-xl text-center"
            >
              <Card glow="cyan" className="p-10 border-accent/50 flex flex-col items-center">
                <ShieldAlert className="w-16 h-16 text-accent mb-6" />
                <h2 className="text-3xl font-heading font-bold text-white uppercase tracking-widest mb-2">Module Complete</h2>
                <p className="text-foreground/60 font-mono mb-8">Phishing Defense Simulation Terminated.</p>
                
                <div className="text-6xl font-bold font-mono text-accent mb-4 drop-shadow-[0_0_15px_rgba(0,240,255,0.5)]">
                  {correctCount} / {totalEmails}
                </div>
                <p className="text-foreground/80 mb-10">Threats successfully classified.</p>

                <Button 
                  variant="primary" 
                  className="w-full h-14 text-lg tracking-widest uppercase"
                  onClick={handleFinishModule}
                  disabled={completeModuleMutation.isPending}
                >
                  {completeModuleMutation.isPending ? "Syncing Grid..." : "Return to Dashboard"}
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
              Module: <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">Phishing Defense</span>
            </h1>
            <p className="text-foreground/60 font-mono text-sm">Analyze the inbox and classify incoming threats.</p>
          </div>
        </div>
        
        {/* Module Controls / Score */}
        <div className="flex items-center gap-4 px-5 py-2.5 bg-[#020202] border border-accent/30 rounded shadow-[inset_0_0_15px_rgba(0,240,255,0.05)]">
          <span className="text-sm font-mono text-foreground/70 uppercase tracking-widest">Score</span>
          <span className="text-xl font-mono font-bold text-accent">{correctCount} / {totalEmails}</span>
        </div>
      </div>

      {/* Main Mail Client Layout */}
      <Card glow="cyan" className="flex-1 p-0 overflow-hidden flex border-accent/30 bg-[#050505]">
        
        {/* Left Sidebar (Folders) */}
        <div className="w-48 border-r border-white/10 bg-[#020202] flex flex-col shrink-0 z-20">
          <div className="p-4 border-b border-white/10">
            <span className="text-xs font-mono uppercase tracking-widest text-accent/50">Folders</span>
          </div>
          <nav className="flex-1 py-2">
            <button className="w-full flex items-center justify-between px-4 py-3 bg-accent/10 text-accent border-l-2 border-accent transition-colors">
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-wider">
                <Inbox className="w-4 h-4" /> Inbox
              </div>
              <span className="text-xs font-bold bg-accent/20 px-2 py-0.5 rounded shadow-[0_0_5px_rgba(0,240,255,0.2)]">
                {totalEmails - Object.keys(classifications).length}
              </span>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-foreground/60 hover:bg-white/5 hover:text-white transition-colors border-l-2 border-transparent">
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" /> Spam
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-foreground/60 hover:bg-white/5 hover:text-white transition-colors border-l-2 border-transparent">
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-wider">
                <Send className="w-4 h-4" /> Sent
              </div>
            </button>
            <button className="w-full flex items-center justify-between px-4 py-3 text-foreground/60 hover:bg-white/5 hover:text-white transition-colors border-l-2 border-transparent">
              <div className="flex items-center gap-3 text-sm font-mono uppercase tracking-wider">
                <Trash2 className="w-4 h-4" /> Trash
              </div>
            </button>
          </nav>
        </div>

        {/* Middle Column (Email List) */}
        <div className="w-80 border-r border-white/10 bg-[#030303] flex flex-col shrink-0 z-10">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-widest text-accent/50">Messages</span>
          </div>
          <div className="flex-1 overflow-y-auto">
            {phishingEmails.map((email) => {
              const isClassified = classifications[email.id];
              return (
                <div 
                  key={email.id}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-colors ${selectedEmailId === email.id ? 'bg-accent/5 border-l-2 border-l-accent' : 'hover:bg-white/5 border-l-2 border-l-transparent'} ${isClassified ? 'opacity-50' : ''}`}
                  onClick={() => setSelectedEmailId(email.id)}
                >
                  <div className="flex justify-between items-baseline mb-1">
                    <span className={`text-sm font-medium truncate pr-2 ${!isClassified && email.isUnread ? 'text-white' : 'text-foreground/70'}`}>
                      {email.senderName}
                    </span>
                    <span className="text-[10px] font-mono text-accent/70">{email.date}</span>
                  </div>
                  <p className={`text-xs truncate mb-1 ${!isClassified && email.isUnread ? 'text-accent font-bold tracking-wide' : 'text-foreground/50'}`}>
                    {email.subject}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-foreground/40 truncate pr-2">
                      {email.body}
                    </p>
                    {isClassified && (
                      <CheckCircle className={`w-3 h-3 shrink-0 ${classifications[email.id] === 'safe' ? 'text-green-500' : 'text-red-500'}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (Email Viewer) */}
        <div className="flex-1 flex flex-col bg-[#050505] relative z-0">
          {/* subtle grid overlay */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 1) 1px, transparent 1px)', backgroundSize: '20px 20px' }}
          />

          {selectedEmail ? (
            <div className="flex flex-col h-full relative z-10">
              {/* Email Headers */}
              <div className="p-6 border-b border-white/10 bg-[#020202]/80 backdrop-blur-sm">
                <h2 className="text-xl font-bold text-white mb-6 tracking-wide">{selectedEmail.subject}</h2>
                <div className="space-y-3 font-mono text-sm bg-black/50 p-4 rounded border border-white/5">
                  <div className="flex items-center">
                    <span className="text-foreground/50 w-20 uppercase tracking-widest text-xs">From:</span>
                    <span className="text-accent cursor-crosshair hover:bg-accent/20 px-1 rounded transition-colors selection:bg-accent selection:text-black">
                      {selectedEmail.senderName} &lt;{selectedEmail.senderEmail}&gt;
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-foreground/50 w-20 uppercase tracking-widest text-xs">To:</span>
                    <span className="text-foreground/80 selection:bg-accent selection:text-black">operative@cybersim.net</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-foreground/50 w-20 uppercase tracking-widest text-xs">Date:</span>
                    <span className="text-foreground/80 selection:bg-accent selection:text-black">{selectedEmail.date}</span>
                  </div>
                </div>
              </div>

              {/* Email Body */}
              <div className="flex-1 p-8 overflow-y-auto bg-transparent">
                <div className="max-w-3xl text-foreground/80 font-sans leading-relaxed text-[15px] selection:bg-accent selection:text-black">
                  <p className="mb-4">Dear Operative,</p>
                  <p className="mb-4 whitespace-pre-wrap">{selectedEmail.body}</p>
                  
                  {selectedEmail.link && (
                    <div className="my-6 p-4 bg-[#020202] border border-white/10 rounded-md inline-block shadow-lg">
                      <p className="text-xs text-foreground/50 mb-2 font-mono uppercase tracking-widest">External Link Detected:</p>
                      <a href="#" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-1 rounded cursor-crosshair font-mono text-sm transition-colors border-b border-blue-400/30 border-dashed">
                        {selectedEmail.link.url}
                      </a>
                      <div className="mt-2 text-xs font-mono text-white/40">
                        Displays as: "{selectedEmail.link.text}"
                      </div>
                    </div>
                  )}
                  
                  <p className="mt-8">Thanks,<br/>IT Security Team</p>
                </div>
              </div>

              {/* Action Bar */}
              <div className="p-5 border-t border-white/10 bg-[#020202] flex justify-between items-center shadow-[0_-10px_20px_rgba(0,0,0,0.5)]">
                {classifications[selectedEmail.id] ? (
                  <div className="w-full flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${classifications[selectedEmail.id] === 'safe' ? 'bg-green-500' : 'bg-red-500'}`} />
                      <span className="text-xs font-mono text-foreground/50 uppercase tracking-widest">
                        Classified as: <span className="text-white font-bold">{classifications[selectedEmail.id]}</span>
                      </span>
                    </div>
                    {!allClassified && (
                      <Button variant="ghost" className="border-white/20 text-white/60 hover:bg-white/10 hover:text-white" onClick={handleNextEmail}>
                        Next Email
                      </Button>
                    )}
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
                      <span className="text-xs font-mono text-foreground/50 uppercase tracking-widest">Awaiting Classification</span>
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={() => handleClassify("safe")} variant="ghost" className="border-green-500/30 text-green-400 hover:bg-green-500/10 hover:text-green-300 group hover:border-green-500/50">
                        <CheckCircle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Report Safe
                      </Button>
                      <Button onClick={() => handleClassify("phishing")} variant="ghost" className="border-red-500/30 text-red-400 hover:bg-red-500/10 hover:text-red-300 group hover:border-red-500/50">
                        <AlertTriangle className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                        Flag as Phishing
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center relative z-10">
              <div className="text-center text-foreground/30 font-mono">
                <Mail className="w-16 h-16 mx-auto mb-4 opacity-50 stroke-1" />
                <p className="uppercase tracking-widest text-sm">No transmission selected</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
