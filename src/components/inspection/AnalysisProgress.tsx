import React, { useEffect, useState } from "react";
import {
  Scan,
  Cpu,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Activity,
  Layers,
  Wrench,
  Car,
} from "lucide-react";

interface AnalysisProgressProps {
  onComplete?: () => void;
  imageUrl?: string | null;
  vehicleName?: string;
  isRealApiCall?: boolean;
}

const ANALYSIS_STEPS = [
  { id: 1, label: "Reading vehicle image...", detail: "Validating resolution, contrast & image dimensions" },
  { id: 2, label: "Identifying vehicle...", detail: "Matching make, model & exterior body contours" },
  { id: 3, label: "Mapping visible damage...", detail: "Localizing impact zones, scrapes & deformations" },
  { id: 4, label: "Analyzing body panels...", detail: "Evaluating bumper, fender, headlamps & hood margins" },
  { id: 5, label: "Matching affected components...", detail: "Querying automotive parts catalog & OEM specs" },
  { id: 6, label: "Estimating repair severity...", detail: "Calculating repair vs replace feasibility & labor hours" },
  { id: 7, label: "Preparing diagnostic report...", detail: "Compiling cost estimates and safety checklists" },
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  onComplete,
  imageUrl,
  vehicleName = "Vehicle",
  isRealApiCall = false,
}) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [progressPercent, setProgressPercent] = useState(12);

  useEffect(() => {
    // Staged progression timer
    const stepInterval = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev < ANALYSIS_STEPS.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 850);

    const progressInterval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev < 98) {
          const increment = Math.floor(Math.random() * 8) + 4;
          return Math.min(98, prev + increment);
        }
        return prev;
      });
    }, 280);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const currentStep = ANALYSIS_STEPS[currentStepIndex];

  return (
    <div
      id="analysis-progress-overlay"
      className="max-w-3xl mx-auto my-8 p-6 sm:p-10 rounded-2xl bg-zinc-950/95 border border-cyan-500/40 shadow-[0_0_50px_rgba(6,182,212,0.2)] text-white relative overflow-hidden"
    >
      {/* Background Cyber Scanning Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(#083344_1px,transparent_1px)] [background-size:16px_16px] opacity-25" />
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />

      {/* Header Telemetry */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <Scan className="w-6 h-6 animate-pulse" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <span>AutoSight Multimodal Diagnostic Core</span>
            </h3>
            <p className="text-xs text-zinc-400 font-mono">
              Target: <span className="text-cyan-300 font-semibold">{vehicleName}</span> • Model: Gemini 3.7 Vision
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 font-mono text-xs">
          <Activity className="w-3.5 h-3.5 text-cyan-400 animate-spin" />
          <span className="text-zinc-400">STATUS:</span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
      </div>

      {/* Center Image Scanner Visualizer */}
      {imageUrl && (
        <div className="relative w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-black border border-zinc-800 mb-6 group">
          <img
            src={imageUrl}
            alt="Scanning Vehicle"
            className="w-full h-full object-cover object-center opacity-50 filter contrast-125"
          />

          {/* Animated Scanning Line */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="w-full h-1.5 bg-cyan-400 shadow-[0_0_20px_#22d3ee] animate-[bounce_2.5s_infinite]" />
            <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/15 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Optical Targeting Reticle */}
          <div className="absolute inset-4 border border-cyan-500/30 rounded-lg pointer-events-none flex flex-col justify-between p-3">
            <div className="flex justify-between text-[10px] font-mono text-cyan-400">
              <span>FOV: 84.2°</span>
              <span>GRID: AUTO-ALIGN</span>
            </div>
            <div className="flex justify-between text-[10px] font-mono text-cyan-400">
              <span>REGIONS: LOCATED</span>
              <span>CONFIDENCE: &gt; 90%</span>
            </div>
          </div>
        </div>
      )}

      {/* Active Phase Banner */}
      <div className="relative z-10 p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
          <div>
            <div className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-semibold">
              Phase {currentStepIndex + 1} of {ANALYSIS_STEPS.length}: {currentStep.label}
            </div>
            <p className="text-xs text-zinc-300 mt-0.5">{currentStep.detail}</p>
          </div>
        </div>
      </div>

      {/* Staged Checklist Steps */}
      <div className="space-y-2.5">
        {ANALYSIS_STEPS.map((step, idx) => {
          const isDone = idx < currentStepIndex;
          const isCurrent = idx === currentStepIndex;
          return (
            <div
              key={step.id}
              className={`flex items-center justify-between px-3.5 py-2 rounded-lg text-xs font-mono transition-all ${
                isDone
                  ? "bg-zinc-900/60 text-emerald-300 border border-emerald-500/20"
                  : isCurrent
                  ? "bg-cyan-950/60 text-cyan-200 border border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)] font-semibold"
                  : "bg-zinc-950/40 text-zinc-600 border border-zinc-900"
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isDone ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                ) : isCurrent ? (
                  <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse flex-shrink-0" />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border border-zinc-700 flex-shrink-0" />
                )}
                <span>{step.label}</span>
              </div>
              <span className="text-[10px]">
                {isDone ? "VERIFIED" : isCurrent ? "PROCESSING" : "QUEUED"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 mt-2">
          <span>NEURAL INFERENCE THREAD</span>
          <span>ESTIMATED LATENCY: 2.1s</span>
        </div>
      </div>
    </div>
  );
};
