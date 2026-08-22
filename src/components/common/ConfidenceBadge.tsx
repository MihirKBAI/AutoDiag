import React from "react";
import { Sparkles, Gauge } from "lucide-react";

interface ConfidenceBadgeProps {
  confidence: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({
  confidence,
  size = "md",
  showLabel = true,
}) => {
  const value = Math.min(100, Math.max(0, Math.round(confidence || 0)));

  const getColor = () => {
    if (value >= 85) return "text-cyan-300 border-cyan-500/30 bg-cyan-950/50";
    if (value >= 70) return "text-sky-300 border-sky-500/30 bg-sky-950/50";
    if (value >= 50) return "text-amber-300 border-amber-500/30 bg-amber-950/50";
    return "text-rose-300 border-rose-500/30 bg-rose-950/50";
  };

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5 font-medium",
    lg: "text-sm px-3 py-1.5 gap-2 font-semibold",
  }[size];

  return (
    <span
      id={`confidence-badge-${value}`}
      className={`inline-flex items-center rounded-md border font-mono tracking-tight ${getColor()} ${sizeClasses}`}
      title={`AI Analysis Confidence: ${value}%`}
    >
      <Sparkles className="w-3 h-3 text-cyan-400" />
      <span>
        {showLabel && <span className="text-zinc-400 font-sans mr-1 font-normal">AI Conf:</span>}
        {value}%
      </span>
    </span>
  );
};
