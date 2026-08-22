import React from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Flame, ShieldAlert } from "lucide-react";
import { SeverityLevel } from "../../types";

interface SeverityBadgeProps {
  severity: SeverityLevel | string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({
  severity,
  size = "md",
  showIcon = true,
}) => {
  const norm = String(severity || "MODERATE").toUpperCase();

  const getStyle = () => {
    switch (norm) {
      case "CRITICAL":
        return {
          bg: "bg-red-950/70 border-red-500/50 text-red-300 shadow-red-950/30",
          dot: "bg-red-400 animate-pulse",
          icon: <Flame className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />,
          label: "CRITICAL SEVERITY",
        };
      case "HIGH":
        return {
          bg: "bg-orange-950/70 border-orange-500/50 text-orange-300 shadow-orange-950/30",
          dot: "bg-orange-400",
          icon: <AlertTriangle className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />,
          label: "HIGH SEVERITY",
        };
      case "MODERATE":
        return {
          bg: "bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-amber-950/30",
          dot: "bg-amber-400",
          icon: <AlertCircle className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />,
          label: "MODERATE SEVERITY",
        };
      case "LOW":
      default:
        return {
          bg: "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-emerald-950/30",
          dot: "bg-emerald-400",
          icon: <CheckCircle2 className={size === "sm" ? "w-3 h-3" : size === "lg" ? "w-4 h-4" : "w-3.5 h-3.5"} />,
          label: "LOW SEVERITY",
        };
    }
  };

  const style = getStyle();

  const sizeClasses = {
    sm: "text-[11px] px-2 py-0.5 gap-1.5 font-medium",
    md: "text-xs px-2.5 py-1 gap-2 font-semibold tracking-wide",
    lg: "text-sm px-3.5 py-1.5 gap-2.5 font-semibold tracking-wider",
  }[size];

  return (
    <span
      id={`severity-badge-${norm.toLowerCase()}`}
      className={`inline-flex items-center rounded-full border shadow-sm backdrop-blur-sm whitespace-nowrap ${style.bg} ${sizeClasses}`}
    >
      {showIcon && style.icon}
      <span>{style.label}</span>
    </span>
  );
};
