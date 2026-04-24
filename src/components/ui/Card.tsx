import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glow?: "cyan" | "purple" | "none" | "green" | "red";
}

export function Card({ children, className = "", glow = "none", ...props }: CardProps) {
  const glowClasses = {
    none: "border-white/10 shadow-lg",
    cyan: "border-accent/20 shadow-[0_8px_30px_rgba(0,240,255,0.08)] hover:border-accent/40 hover:shadow-[0_8px_30px_rgba(0,240,255,0.15)]",
    purple: "border-accent-alt/20 shadow-[0_8px_30px_rgba(122,95,255,0.08)] hover:border-accent-alt/40 hover:shadow-[0_8px_30px_rgba(122,95,255,0.15)]",
    green: "border-green-500/20 shadow-[0_8px_30px_rgba(34,197,94,0.08)] hover:border-green-500/40 hover:shadow-[0_8px_30px_rgba(34,197,94,0.15)]",
    red: "border-red-500/20 shadow-[0_8px_30px_rgba(239,68,68,0.08)] hover:border-red-500/40 hover:shadow-[0_8px_30px_rgba(239,68,68,0.15)]",
  };

  return (
    <div
      className={`relative bg-[#080808]/80 backdrop-blur-md rounded-xl border p-6 transition-all duration-300 ${glowClasses[glow]} ${className}`}
      {...props}
    >
      {/* Cyberpunk subtle corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/20 rounded-tl-xl pointer-events-none" />
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/20 rounded-tr-xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/20 rounded-bl-xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/20 rounded-br-xl pointer-events-none" />
      
      {children}
    </div>
  );
}
