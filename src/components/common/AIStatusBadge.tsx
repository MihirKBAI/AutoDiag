import React from "react";
import { Cpu, Zap } from "lucide-react";

interface AIStatusBadgeProps {
  isOnline: boolean;
  className?: string;
  onClick?: () => void;
}

export const AIStatusBadge: React.FC<AIStatusBadgeProps> = ({
  isOnline,
  className = "",
  onClick,
}) => {
  return (
    <button
      id="ai-status-indicator-btn"
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-mono tracking-wider transition-all cursor-pointer border ${
        isOnline
          ? "bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 shadow-[0_0_12px_rgba(6,182,212,0.15)]"
          : "bg-amber-950/60 border-amber-500/40 text-amber-300 hover:bg-amber-900/60 shadow-[0_0_12px_rgba(245,158,11,0.15)]"
      } ${className}`}
      title={isOnline ? "Google Gemini 3.7 Vision Engine Online" : "Operating in Simulated Demo AI Mode"}
    >
      <span className="relative flex h-2 w-2">
        <span
          className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
            isOnline ? "bg-cyan-400" : "bg-amber-400"
          }`}
        />
        <span
          className={`relative inline-flex rounded-full h-2 w-2 ${
            isOnline ? "bg-cyan-400" : "bg-amber-400"
          }`}
        />
      </span>
      <span className="flex items-center gap-1.5 font-semibold">
        {isOnline ? <Zap className="w-3 h-3 text-cyan-400" /> : <Cpu className="w-3 h-3 text-amber-400" />}
        {isOnline ? "AI ENGINE ONLINE" : "DEMO AI MODE"}
      </span>
    </button>
  );
};
