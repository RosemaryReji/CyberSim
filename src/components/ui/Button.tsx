"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className = "", variant = "primary", size = "md", ...props }, ref) => {
    
    const baseClasses = "relative inline-flex items-center justify-center font-mono uppercase tracking-widest overflow-hidden transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed rounded";
    
    const sizeClasses = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3 text-base font-bold",
    };

    const variantClasses = {
      primary: "text-accent border border-accent/50 bg-accent/5 shadow-[0_0_10px_rgba(0,240,255,0.1)]",
      secondary: "text-accent-alt border border-accent-alt/50 bg-accent-alt/5 shadow-[0_0_10px_rgba(122,95,255,0.1)]",
      danger: "text-red-500 border border-red-500/50 bg-red-500/5 shadow-[0_0_10px_rgba(239,68,68,0.1)]",
      ghost: "text-foreground/70 border border-transparent hover:text-white",
    };

    const hoverGlow = {
      primary: "0 0 20px rgba(0,240,255,0.6), inset 0 0 10px rgba(0,240,255,0.2)",
      secondary: "0 0 20px rgba(122,95,255,0.6), inset 0 0 10px rgba(122,95,255,0.2)",
      danger: "0 0 20px rgba(239,68,68,0.6), inset 0 0 10px rgba(239,68,68,0.2)",
      ghost: "none",
    };

    return (
      <motion.button
        ref={ref}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        whileHover={{ 
          scale: 1.02,
          boxShadow: hoverGlow[variant],
          backgroundColor: variant === 'primary' ? 'rgba(0,240,255,0.1)' : 
                           variant === 'secondary' ? 'rgba(122,95,255,0.1)' :
                           variant === 'danger' ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.05)'
        }}
        whileTap={{ scale: 0.98 }}
        {...props}
      >
        <motion.span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </motion.span>
        
        {/* Scanning Light Effect on Hover */}
        {variant !== 'ghost' && (
          <motion.div 
            className="absolute top-0 bottom-0 left-0 w-8 bg-white/20 blur-[8px] -skew-x-12"
            initial={{ x: "-200%", opacity: 0 }}
            whileHover={{ x: "400%", opacity: 1 }}
            transition={{ duration: 0.7, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
          />
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";
