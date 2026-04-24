import { create } from 'zustand';

export interface LogEntry {
  id: string;
  timestamp: Date;
  message: string;
  type: 'info' | 'error' | 'success' | 'warning';
}

interface SimulationState {
  isRunning: boolean;
  currentModuleId: string | null;
  logs: LogEntry[];
  
  // Actions
  startSimulation: (moduleId: string) => void;
  stopSimulation: () => void;
  addLog: (message: string, type?: LogEntry['type']) => void;
  clearLogs: () => void;
}

export const useSimulationStore = create<SimulationState>()((set) => ({
  isRunning: false,
  currentModuleId: null,
  logs: [],

  startSimulation: (moduleId) => set({ isRunning: true, currentModuleId: moduleId }),
  
  stopSimulation: () => set({ isRunning: false, currentModuleId: null }),
  
  addLog: (message, type = 'info') => set((state) => ({
    logs: [
      ...state.logs,
      {
        id: crypto.randomUUID(),
        timestamp: new Date(),
        message,
        type,
      }
    ]
  })),
  
  clearLogs: () => set({ logs: [] }),
}));
