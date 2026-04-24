import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="h-[calc(100vh-8rem)] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-10 h-10 text-accent animate-spin" />
        <p className="font-mono text-accent/70 uppercase tracking-widest text-sm animate-pulse">Initializing Grid...</p>
      </div>
    </div>
  );
}
