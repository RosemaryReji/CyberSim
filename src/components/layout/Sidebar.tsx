"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, TerminalSquare, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Overview", path: "/dashboard", icon: LayoutDashboard },
    { name: "Simulations", path: "/dashboard/modules", icon: TerminalSquare },
    { name: "Settings", path: "/dashboard/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 flex flex-col gap-4 h-full">
      <div className="flex-1 rounded-xl border border-accent/20 bg-[#020202] p-4 flex flex-col gap-2 shadow-[0_0_15px_rgba(0,240,255,0.05)]">
        <div className="text-xs font-mono uppercase tracking-widest text-accent/50 mb-2 px-3">
          Control Panel
        </div>
        
        <nav className="flex-1 flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 font-mono text-sm uppercase tracking-wider ${
                  isActive
                    ? "bg-accent/10 text-accent border border-accent/30 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]"
                    : "text-foreground/70 hover:bg-white/5 hover:text-white border border-transparent"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" : ""}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="pt-4 border-t border-white/10 mt-auto">
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 font-mono text-sm uppercase tracking-wider text-red-400/70 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30"
          >
            <LogOut className="w-4 h-4" />
            Terminate Session
          </button>
        </div>
      </div>
    </aside>
  );
}
