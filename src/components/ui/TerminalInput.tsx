"use client";

import React from "react";

export interface TerminalInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  prompt?: string;
  onSubmitCommand?: (command: string) => void;
  clearOnSubmit?: boolean;
}

export const TerminalInput = React.forwardRef<HTMLInputElement, TerminalInputProps>(
  ({ 
    className = "", 
    prompt = "guest@cybersim:~$", 
    onSubmitCommand, 
    clearOnSubmit = true,
    onKeyDown, 
    ...props 
  }, ref) => {
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && onSubmitCommand) {
        e.preventDefault();
        onSubmitCommand(e.currentTarget.value);
        if (clearOnSubmit) {
          e.currentTarget.value = "";
        }
      }
      if (onKeyDown) onKeyDown(e);
    };

    return (
      <div className={`flex items-center gap-3 bg-[#020202] border border-accent/20 rounded p-3 font-mono text-sm sm:text-base shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] focus-within:border-accent/80 focus-within:shadow-[0_0_15px_rgba(0,240,255,0.15),inset_0_0_10px_rgba(0,240,255,0.05)] transition-all duration-300 ${className}`}>
        
        {/* Command Line Prompt */}
        <span className="text-accent font-bold select-none whitespace-nowrap drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]">
          {prompt}
        </span>
        
        {/* Input Field */}
        <div className="relative flex-1 flex items-center">
          <input
            ref={ref}
            type="text"
            className="w-full bg-transparent text-[#e0e0e0] outline-none caret-accent placeholder:text-white/20"
            onKeyDown={handleKeyDown}
            autoComplete="off"
            spellCheck="false"
            {...props}
          />
        </div>
      </div>
    );
  }
);

TerminalInput.displayName = "TerminalInput";
