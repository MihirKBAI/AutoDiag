import React from "react";
import { LayoutDashboard, PlusCircle, History, BarChart3, FileText } from "lucide-react";
import { NavTab } from "./Sidebar";

interface MobileNavProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  hasActiveDiagnosis: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  onSelectTab,
  hasActiveDiagnosis,
}) => {
  return (
    <div
      id="mobile-bottom-navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-800/90 px-2 py-1.5 flex items-center justify-around"
    >
      <button
        id="mobile-nav-dashboard"
        type="button"
        onClick={() => onSelectTab("dashboard")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === "dashboard" ? "text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <LayoutDashboard className="w-4 h-4 mb-0.5" />
        <span>Home</span>
      </button>

      <button
        id="mobile-nav-history"
        type="button"
        onClick={() => onSelectTab("history")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === "history" ? "text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <History className="w-4 h-4 mb-0.5" />
        <span>Logs</span>
      </button>

      {/* Prominent Center Analyze CTA */}
      <button
        id="mobile-nav-analyze-cta"
        type="button"
        onClick={() => onSelectTab("new-inspection")}
        className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-cyan-500 to-sky-400 text-zinc-950 p-2.5 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.5)] border-2 border-zinc-950 cursor-pointer font-bold transition-transform active:scale-95"
      >
        <PlusCircle className="w-6 h-6 stroke-[2.5]" />
      </button>

      <button
        id="mobile-nav-reports"
        type="button"
        onClick={() => onSelectTab("reports")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === "reports" ? "text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <FileText className="w-4 h-4 mb-0.5" />
        <span>Reports</span>
      </button>

      <button
        id="mobile-nav-analytics"
        type="button"
        onClick={() => onSelectTab("analytics")}
        className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === "analytics" ? "text-cyan-400 font-semibold" : "text-zinc-400 hover:text-zinc-200"
        }`}
      >
        <BarChart3 className="w-4 h-4 mb-0.5" />
        <span>Stats</span>
      </button>
    </div>
  );
};
