import Sidebar from "@/components/layout/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-8rem)]">
      <Sidebar />
      <div className="flex-1 overflow-y-auto rounded-xl border border-white/5 bg-[#050505] shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] p-6 relative">
        {/* Subtle grid background for the main content area */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
            backgroundSize: '20px 20px'
          }}
        />
        <div className="relative z-10 h-full">
          {children}
        </div>
      </div>
    </div>
  );
}
