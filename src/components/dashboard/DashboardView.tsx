import React from "react";
import {
  Car,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileText,
  UploadCloud,
  ChevronRight,
  Activity,
  Zap,
  Wrench,
  Flame,
  Gauge,
  Cpu,
} from "lucide-react";
import { DEMO_VEHICLES, MUSTANG_GT_DEMO_DIAGNOSIS } from "../../data/demoData";
import { InspectionRecord, VehicleRecord } from "../../types";
import { SeverityBadge } from "../common/SeverityBadge";
import { ConfidenceBadge } from "../common/ConfidenceBadge";

interface DashboardViewProps {
  inspections: InspectionRecord[];
  onStartInspection: (vehicle?: VehicleRecord) => void;
  onViewInspection: (inspection: InspectionRecord) => void;
  onSelectVehicleDemo: (vehicle: VehicleRecord) => void;
  onQuickDemoMustang: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  inspections,
  onStartInspection,
  onViewInspection,
  onSelectVehicleDemo,
  onQuickDemoMustang,
}) => {
  // Compute Dashboard Metrics
  const totalInspected = inspections.length;
  const todayCount = inspections.filter((i) => {
    const d = new Date(i.createdAt);
    const now = new Date();
    return d.toDateString() === now.toDateString();
  }).length;

  const totalEstimatedValue = inspections.reduce(
    (sum, i) => sum + (i.diagnosis?.estimatedCost?.estimatedTotal || 0),
    0
  );

  const highSeverityCount = inspections.filter(
    (i) => i.diagnosis?.overallSeverity === "HIGH" || i.diagnosis?.overallSeverity === "CRITICAL"
  ).length;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div id="dashboard-view-root" className="space-y-6 pb-16">
      {/* Immersive Hero HUD Banner */}
      <section
        id="dashboard-hero-section"
        className="relative overflow-hidden bg-[#0a0c10] border border-white/5 p-6 sm:p-8"
      >
        {/* Background Dot Matrix Pattern */}
        <div className="absolute inset-0 bg-dot-matrix opacity-20 pointer-events-none" />
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono uppercase tracking-[0.2em] mb-4 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
              <span>Multi-Modal Neural Diagnostics Engine</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-light text-white tracking-tight leading-tight">
              Vehicle Collision <br className="hidden sm:inline" />
              <span className="font-bold text-cyan-400">
                Visual Inspection & Estimation Core
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl font-mono">
              Upload exterior impact imagery to localize damage zones, evaluate repair vs replace feasibility, and generate comprehensive workshop parts & labor estimates in seconds.
            </p>

            {/* Action CTAs */}
            <div className="mt-6 flex flex-wrap items-center gap-3.5">
              <button
                id="hero-analyze-vehicle-primary-btn"
                type="button"
                onClick={() => onStartInspection()}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/25 font-bold text-xs uppercase tracking-widest shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4 stroke-[2.5]" />
                <span>+ Run New Diagnostic Scan</span>
              </button>

              <button
                id="hero-try-demo-mustang-btn"
                type="button"
                onClick={onQuickDemoMustang}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#050608] hover:bg-white/5 text-zinc-300 border border-white/10 hover:border-cyan-500/30 text-xs font-mono font-semibold uppercase tracking-wider transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Simulate Mustang GT Demo</span>
              </button>
            </div>
          </div>

          {/* Immersive HUD Telemetry Card Preview */}
          <div className="w-full lg:w-84 bg-[#050608] border border-white/10 p-5 shadow-2xl relative">
            <div className="absolute top-2 left-2 p-1 border-l-2 border-t-2 border-cyan-500/40" />
            <div className="flex items-center justify-between border-b border-white/5 pb-2.5 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-[10px] font-mono font-bold tracking-widest text-cyan-400 uppercase">
                  ACTIVE BENCHMARK
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase px-2 py-0.5 bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                STABLE
              </span>
            </div>

            <div className="flex items-center gap-3.5 mb-3">
              <div className="w-14 h-14 bg-[#0a0c10] border border-white/10 flex-shrink-0 overflow-hidden relative">
                <img
                  src={DEMO_VEHICLES[0].thumbnailUrl}
                  alt="Mustang Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="text-[10px] text-zinc-500 font-mono">2024 FORD</div>
                <h2 className="text-sm font-bold text-white leading-tight font-sans">
                  Mustang GT 5.0L
                </h2>
                <div className="mt-1 flex items-center gap-2 text-[10px] font-mono">
                  <span className="text-amber-400 font-bold">MODERATE</span>
                  <span className="text-zinc-600">•</span>
                  <span className="text-cyan-300 font-bold">₹2,26,000 Est.</span>
                </div>
              </div>
            </div>

            <button
              id="hero-view-mustang-demo-report-btn"
              type="button"
              onClick={onQuickDemoMustang}
              className="w-full py-2 px-3 bg-white/5 hover:bg-cyan-500/15 text-cyan-300 border border-white/10 hover:border-cyan-500/40 text-[10px] font-mono font-bold uppercase tracking-widest flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Inspect Full Telemetry</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </section>

      {/* Immersive UI Telemetry & System Grid */}
      <section className="grid grid-cols-12 gap-1 p-1 bg-white/5">
        {/* Left Col (3 cols): Engine & System Health */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-1">
          <div className="bg-[#0a0c10] p-5 border border-white/5 flex-1">
            <h3 className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest mb-4 font-mono">
              Diagnostic Health Matrix
            </h3>
            <div className="space-y-4 text-xs font-mono">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-zinc-500 text-[10px] uppercase">Chassis Deformation</span>
                  <span className="text-cyan-400 font-bold">42%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[42%] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-zinc-500 text-[10px] uppercase">Mounting Integrity</span>
                  <span className="text-cyan-400 font-bold">65%</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[65%] bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.4)]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1.5 text-amber-400">
                  <span className="text-zinc-500 text-[10px] uppercase">ADAS Sensor Array</span>
                  <span className="font-bold">Marginal</span>
                </div>
                <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full w-[88%] bg-amber-400" />
                </div>
              </div>
            </div>

            {/* Stepped Gauge Visualizer */}
            <div className="mt-6 pt-5 border-t border-white/5">
              <div className="flex items-center justify-between font-mono">
                <span className="text-[10px] uppercase text-zinc-500">Pipeline Volume</span>
                <span className="text-sm font-bold text-white">{formatCurrency(totalEstimatedValue)}</span>
              </div>
              <div className="flex gap-1 mt-2.5">
                <div className="h-6 flex-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                <div className="h-6 flex-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                <div className="h-6 flex-1 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
                <div className="h-6 flex-1 bg-cyan-400/30" />
                <div className="h-6 flex-1 bg-cyan-400/20" />
                <div className="h-6 flex-1 bg-cyan-400/20" />
                <div className="h-6 flex-1 bg-cyan-400/20" />
              </div>
            </div>
          </div>

          <div className="bg-[#0a0c10] p-5 border border-white/5">
            <h3 className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest mb-3 font-mono">
              Parts Replacement Ratio
            </h3>
            <div className="flex items-end gap-1.5 h-16">
              <div className="flex-1 bg-cyan-500/20 h-[40%]" />
              <div className="flex-1 bg-cyan-500/20 h-[60%]" />
              <div className="flex-1 bg-cyan-500/20 h-[55%]" />
              <div className="flex-1 bg-cyan-500/20 h-[80%]" />
              <div className="flex-1 bg-cyan-500/20 h-[90%]" />
              <div className="flex-1 bg-cyan-400 h-[70%] shadow-[0_0_12px_rgba(34,211,238,0.5)]" />
            </div>
            <div className="mt-3 flex justify-between font-mono text-[10px] text-zinc-500 uppercase">
              <span>REPAIR: 64%</span>
              <span className="text-cyan-400">REPLACE: 36%</span>
            </div>
          </div>
        </div>

        {/* Center Col (6 cols): Wireframe Telemetry & Chassis Map */}
        <div className="col-span-12 lg:col-span-6 relative bg-[#0a0c10] border border-white/5 flex flex-col items-center justify-center p-6 overflow-hidden min-h-[360px]">
          <div className="absolute inset-0 bg-dot-matrix opacity-10 pointer-events-none" />

          <div className="absolute top-4 left-4 p-3 border-l-2 border-t-2 border-cyan-500/40 font-mono text-left">
            <span className="text-[10px] uppercase text-zinc-500 block mb-0.5">Scanned Target</span>
            <span className="text-sm font-bold text-white">FORD MUSTANG GT</span>
          </div>

          <div className="absolute top-4 right-4 text-right font-mono text-[10px]">
            <span className="text-zinc-500 block">IMPACT ZONE</span>
            <span className="text-cyan-400 font-bold">FRONT-RIGHT CORNER</span>
          </div>

          {/* SVG Vehicle Wireframe Outline */}
          <div className="relative w-full max-w-[420px] h-[200px] flex items-center justify-center my-4">
            <svg className="w-full h-full opacity-60" viewBox="0 0 200 100" fill="none" stroke="currentColor" strokeWidth="0.75">
              <path d="M30 40 L170 40 L180 50 L180 70 L170 80 L30 80 L20 70 L20 50 Z" className="text-cyan-400" strokeDasharray="3 2" />
              <circle cx="45" cy="35" r="7" className="text-white/20" />
              <circle cx="45" cy="85" r="7" className="text-white/20" />
              <circle cx="155" cy="35" r="7" className="text-white/20" />
              <circle cx="155" cy="85" r="7" className="text-white/20" />
              <path d="M80 50 L120 50 L120 70 L80 70 Z" fill="rgba(34,211,238,0.12)" stroke="currentColor" />
            </svg>

            {/* Impact Reticle */}
            <div className="absolute top-[48%] right-[22%] w-4 h-4 bg-red-500 rounded-full animate-ping opacity-75" />
            <div className="absolute top-[48%] right-[22%] w-3 h-3 bg-red-500 rounded-full shadow-[0_0_15px_#ef4444]" />
          </div>

          {/* Bottom Telemetry Gauges */}
          <div className="w-full pt-4 border-t border-white/5 flex items-center justify-between font-mono text-center">
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Tire Integrity</div>
              <div className="text-base font-bold text-white mt-0.5">32.4 <span className="text-[9px] text-zinc-500 font-normal">PSI</span></div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Fascia Wear</div>
              <div className="text-base font-bold text-amber-400 mt-0.5">85% <span className="text-[9px] text-zinc-500 font-normal">DMG</span></div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 uppercase">Alignment</div>
              <div className="text-base font-bold text-emerald-400 mt-0.5">0.04° <span className="text-[9px] text-zinc-500 font-normal">DEV</span></div>
            </div>
          </div>
        </div>

        {/* Right Col (3 cols): Active Faults & Live Telemetry Stream */}
        <div className="col-span-12 lg:col-span-3 flex flex-col gap-1">
          <div className="flex-1 bg-[#0a0c10] p-5 border border-white/5">
            <h3 className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest mb-3 font-mono">
              Active Faults (2)
            </h3>
            <div className="space-y-3 text-xs">
              <div className="p-3 bg-red-500/10 border border-red-500/30">
                <div className="flex justify-between items-start mb-1 font-mono">
                  <span className="text-[11px] font-bold text-red-400">P0300 / B1001</span>
                  <span className="text-[8px] opacity-60 uppercase bg-red-950 px-1 py-0.5 text-red-300">CRITICAL</span>
                </div>
                <p className="text-[11px] font-medium text-zinc-200 leading-tight">
                  Front Bumper Fascia & Impact Bracket Fractured
                </p>
              </div>

              <div className="p-3 bg-amber-500/10 border border-amber-500/30">
                <div className="flex justify-between items-start mb-1 font-mono">
                  <span className="text-[11px] font-bold text-amber-400">B1204</span>
                  <span className="text-[8px] opacity-60 uppercase bg-amber-950 px-1 py-0.5 text-amber-300">WARNING</span>
                </div>
                <p className="text-[11px] font-medium text-zinc-200 leading-tight">
                  Ultrasonic Parking Sensor Array High Resistance
                </p>
              </div>
            </div>
          </div>

          <div className="flex-1 bg-[#0a0c10] p-5 border border-white/5">
            <h3 className="text-[11px] text-cyan-400 font-bold uppercase tracking-widest mb-3 font-mono">
              Live Telemetry Stream
            </h3>
            <div className="font-mono text-[10px] leading-relaxed text-zinc-400 space-y-1.5">
              <div className="flex justify-between"><span className="text-zinc-500">[14:22:01]</span> <span className="text-emerald-400 font-bold">OK</span></div>
              <p className="text-zinc-300">IMAGE_MULTIMODAL_PARSED</p>
              <div className="flex justify-between"><span className="text-zinc-500">[14:22:05]</span> <span className="text-emerald-400 font-bold">OK</span></div>
              <p className="text-zinc-300">OEM_PARTS_MATCH_COMPLETE</p>
              <div className="flex justify-between"><span className="text-zinc-500">[14:23:12]</span> <span className="text-red-400 font-bold">ERR</span></div>
              <p className="text-zinc-300">BRACKET_FATIGUE_FLAGGED</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Vehicle Showcase */}
      <section id="dashboard-demo-vehicles-section" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-[0.2em] font-mono flex items-center gap-2">
              <Car className="w-4 h-4 text-cyan-400" />
              <span>Diagnostic Benchmark Showcase</span>
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {DEMO_VEHICLES.map((vehicle) => (
            <div
              key={vehicle.id}
              id={`demo-card-${vehicle.id}`}
              onClick={() => onSelectVehicleDemo(vehicle)}
              className="group bg-[#0a0c10] border border-white/5 hover:border-cyan-500/40 p-3 flex flex-col justify-between transition-all cursor-pointer hover:shadow-[0_0_15px_rgba(34,211,238,0.15)]"
            >
              <div className="relative aspect-video w-full overflow-hidden mb-3 bg-[#050608] border border-white/5">
                <img
                  src={vehicle.thumbnailUrl}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 text-[9px] font-mono font-semibold uppercase bg-[#050608]/90 text-cyan-400 border border-white/10">
                  {vehicle.year}
                </span>
                {vehicle.id === "veh-mustang-001" && (
                  <span className="absolute top-1.5 right-1.5 px-1.5 py-0.5 text-[9px] font-mono font-bold uppercase bg-amber-400 text-black">
                    PRIMARY DEMO
                  </span>
                )}
              </div>

              <div>
                <h3 className="text-xs font-bold text-white group-hover:text-cyan-300 transition-colors truncate font-sans">
                  {vehicle.make} {vehicle.model}
                </h3>
                <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-mono">{vehicle.color}</p>
                <div className="mt-2 text-[9px] font-mono text-zinc-500 flex items-center justify-between border-t border-white/5 pt-2">
                  <span>{vehicle.registrationNumber}</span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-0.5 uppercase tracking-wider">
                    Scan <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
