import React from "react";
import {
  BarChart3,
  TrendingUp,
  PieChart,
  Activity,
  Layers,
  Wrench,
  Car,
  DollarSign,
  AlertTriangle,
  Flame,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { InspectionRecord } from "../../types";

interface AnalyticsViewProps {
  inspections: InspectionRecord[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ inspections }) => {
  const total = inspections.length;
  const totalEstimatedCost = inspections.reduce(
    (sum, i) => sum + (i.diagnosis?.estimatedCost?.estimatedTotal || 0),
    0
  );
  const avgCost = total > 0 ? Math.round(totalEstimatedCost / total) : 0;

  // Severity counts
  const severityCounts = {
    LOW: inspections.filter((i) => i.diagnosis?.overallSeverity === "LOW").length,
    MODERATE: inspections.filter((i) => i.diagnosis?.overallSeverity === "MODERATE").length,
    HIGH: inspections.filter((i) => i.diagnosis?.overallSeverity === "HIGH").length,
    CRITICAL: inspections.filter((i) => i.diagnosis?.overallSeverity === "CRITICAL").length,
  };

  // Commonly damaged parts aggregation
  const partFrequencies: Record<string, number> = {};
  inspections.forEach((i) => {
    i.diagnosis?.affectedParts?.forEach((p) => {
      const name = p.partName.split("&")[0].split("(")[0].trim();
      partFrequencies[name] = (partFrequencies[name] || 0) + 1;
    });
  });

  const topDamagedParts = Object.entries(partFrequencies)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  return (
    <div id="analytics-view-root" className="space-y-8 pb-20 max-w-6xl mx-auto">
      {/* Header */}
      <div className="border-b border-zinc-800 pb-5">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
          <BarChart3 className="w-6 h-6 text-cyan-400" />
          <span>Garage Diagnostics & Repair Analytics</span>
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
          Real-time telemetry on damage patterns, severity distribution, parts replacement frequencies, and estimated repair pipelines.
        </p>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono">Total Scans</span>
            <Car className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">{total}</div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" /> 100% processed through AI
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono">Avg. Repair Estimate</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatCurrency(avgCost)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Per inspected vehicle</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono">Total Pipeline Value</span>
            <Activity className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            {formatCurrency(totalEstimatedCost)}
          </div>
          <span className="text-[11px] text-zinc-500 mt-1 block">Estimated workshop volume</span>
        </div>

        <div className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-lg">
          <div className="flex items-center justify-between text-zinc-400 mb-2">
            <span className="text-xs font-medium uppercase font-mono">High/Critical Severity</span>
            <Flame className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-extrabold text-white font-mono">
            {severityCounts.HIGH + severityCounts.CRITICAL}
          </div>
          <span className="text-[11px] text-amber-400 mt-1 block">Require chassis bench scan</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Severity Distribution */}
        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <PieChart className="w-4 h-4 text-cyan-400" />
              <span>Damage Severity Distribution</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">{total} total cases</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { label: "CRITICAL SEVERITY", count: severityCounts.CRITICAL, color: "bg-red-500", text: "text-red-400" },
              { label: "HIGH SEVERITY", count: severityCounts.HIGH, color: "bg-orange-500", text: "text-orange-400" },
              { label: "MODERATE SEVERITY", count: severityCounts.MODERATE, color: "bg-amber-500", text: "text-amber-400" },
              { label: "LOW SEVERITY", count: severityCounts.LOW, color: "bg-emerald-500", text: "text-emerald-400" },
            ].map((item) => {
              const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className={item.text}>{item.label}</span>
                    <span className="text-zinc-300">
                      {item.count} cases ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                    <div className={`h-full ${item.color} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Most Commonly Damaged Parts */}
        <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Top Affected Vehicle Components</span>
            </h3>
            <span className="text-[10px] font-mono text-zinc-400">AI Component Catalog</span>
          </div>

          <div className="space-y-3 pt-2">
            {topDamagedParts.length > 0 ? (
              topDamagedParts.map(([partName, count], idx) => {
                const maxCount = topDamagedParts[0][1] || 1;
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={partName} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-white truncate max-w-[240px]">
                        {idx + 1}. {partName}
                      </span>
                      <span className="font-mono text-cyan-300 font-semibold">{count} occurrences</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden border border-zinc-800">
                      <div
                        className="h-full bg-gradient-to-r from-cyan-500 to-sky-400 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-zinc-500 italic">No parts catalog data yet.</p>
            )}
          </div>
        </section>
      </div>

      {/* Garage Efficiency & AI Calibration Summary */}
      <section className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-xl space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Diagnostic Calibration Benchmark</span>
        </h3>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          AutoSight AI executes dual-tier verification: Gemini multimodal vision maps visible exterior damage regions, while the heuristic automotive parts catalog normalizes repair vs replace feasibility, OEM part reference numbers, and standard workshop labor calculation schedules.
        </p>
      </section>
    </div>
  );
};
