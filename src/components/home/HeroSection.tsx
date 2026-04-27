"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export function HeroSection() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center overflow-hidden rounded-2xl border border-accent/10 bg-[#020202]">
      {/* Animated Background Grid */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 240, 255, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.2) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center'
        }}
      />
      {/* Soft Vignette Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#020202_80%)] pointer-events-none" />

      <div className="relative z-10 max-w-5xl px-6 text-center">
        
        {/* System Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/5 text-accent text-xs font-mono uppercase tracking-widest shadow-[0_0_15px_rgba(0,240,255,0.1)]"
        >
          <Terminal className="w-4 h-4" />
          <span>System Status: Online</span>
        </motion.div>

        {/* Main Title */}
        <motion.h1 
          className="text-5xl sm:text-6xl md:text-8xl font-heading font-bold text-white tracking-widest mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          MASTER THE <span className="text-accent drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]">GRID</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="text-lg md:text-xl text-foreground/70 font-sans mb-12 max-w-2xl mx-auto leading-relaxed"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          An immersive cybersecurity training simulator. Experience real-world offensive and defensive tactics within a completely sandboxed, neon-infused terminal environment.
        </motion.p>

        {/* Action Buttons */}
        <motion.div 
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Button 
            variant="primary" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => {
              if (session) {
                router.push("/dashboard/modules");
              } else {
                router.push("/login?callbackUrl=/dashboard/modules");
              }
            }}
          >
            Initialize Training
          </Button>
          <Button 
            variant="secondary" 
            size="lg" 
            className="w-full sm:w-auto"
            onClick={() => {
              if (session) {
                router.push("/dashboard");
              } else {
                router.push("/login?callbackUrl=/dashboard");
              }
            }}
          >
            Access Dashboard
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
