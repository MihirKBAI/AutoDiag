import React from "react";
import {
  Scan,
  Search,
  Wrench,
  Sparkles,
  Sliders,
  PlusCircle,
  Activity,
  ShieldCheck,
} from "lucide-react";
import { GarageProfile } from "../../types";

interface TopBarProps {
  isAiOnline: boolean;
  garageProfile: GarageProfile;
  onOpenSettings: () => void;
  onQuickDemo: () => void;
  onNewInspection: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  isAiOnline,
  garageProfile,
  onOpenSettings,
  onQuickDemo,
  onNewInspection,
  searchQuery,
  onSearchChange,
}) => {
  return (
    <header
      id="app-topbar"
      className="sticky top-0 z-30 flex items-center justify-between h-20 px-4 md:px-8 lg:px-10 bg-[#050608]/95 backdrop-blur-md border-b border-white/5 text-[#e0e0e0]"
    >
      {/* Brand / Active Telemetry Header */}
      <div className="flex items-center gap-6">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)] animate-pulse" />
            <span className="text-[10px] text-cyan-400 font-bold tracking-[0.2em] uppercase font-mono">
              Vehicle Diagnostics Terminal
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-light tracking-tight text-white flex items-center gap-2">
            AUTOSIGHT <span className="font-bold text-cyan-400">AI</span>
            <span className="text-zinc-500 text-xs font-mono hidden md:inline ml-2 border-l border-white/10 pl-3">
              v4.2 PRO
            </span>
          </h1>
        </div>

        {/* Global Inspection Search */}
        <div className="hidden lg:flex items-center relative w-64 xl:w-80 ml-4">
          <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-500 pointer-events-none" />
          <input
            id="topbar-search-input"
            type="text"
            placeholder="Search inspections, VIN, model..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-[#0a0c10] border border-white/10 focus:border-cyan-500/50 rounded text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none transition-colors font-mono"
          />
        </div>
      </div>

      {/* Right Controls & Telemetry Link */}
      <div className="flex items-center gap-4 sm:gap-6">
        {/* Link Status */}
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] text-zinc-400 tracking-widest font-mono uppercase">
            Neural Link
          </span>
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
            {isAiOnline ? "ONLINE (3.7)" : "LOCAL DEMO"}
          </div>
        </div>

        {/* Quick Demo Button */}
        <button
          id="topbar-quick-demo-btn"
          type="button"
          onClick={onQuickDemo}
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-cyan-500/10 text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer"
          title="Instantly load pre-configured Ford Mustang GT diagnostic scenario"
        >
          <Sparkles className="w-3 h-3 text-cyan-400" />
          <span>Demo Mustang GT</span>
        </button>

        {/* Full System Scan / New Inspection CTA */}
        <button
          id="topbar-new-inspection-btn"
          type="button"
          onClick={onNewInspection}
          className="px-4 sm:px-5 py-2 bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-bold uppercase tracking-widest hover:bg-cyan-500/25 shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.45)] transition-all cursor-pointer flex items-center gap-2"
        >
          <PlusCircle className="w-3.5 h-3.5 text-cyan-400 stroke-[2.5]" />
          <span>New Inspection</span>
        </button>

        {/* Garage Profile / Settings Trigger */}
        <button
          id="topbar-settings-btn"
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-[#0a0c10] hover:bg-white/5 border border-white/10 text-zinc-300 hover:text-white transition-colors cursor-pointer"
          title="Garage Profile & Diagnostics Configuration"
        >
          <div className="w-5 h-5 bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs font-bold">
            <Wrench className="w-3 h-3" />
          </div>
          <span className="hidden xl:inline text-xs font-mono font-medium text-zinc-300">
            {garageProfile.name.split(" ")[0]}
          </span>
          <Sliders className="w-3 h-3 text-zinc-400 hidden sm:inline" />
        </button>
      </div>
    </header>
  );
};
