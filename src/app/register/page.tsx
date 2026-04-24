"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, User, AlertTriangle } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    fullName: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null); // Clear error on typing
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // 1. Register the user
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to register account.");
      }

      // 2. Automatically log them in after successful registration
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (signInRes?.error) {
        throw new Error("Account created, but auto-login failed. Please login manually.");
      }

      // 3. Redirect to dashboard
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center p-6 relative z-10 py-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.03)_0%,transparent_50%)] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card glow="cyan" className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 border border-accent mb-6 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
              <UserPlus className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-heading font-bold text-white uppercase tracking-widest">
              Create <span className="text-accent drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]">User</span>
            </h1>
            <p className="text-foreground/70 text-sm mt-3 font-mono">
              Initialize a new CyberSim operative account.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 border border-red-500/50 bg-red-500/10 rounded flex items-center gap-3 text-red-500 text-sm font-mono">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-mono uppercase tracking-widest text-accent ml-1">Full Legal Name</label>
                <div className="relative flex items-center group">
                  <User className="absolute left-3 w-4 h-4 text-accent/50 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="John Doe"
                    className="w-full bg-[#020202] border border-accent/30 rounded pl-10 pr-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,240,255,0.15),inset_0_0_10px_rgba(0,240,255,0.05)] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-mono uppercase tracking-widest text-accent ml-1">Date of Birth</label>
                <div className="relative flex items-center group">
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    className="w-full bg-[#020202] border border-accent/30 rounded px-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,240,255,0.15),inset_0_0_10px_rgba(0,240,255,0.05)] transition-all disabled:opacity-50 [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-mono uppercase tracking-widest text-accent ml-1">Username</label>
                <div className="relative flex items-center group">
                  <User className="absolute left-3 w-4 h-4 text-accent/50 group-focus-within:text-accent transition-colors" />
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="Operative ID"
                    className="w-full bg-[#020202] border border-accent/30 rounded pl-10 pr-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,240,255,0.15),inset_0_0_10px_rgba(0,240,255,0.05)] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-mono uppercase tracking-widest text-accent ml-1">Email</label>
                <div className="relative flex items-center group">
                  <Mail className="absolute left-3 w-4 h-4 text-accent/50 group-focus-within:text-accent transition-colors" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="transmission@grid.net"
                    className="w-full bg-[#020202] border border-accent/30 rounded pl-10 pr-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,240,255,0.15),inset_0_0_10px_rgba(0,240,255,0.05)] transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              <div className="space-y-1.5 col-span-2">
                <label className="text-xs font-mono uppercase tracking-widest text-accent ml-1">Password</label>
                <div className="relative flex items-center group">
                  <Lock className="absolute left-3 w-4 h-4 text-accent/50 group-focus-within:text-accent transition-colors" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    disabled={isLoading}
                    placeholder="••••••••"
                    className="w-full bg-[#020202] border border-accent/30 rounded pl-10 pr-4 py-3 font-mono text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-accent focus:shadow-[0_0_15px_rgba(0,240,255,0.15),inset_0_0_10px_rgba(0,240,255,0.05)] transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" variant="primary" className="w-full" disabled={isLoading}>
                {isLoading ? "Processing..." : "Initialize Account"}
              </Button>
            </div>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-6">
            <p className="text-foreground/60 text-sm font-sans">
              Already have clearance?{" "}
              <Link href="/login" className="text-accent hover:text-white hover:drop-shadow-[0_0_5px_rgba(0,240,255,0.8)] transition-all underline underline-offset-4 decoration-accent/30">
                Authenticate here
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
