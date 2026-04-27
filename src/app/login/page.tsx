"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { LogIn, Mail, Lock, AlertTriangle } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const FingerprintScanner = () => {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      <style>{`
        .scan-line {
          stroke-dasharray: 100;
          stroke-dashoffset: 100;
          animation: scan 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
        @keyframes scan {
          0% { stroke-dashoffset: 100; }
          40% { stroke-dashoffset: 0; }
          60% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -100; }
        }
        .delay-1 { animation-delay: 0.1s; }
        .delay-2 { animation-delay: 0.2s; }
        .delay-3 { animation-delay: 0.3s; }
        .delay-4 { animation-delay: 0.4s; }
        .delay-5 { animation-delay: 0.5s; }
        .delay-6 { animation-delay: 0.6s; }
        .delay-7 { animation-delay: 0.7s; }
      `}</style>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
        <path className="scan-line delay-1" d="M12 12v.01" />
        <path className="scan-line delay-2" d="M8 16c0-1.6.4-3.2 1.2-4.5" />
        <path className="scan-line delay-3" d="M16 16c0-1.6-.4-3.2-1.2-4.5" />
        <path className="scan-line delay-4" d="M9 20c-1.3-.8-2-2.3-2-3.8" />
        <path className="scan-line delay-5" d="M15 20c1.3-.8 2-2.3 2-3.8" />
        <path className="scan-line delay-6" d="M12 20v-4" />
        <path className="scan-line delay-7" d="M5.5 12C6.8 9.6 9.2 8 12 8s5.2 1.6 6.5 4" />
        <path className="scan-line delay-1" d="M2.5 16C3.8 13.6 6.2 12 9 12s5.2 1.6 6.5 4" />
      </svg>
    </div>
  );
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        throw new Error("Invalid access credentials. Connection refused.");
      }

      router.refresh();
      router.push(callbackUrl);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 relative z-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(122,95,255,0.03)_0%,transparent_50%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card glow="purple" className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent-alt/10 border border-accent-alt mb-6 shadow-[0_0_15px_rgba(122,95,255,0.2)]">
              <LogIn className="w-8 h-8 text-accent-alt" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-widest">
              System <span className="text-accent-alt drop-shadow-[0_0_10px_rgba(122,95,255,0.8)]">Access</span>
            </h1>
            <p className="text-foreground/70 text-sm mt-3 font-mono">
              Provide credentials to authenticate.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 border border-red-500/50 bg-red-500/10 rounded flex items-center gap-3 text-red-500 text-sm font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="form-control group">
              <Mail className="absolute left-0 top-2.5 w-4 h-4 text-accent-alt/50 group-focus-within:text-accent-alt transition-colors z-10" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="pl-8 disabled:opacity-50"
              />
              <label>
                <span style={{ transitionDelay: '0ms' }}>E</span>
                <span style={{ transitionDelay: '50ms' }}>m</span>
                <span style={{ transitionDelay: '100ms' }}>a</span>
                <span style={{ transitionDelay: '150ms' }}>i</span>
                <span style={{ transitionDelay: '200ms' }}>l</span>
              </label>
            </div>

            <div className="form-control group">
              <Lock className="absolute left-0 top-2.5 w-4 h-4 text-accent-alt/50 group-focus-within:text-accent-alt transition-colors z-10" />
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="pl-8 disabled:opacity-50"
              />
              <label>
                <span style={{ transitionDelay: '0ms' }}>P</span>
                <span style={{ transitionDelay: '50ms' }}>a</span>
                <span style={{ transitionDelay: '100ms' }}>s</span>
                <span style={{ transitionDelay: '150ms' }}>s</span>
                <span style={{ transitionDelay: '200ms' }}>w</span>
                <span style={{ transitionDelay: '250ms' }}>o</span>
                <span style={{ transitionDelay: '300ms' }}>r</span>
                <span style={{ transitionDelay: '350ms' }}>d</span>
              </label>
            </div>

            <div className="pt-4">
              <Button 
                type="submit" 
                variant="secondary" 
                className={`w-full h-12 transition-all duration-300 relative overflow-hidden ${isLoading ? 'opacity-90' : ''}`} 
                disabled={isLoading}
              >
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-0 scale-90 translate-y-4' : 'opacity-100 scale-100 translate-y-0'}`}>
                  LOGIN
                </div>
                <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${isLoading ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 -translate-y-4'}`}>
                  {isLoading && <FingerprintScanner />}
                </div>
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-foreground/60 text-sm font-sans">
              No clearance code?{" "}
              <Link href="/register" className="text-accent-alt hover:text-white hover:drop-shadow-[0_0_5px_rgba(122,95,255,0.8)] transition-all underline underline-offset-4 decoration-accent-alt/30">
                Request access
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-accent">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
