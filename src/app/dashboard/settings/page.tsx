"use client";

import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Settings as SettingsIcon, Bell, Shield, Key, HardDrive, Check } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [crtEnabled, setCrtEnabled] = useState(true);
  const [hardwareAcc, setHardwareAcc] = useState(true);
  const [difficulty, setDifficulty] = useState("operative");
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col gap-6 max-w-[1200px] mx-auto overflow-y-auto pb-8">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded bg-[#020202] border border-accent/50 flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.2)]">
          <SettingsIcon className="w-5 h-5 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-heading font-bold text-white uppercase tracking-widest">
            System <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.6)]">Settings</span>
          </h1>
          <p className="text-foreground/60 font-mono text-sm">Configure your simulation environment.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Navigation Sidebar */}
        <div className="col-span-1 flex flex-col gap-2">
          <Button 
            variant={activeTab === "general" ? "primary" : "ghost"} 
            className={`justify-start gap-3 ${activeTab !== "general" && "border-white/10 hover:border-accent/30 text-foreground/70 hover:text-white"}`}
            onClick={() => setActiveTab("general")}
          >
            <SettingsIcon className="w-4 h-4" /> General
          </Button>
          <Button 
            variant={activeTab === "security" ? "primary" : "ghost"} 
            className={`justify-start gap-3 ${activeTab !== "security" && "border-white/10 hover:border-accent/30 text-foreground/70 hover:text-white text-left"}`}
            onClick={() => setActiveTab("security")}
          >
            <Shield className="w-4 h-4" /> Security
          </Button>
          <Button 
            variant={activeTab === "notifications" ? "primary" : "ghost"} 
            className={`justify-start gap-3 ${activeTab !== "notifications" && "border-white/10 hover:border-accent/30 text-foreground/70 hover:text-white text-left"}`}
            onClick={() => setActiveTab("notifications")}
          >
            <Bell className="w-4 h-4" /> Notifications
          </Button>
          <Button 
            variant={activeTab === "keys" ? "primary" : "ghost"} 
            className={`justify-start gap-3 ${activeTab !== "keys" && "border-white/10 hover:border-accent/30 text-foreground/70 hover:text-white text-left"}`}
            onClick={() => setActiveTab("keys")}
          >
            <Key className="w-4 h-4" /> API Keys
          </Button>
          <Button 
            variant={activeTab === "data" ? "primary" : "ghost"} 
            className={`justify-start gap-3 ${activeTab !== "data" && "border-white/10 hover:border-accent/30 text-foreground/70 hover:text-white text-left"}`}
            onClick={() => setActiveTab("data")}
          >
            <HardDrive className="w-4 h-4" /> Data Management
          </Button>
        </div>

        {/* Content Area */}
        <div className="col-span-1 md:col-span-2 flex flex-col gap-6">
          {activeTab === "general" && (
            <>
              <Card glow="none" className="bg-[#050505] p-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Interface Preferences</h3>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white mb-1">CRT Scanline Effect</p>
                      <p className="text-xs text-foreground/60 font-mono">Enable retro terminal scanlines across the UI.</p>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${crtEnabled ? 'bg-accent/20 border border-accent/50' : 'bg-white/5 border border-white/20'}`}
                      onClick={() => setCrtEnabled(!crtEnabled)}
                    >
                      <div className={`w-4 h-4 rounded-full absolute top-1 transition-all duration-300 ${crtEnabled ? 'right-1 bg-accent shadow-[0_0_10px_rgba(0,240,255,0.8)]' : 'left-1 bg-foreground/50'}`} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-white mb-1">Hardware Acceleration</p>
                      <p className="text-xs text-foreground/60 font-mono">Use GPU to render complex dashboard animations.</p>
                    </div>
                    <div 
                      className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors duration-300 ${hardwareAcc ? 'bg-accent/20 border border-accent/50' : 'bg-white/5 border border-white/20'}`}
                      onClick={() => setHardwareAcc(!hardwareAcc)}
                    >
                      <div className={`w-4 h-4 rounded-full absolute top-1 transition-all duration-300 ${hardwareAcc ? 'right-1 bg-accent shadow-[0_0_10px_rgba(0,240,255,0.8)]' : 'left-1 bg-foreground/50'}`} />
                    </div>
                  </div>
                </div>
              </Card>

              <Card glow="none" className="bg-[#050505] p-6 animate-in fade-in slide-in-from-right-4 duration-300 delay-75">
                <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Simulation Difficulty</h3>
                
                <div className="space-y-4">
                  <p className="text-xs text-foreground/60 font-mono mb-4">Adjust the realism and strictness of the cybersecurity modules.</p>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div 
                      className={`p-4 rounded border text-center cursor-pointer transition-colors ${difficulty === 'recruit' ? 'border-accent bg-accent/20 shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/10 bg-white/5 hover:border-accent/50 hover:bg-accent/10'}`}
                      onClick={() => setDifficulty('recruit')}
                    >
                      <p className={`font-bold text-sm uppercase ${difficulty === 'recruit' ? 'text-accent drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]' : 'text-white'}`}>Recruit</p>
                      <p className={`text-[10px] font-mono mt-1 ${difficulty === 'recruit' ? 'text-accent/70' : 'text-foreground/50'}`}>Guided</p>
                    </div>
                    
                    <div 
                      className={`p-4 rounded border text-center cursor-pointer transition-colors ${difficulty === 'operative' ? 'border-accent bg-accent/20 shadow-[inset_0_0_15px_rgba(0,240,255,0.2)]' : 'border-white/10 bg-white/5 hover:border-accent/50 hover:bg-accent/10'}`}
                      onClick={() => setDifficulty('operative')}
                    >
                      <p className={`font-bold text-sm uppercase ${difficulty === 'operative' ? 'text-accent drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]' : 'text-white'}`}>Operative</p>
                      <p className={`text-[10px] font-mono mt-1 ${difficulty === 'operative' ? 'text-accent/70' : 'text-foreground/50'}`}>Standard</p>
                    </div>

                    <div 
                      className={`p-4 rounded border text-center cursor-pointer transition-colors ${difficulty === 'elite' ? 'border-red-500 bg-red-500/20 shadow-[inset_0_0_15px_rgba(239,68,68,0.2)]' : 'border-white/10 bg-white/5 hover:border-red-500/50 hover:bg-red-500/10'}`}
                      onClick={() => setDifficulty('elite')}
                    >
                      <p className={`font-bold text-sm uppercase ${difficulty === 'elite' ? 'text-red-400 drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]' : 'text-white'}`}>Elite</p>
                      <p className={`text-[10px] font-mono mt-1 ${difficulty === 'elite' ? 'text-red-400/50' : 'text-foreground/50'}`}>No Assists</p>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}

          {activeTab === "security" && (
            <Card glow="none" className="bg-[#050505] p-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Account Security</h3>
              <p className="text-sm font-mono text-foreground/70 mb-4">Update your password or configure Two-Factor Authentication.</p>
              <Button variant="ghost" className="border-white/10 w-full mb-4 justify-start text-left text-white/50 cursor-not-allowed">Enable 2FA (Coming Soon)</Button>
              <Button variant="ghost" className="border-red-500/50 text-red-400 hover:bg-red-500/10 w-full justify-start text-left">Reset Password</Button>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card glow="none" className="bg-[#050505] p-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Alert Preferences</h3>
              <p className="text-sm font-mono text-foreground/70">No notification preferences configured. You are currently receiving all simulation alerts.</p>
            </Card>
          )}

          {activeTab === "keys" && (
            <Card glow="none" className="bg-[#050505] p-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <h3 className="text-lg font-heading font-bold text-white uppercase tracking-widest mb-4 border-b border-white/10 pb-2">Developer Keys</h3>
              <p className="text-sm font-mono text-foreground/70 mb-4">Access the CyberSim API to retrieve telemetry programmatically.</p>
              <div className="p-3 bg-black border border-white/10 font-mono text-xs text-white flex items-center justify-between">
                <span>sk_test_1234567890abcdef...</span>
                <Button variant="ghost" className="h-6 text-[10px] px-2 py-0">Copy</Button>
              </div>
            </Card>
          )}

          {activeTab === "data" && (
            <Card glow="none" className="bg-[#050505] p-6 animate-in fade-in slide-in-from-right-4 duration-300 border-red-500/20">
              <h3 className="text-lg font-heading font-bold text-red-400 uppercase tracking-widest mb-4 border-b border-red-500/20 pb-2">Danger Zone</h3>
              <p className="text-sm font-mono text-foreground/70 mb-4">Permanently delete your profile and all simulation data.</p>
              <Button variant="ghost" className="border-red-500/50 text-red-400 hover:bg-red-500/20">Wipe Data</Button>
            </Card>
          )}

          <div className="flex justify-end gap-4 mt-2">
            <Button variant="ghost" className="border-white/10">Discard Changes</Button>
            <Button variant="primary" onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Configuration"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
