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
    <aside className="group relative w-16 h-full z-50 shrink-0">
      <div className="absolute top-0 left-0 w-64 h-full rounded-xl border border-accent/20 bg-[#020202] p-4 flex flex-col shadow-[0_0_20px_rgba(0,240,255,0.05)] transform -translate-x-[calc(100%-4rem)] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] overflow-hidden">
        
        {/* Header containing the Hamburger Menu */}
        <div className="flex items-center justify-end h-10 mb-6">
          <div className="relative w-8 h-8 flex flex-col justify-center items-center gap-1.5 overflow-hidden cursor-pointer">
            <div className="w-6 h-0.5 bg-accent transition-all duration-500 ease-in-out group-hover:-translate-y-4 group-hover:opacity-0" />
            <div className="w-6 h-0.5 bg-accent transition-all duration-500 ease-in-out origin-center group-hover:scale-y-[16] group-hover:bg-accent" />
            <div className="w-6 h-0.5 bg-accent transition-all duration-500 ease-in-out group-hover:translate-y-4 group-hover:opacity-0" />
            
            <div className="absolute inset-0 flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 -rotate-90 transition-all duration-500 delay-100 text-[9px] font-bold text-[#020202] tracking-widest z-10 pointer-events-none">
              MENU
            </div>
          </div>
        </div>
        
        {/* Menu Content */}
        <div className="flex-1 flex flex-col">
          <div className="text-xs font-mono uppercase tracking-widest text-accent/50 mb-4 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-200">
            Control Panel
          </div>
          
          <nav className="flex-1 flex flex-col gap-2">
            {navItems.map((item, index) => {
              const isActive = pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  style={{ transitionDelay: `${index * 100 + 150}ms` }}
                  className={`flex items-center gap-3 px-4 py-3 rounded font-mono text-sm uppercase tracking-wider opacity-0 -translate-x-8 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 ease-out whitespace-nowrap ${
                    isActive
                      ? "bg-accent/10 text-accent border border-accent/30 shadow-[inset_0_0_10px_rgba(0,240,255,0.1)]"
                      : "text-foreground/70 hover:bg-white/5 hover:text-white border border-transparent"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "drop-shadow-[0_0_5px_rgba(0,240,255,0.8)]" : ""}`} />
                  <span className="truncate">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-white/10 mt-auto opacity-0 -translate-x-8 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500" style={{ transitionDelay: `${navItems.length * 100 + 150}ms` }}>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-3 px-4 py-3 rounded transition-all duration-300 font-mono text-sm uppercase tracking-wider text-red-400/70 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/30 whitespace-nowrap"
            >
              <LogOut className="w-4 h-4 shrink-0" />
              <span className="truncate">Terminate Session</span>
            </button>
          </div>
        </div>

      </div>
    </aside>
  );
}
