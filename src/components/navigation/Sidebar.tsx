import React from "react";
import {
  LayoutDashboard,
  PlusCircle,
  History,
  FileText,
  BarChart3,
  Car,
  Sparkles,
  Scan,
  ShieldCheck,
} from "lucide-react";

export type NavTab =
  | "dashboard"
  | "new-inspection"
  | "diagnostic-results"
  | "reports"
  | "history"
  | "analytics"
  | "vehicles";

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onQuickDemo: () => void;
  hasActiveDiagnosis: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  onQuickDemo,
  hasActiveDiagnosis,
}) => {
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "new-inspection", label: "New Inspection", icon: PlusCircle, highlight: true },
    ...(hasActiveDiagnosis
      ? [{ id: "diagnostic-results", label: "Diagnostic HUD", icon: Scan, badge: "LIVE" }]
      : []),
    { id: "history", label: "Inspections Log", icon: History },
    { id: "reports", label: "Diagnostic Reports", icon: FileText },
    { id: "analytics", label: "Garage Analytics", icon: BarChart3 },
    { id: "vehicles", label: "Vehicle Registry", icon: Car },
  ];

  return (
    <aside
      id="app-sidebar"
      className="hidden md:flex flex-col w-64 bg-[#0a0c10] border-r border-white/5 flex-shrink-0 h-screen sticky top-0 select-none z-20"
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-6 h-20 border-b border-white/5">
        <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center border border-cyan-500/40">
          <div className="w-4 h-4 bg-cyan-400 rounded-sm shadow-[0_0_10px_rgba(34,211,238,0.7)]" />
        </div>
        <div>
          <div className="flex items-baseline gap-1">
            <span className="font-extrabold tracking-tight text-lg text-white font-sans">
              AUTOSIGHT
            </span>
            <span className="text-[10px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
              AI
            </span>
          </div>
          <p className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest">
            Diagnostic Core
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="p-4">
        <button
          id="sidebar-analyze-vehicle-btn"
          type="button"
          onClick={() => onSelectTab("new-inspection")}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 font-bold text-xs tracking-widest uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>+ Full Scan</span>
        </button>
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
          System Modules
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              type="button"
              onClick={() => onSelectTab(item.id as NavTab)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded transition-all cursor-pointer group text-xs font-mono ${
                isActive
                  ? "bg-white/5 text-cyan-300 border-l-2 border-cyan-400 font-bold shadow-[inset_0_0_12px_rgba(34,211,238,0.08)]"
                  : "text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.03]"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive ? "text-cyan-400" : "text-zinc-500 group-hover:text-zinc-300"
                  }`}
                />
                <span className="tracking-wide">{item.label}</span>
              </div>
              {item.badge && (
                <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold tracking-widest rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 animate-pulse">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}

        <div className="pt-6 px-3 pb-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-400 font-semibold">
          Simulations
        </div>

        {/* Demo Mustang GT Quick Link */}
        <button
          id="sidebar-demo-mustang-btn"
          type="button"
          onClick={onQuickDemo}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded text-xs font-mono text-amber-300/90 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/15 border border-amber-500/20 transition-all cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span className="truncate tracking-wide">Mustang GT Telemetry</span>
        </button>
      </nav>

      {/* Footer / System Telemetry */}
      <div className="p-4 border-t border-white/5 bg-[#050608]">
        <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono mb-2">
          <span>SYS_CORE</span>
          <span className="text-cyan-400">v4.2-STABLE</span>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>NEURAL PIPELINE ACTIVE</span>
        </div>
      </div>
    </aside>
  );
};
