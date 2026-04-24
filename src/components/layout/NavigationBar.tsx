"use client";

import Link from "next/link";
import { Terminal, Shield, User, Cpu } from "lucide-react";
import { usePathname } from "next/navigation";
import { signIn } from "next-auth/react";

export default function NavigationBar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Cpu },
    { name: "Modules", path: "/dashboard/modules", icon: Shield },
    { name: "Terminal", path: "/dashboard/terminal", icon: Terminal },
    { name: "Profile", path: "/dashboard/profile", icon: User },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-accent/20 bg-background/80 backdrop-blur-md shadow-[0_4px_30px_rgba(0,240,255,0.05)]">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded bg-accent/10 border border-accent flex items-center justify-center shadow-[0_0_15px_rgba(0,240,255,0.3)]">
          <Cpu className="text-accent w-6 h-6" />
        </div>
        <Link href="/" className="font-heading text-2xl font-bold tracking-widest text-white hover:text-accent transition-colors duration-300">
          CYBER<span className="text-accent drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">SIM</span>
        </Link>
      </div>

      <div className="hidden md:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex items-center gap-2 text-sm uppercase tracking-widest font-medium transition-all duration-300 ${
                isActive
                  ? "text-accent drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]"
                  : "text-foreground/70 hover:text-white hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </div>

      <div className="flex items-center gap-4">
        <Link 
          href="/login"
          className="px-5 py-2 font-mono text-xs uppercase tracking-widest text-accent border border-accent/50 rounded bg-accent/5 hover:bg-accent/20 hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300"
        >
          System Login
        </Link>
      </div>
    </nav>
  );
}
