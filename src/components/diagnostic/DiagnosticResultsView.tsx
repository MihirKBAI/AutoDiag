import React, { useState } from "react";
import {
  Car,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Printer,
  Save,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Info,
  DollarSign,
  Layers,
  Wrench,
  Cpu,
  ChevronRight,
  Maximize2,
  ListFilter,
  CheckSquare,
  Square,
  HelpCircle,
  TrendingUp,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  AffectedPart,
  DamageArea,
  InspectionRecord,
  PartAction,
  PartCondition,
  Recommendation,
  VehicleDiagnosis,
  VehicleRecord,
} from "../../types";
import { SeverityBadge } from "../common/SeverityBadge";
import { ConfidenceBadge } from "../common/ConfidenceBadge";
import { SafeVehicleImage } from "../common/SafeVehicleImage";
import { DemoModeBanner } from "../common/DemoModeBanner";

interface DiagnosticResultsViewProps {
  vehicle: VehicleRecord;
  diagnosis: VehicleDiagnosis;
  imageUrl?: string | null;
  onGenerateReport: () => void;
  onSaveToHistory: (verifiedChecklist: string[]) => void;
  onStartNewInspection: () => void;
  isSaved?: boolean;
}

export const DiagnosticResultsView: React.FC<DiagnosticResultsViewProps> = ({
  vehicle,
  diagnosis,
  imageUrl,
  onGenerateReport,
  onSaveToHistory,
  onStartNewInspection,
  isSaved = false,
}) => {
  const [selectedDamageArea, setSelectedDamageArea] = useState<number | null>(0);
  const [partsViewMode, setPartsViewMode] = useState<"table" | "cards">("table");
  const [checkedListItems, setCheckedListItems] = useState<Set<string>>(
    new Set([
      "Inspect bumper mounting brackets for micro-fractures before mounting new fascia.",
      "Check radiator and AC condenser area for fin bending or fluid seepage.",
    ])
  );

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const toggleChecklistItem = (item: string) => {
    const next = new Set(checkedListItems);
    if (next.has(item)) {
      next.delete(item);
    } else {
      next.add(item);
    }
    setCheckedListItems(next);
  };

  const handleSaveAction = () => {
    onSaveToHistory(Array.from(checkedListItems));
    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  // Group recommendations into priority tiers
  const priority1 = diagnosis.recommendations.filter((r) => r.priority === "HIGH");
  const priority2 = diagnosis.recommendations.filter((r) => r.priority === "MEDIUM");
  const priority3 = diagnosis.recommendations.filter((r) => r.priority === "LOW");

  return (
    <div id="diagnostic-results-view" className="space-y-8 pb-20 max-w-7xl mx-auto">
      {/* Demo Banner if active */}
      {diagnosis.isDemoData && (
        <DemoModeBanner
          vehicleName={`${vehicle.make} ${vehicle.model}`}
          onSwitchToReal={onStartNewInspection}
        />
      )}

      {/* Top Header Card */}
      <section
        id="results-header-card"
        className="relative overflow-hidden rounded-2xl bg-zinc-950 border border-zinc-800/90 p-5 sm:p-7 shadow-2xl"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded border border-cyan-500/30">
                DIAGNOSTIC REPORT
              </span>
              <SeverityBadge severity={diagnosis.overallSeverity} size="md" />
              <ConfidenceBadge confidence={diagnosis.confidence} size="md" />
              {diagnosis.isDemoData && (
                <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  DEMO DATA
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {vehicle.make} {vehicle.model}
              {vehicle.year ? <span className="text-zinc-400 font-normal ml-2">({vehicle.year})</span> : null}
            </h1>

            <p className="text-sm text-cyan-300/90 font-medium mt-1">
              {diagnosis.damageSummary || `${diagnosis.impactZone || "Exterior"} — preliminary visual assessment`}
            </p>

            {/* Vehicle Metadata Strip */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-zinc-400 font-mono">
              <span>
                REG: <strong className="text-zinc-200">{vehicle.registrationNumber || "DL-01-AB-9800"}</strong>
              </span>
              <span>•</span>
              <span>
                VIN: <strong className="text-zinc-200">{vehicle.vin || "DEMO-001"}</strong>
              </span>
              <span>•</span>
              <span>
                ODOMETER: <strong className="text-zinc-200">{vehicle.mileage?.toLocaleString() || "14,200"} km</strong>
              </span>
              {vehicle.customerName && (
                <>
                  <span>•</span>
                  <span>
                    CUSTOMER: <strong className="text-zinc-200">{vehicle.customerName}</strong>
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Quick Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end border-t lg:border-t-0 border-zinc-800/80 pt-4 lg:pt-0">
            <button
              id="results-save-history-btn"
              type="button"
              onClick={handleSaveAction}
              className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isSaved
                  ? "bg-emerald-950/80 text-emerald-300 border border-emerald-500/40"
                  : "bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 hover:border-zinc-500"
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaved ? "Saved to History" : "Save Inspection"}</span>
            </button>

            <button
              id="results-generate-report-btn"
              type="button"
              onClick={onGenerateReport}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-zinc-950 font-bold text-xs tracking-wide uppercase flex items-center gap-2 shadow-[0_0_20px_rgba(6,182,212,0.3)] cursor-pointer transition-all"
            >
              <FileText className="w-4 h-4 stroke-[2.5]" />
              <span>Generate Diagnostic Report</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid: Damage Visualizer & Detected Areas Cards */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Interactive Damage Image Visualizer */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-4 sm:p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>Damage Visualizer & Regional Pinpoints</span>
              </h3>
              <span className="text-[11px] font-mono text-zinc-400">
                {diagnosis.damageAreas.length} detected damage zones
              </span>
            </div>

            {/* Interactive Image Container with Pin Overlays */}
            <div className="relative rounded-xl overflow-hidden bg-black border border-zinc-800 group">
              <SafeVehicleImage
                src={imageUrl}
                alt="Analyzed damaged vehicle"
                aspectRatio="video"
                enableZoom={true}
                placeholderText="Damage photographic evidence preview"
                overlayChildren={
                  <div className="absolute inset-0 pointer-events-none">
                    {/* Render Interactive Pinpoints */}
                    {diagnosis.damageAreas.map((area, idx) => {
                      const coords = area.markerCoords || {
                        x: 30 + (idx * 15) % 50,
                        y: 40 + (idx * 12) % 40,
                      };
                      const isSelected = selectedDamageArea === idx;

                      return (
                        <div
                          key={idx}
                          style={{ left: `${coords.x}%`, top: `${coords.y}%` }}
                          className="absolute pointer-events-auto -translate-x-1/2 -translate-y-1/2"
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedDamageArea(idx)}
                            className={`group/pin relative flex items-center justify-center cursor-pointer transition-transform ${
                              isSelected ? "scale-125 z-20" : "hover:scale-110 z-10"
                            }`}
                            title={`${area.area} (${area.confidence}%)`}
                          >
                            <span
                              className={`absolute w-8 h-8 rounded-full opacity-60 animate-ping ${
                                area.severity === "HIGH" || area.severity === "CRITICAL"
                                  ? "bg-red-500"
                                  : "bg-cyan-400"
                              }`}
                            />
                            <span
                              className={`relative flex items-center justify-center w-7 h-7 rounded-full font-mono text-xs font-extrabold text-zinc-950 border-2 border-white shadow-lg ${
                                isSelected
                                  ? "bg-cyan-300 ring-4 ring-cyan-500/40"
                                  : area.severity === "HIGH" || area.severity === "CRITICAL"
                                  ? "bg-red-400"
                                  : "bg-amber-400"
                              }`}
                            >
                              {idx + 1}
                            </span>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                }
              />
            </div>

            <p className="text-[11px] text-zinc-500 italic">
              * Markers indicate computer-vision localized regions of interest. Click any numbered pin to inspect findings.
            </p>
          </div>
        </div>

        {/* Right (5 cols): Damage Analysis Cards */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Detected Damage Areas</span>
            </h3>
            <span className="text-[11px] font-mono text-zinc-500">
              Click to highlight
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {diagnosis.damageAreas.map((area, idx) => {
              const isSelected = selectedDamageArea === idx;
              return (
                <div
                  key={idx}
                  id={`damage-area-card-${idx}`}
                  onClick={() => setSelectedDamageArea(idx)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-zinc-900 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.15)] ring-1 ring-cyan-500/30"
                      : "bg-zinc-950/80 border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-900/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-full bg-zinc-800 text-cyan-400 font-mono text-xs font-bold flex items-center justify-center flex-shrink-0 border border-zinc-700">
                        {idx + 1}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-white leading-tight">
                        {area.area}
                      </h4>
                    </div>
                    <SeverityBadge severity={area.severity} size="sm" />
                  </div>

                  <div className="text-xs text-zinc-300 font-medium mb-1.5 pl-8.5">
                    {area.damageType}
                  </div>

                  <p className="text-[11px] text-zinc-400 leading-relaxed pl-8.5 mb-2">
                    {area.explanation}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-zinc-900 pl-8.5 text-[11px] font-mono">
                    <span className="text-zinc-500">AI Confidence</span>
                    <span className="text-cyan-300 font-semibold">{area.confidence}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Affected Parts Intelligence Table */}
      <section id="results-affected-parts-section" className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Wrench className="w-4 h-4 text-cyan-400" />
              <span>Affected Vehicle Parts Intelligence</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Preliminary component condition, recommended workshop action, and estimated part cost in INR.
            </p>
          </div>

          {/* Table vs Cards switcher */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900 rounded-lg border border-zinc-800 text-xs font-medium">
            <button
              type="button"
              onClick={() => setPartsViewMode("table")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                partsViewMode === "table" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Table View
            </button>
            <button
              type="button"
              onClick={() => setPartsViewMode("cards")}
              className={`px-3 py-1 rounded-md transition-colors cursor-pointer ${
                partsViewMode === "cards" ? "bg-zinc-800 text-white font-semibold" : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              Card View
            </button>
          </div>
        </div>

        {partsViewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-900/80 text-zinc-400 font-mono uppercase text-[10px] tracking-wider border-y border-zinc-800">
                <tr>
                  <th className="py-3 px-4">Component & Location</th>
                  <th className="py-3 px-4">Visual Condition</th>
                  <th className="py-3 px-4">Recommended Action</th>
                  <th className="py-3 px-4 text-center">Confidence</th>
                  <th className="py-3 px-4 text-right">Est. Part Cost (INR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900">
                {diagnosis.affectedParts.map((part, idx) => {
                  const getConditionStyle = (c: PartCondition) => {
                    switch (c) {
                      case "DAMAGED":
                        return "text-red-300 bg-red-950/60 border-red-500/40";
                      case "POSSIBLY_DAMAGED":
                        return "text-amber-300 bg-amber-950/60 border-amber-500/40";
                      case "INSPECTION_REQUIRED":
                        return "text-sky-300 bg-sky-950/60 border-sky-500/40";
                    }
                  };

                  const getActionBadge = (a: PartAction) => {
                    switch (a) {
                      case "REPLACE":
                        return "bg-rose-500/20 text-rose-300 border-rose-500/30";
                      case "REPAIR":
                        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30";
                      case "INSPECT":
                        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
                    }
                  };

                  return (
                    <tr key={idx} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="py-3.5 px-4 font-medium text-white">
                        <div>{part.partName}</div>
                        <div className="text-[11px] text-zinc-400 font-normal mt-0.5">
                          {part.location} {part.oemReference ? `• Ref: ${part.oemReference}` : ""}
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-mono font-semibold rounded border ${getConditionStyle(part.condition)}`}>
                          {part.condition.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex px-2 py-0.5 text-[10px] font-mono font-bold rounded border ${getActionBadge(part.action)}`}>
                          {part.action}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-cyan-300">
                        {part.confidence}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-zinc-100">
                        {formatCurrency(part.estimatedPartCost)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {diagnosis.affectedParts.map((part, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-white">{part.partName}</h4>
                  <span className="px-2 py-0.5 text-[10px] font-mono font-bold rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {part.action}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{part.location}</p>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-mono">
                  <span className="text-[10px] text-zinc-500">{part.condition.replace(/_/g, " ")}</span>
                  <span className="font-bold text-white">{formatCurrency(part.estimatedPartCost)}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-[11px] text-zinc-500 italic text-right">
          * Estimated market price for illustrative planning only. Actual OEM parts costs subject to variant and supplier.
        </div>
      </section>

      {/* Repair vs Replace Decision Matrix & Cost Breakdown (2 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left (7 cols): Repair vs. Replace Matrix */}
        <section className="lg:col-span-7 bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>Repair vs. Replace Feasibility Decision Flow</span>
          </h3>

          <div className="space-y-3">
            {diagnosis.affectedParts.slice(0, 4).map((part, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-zinc-900/70 border border-zinc-800 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">{part.partName}</span>
                  <span className="text-[10px] font-mono text-zinc-400">Confidence: {part.confidence}%</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono py-1">
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px]">DEFORMATION</span>
                    <span className="font-semibold text-zinc-200">{part.condition.replace(/_/g, " ")}</span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px]">REPAIRABLE?</span>
                    <span className={`font-semibold ${part.action === "REPAIR" ? "text-cyan-400" : "text-rose-400"}`}>
                      {part.action === "REPAIR" ? "YES (PDR/DENT)" : part.action === "REPLACE" ? "NO (REPLACE)" : "INSPECT"}
                    </span>
                  </div>
                  <div className="p-2 rounded bg-zinc-950 border border-zinc-800">
                    <span className="text-zinc-500 block text-[9px]">RECOMMENDED</span>
                    <span className="font-bold text-cyan-300">{part.action}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Right (5 cols): Cost Breakdown Engine */}
        <section className="lg:col-span-5 bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>Transparent Cost Engine</span>
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              ESTIMATE (INR)
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-zinc-900">
              <span className="text-zinc-400">Parts Subtotal ({diagnosis.affectedParts.length} components)</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(diagnosis.estimatedCost.partsCost)}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-900">
              <span className="text-zinc-400">Technician Labour (Denting, Paint, R&I)</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(diagnosis.estimatedCost.labourCost)}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-900">
              <span className="text-zinc-400">ADAS Radar & Optical Calibration</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(diagnosis.estimatedCost.calibrationCost)}</span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-zinc-900">
              <span className="text-zinc-400">Consumables & Fasteners</span>
              <span className="font-mono font-semibold text-white">{formatCurrency(diagnosis.estimatedCost.miscellaneousCost)}</span>
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-cyan-950/40 via-zinc-900 to-zinc-900 border border-cyan-500/40 mt-4">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-cyan-400 block">
                    TOTAL ESTIMATED COST
                  </span>
                  <span className="text-xs text-zinc-400 font-sans">Parts + Labour + Calibration</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl sm:text-3xl font-extrabold text-white font-mono tracking-tight">
                    {formatCurrency(diagnosis.estimatedCost.estimatedTotal)}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-zinc-500 leading-relaxed mt-2">
              * Illustrative estimate only. Actual parts, labour, taxes, and repair costs may vary by vehicle variant, workshop, location, and hidden structural damage.
            </p>
          </div>
        </section>
      </div>

      {/* Repair Priority Tiers (P1, P2, P3) */}
      <section className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <span>Repair Priority Tiers & Action Plan</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Priority 1 */}
          <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-wider">
                Priority 1: Safety Critical
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-500/20 text-red-300">
                {priority1.length} ITEMS
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {priority1.length > 0 ? (
                priority1.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <p className="font-semibold text-white">{p.action}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">{p.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-xs italic">No critical safety items flagged.</p>
              )}
            </div>
          </div>

          {/* Priority 2 */}
          <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                Priority 2: Functional
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">
                {priority2.length} ITEMS
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {priority2.length > 0 ? (
                priority2.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <p className="font-semibold text-white">{p.action}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">{p.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-xs italic">No functional repair items flagged.</p>
              )}
            </div>
          </div>

          {/* Priority 3 */}
          <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                Priority 3: Cosmetic
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                {priority3.length} ITEMS
              </span>
            </div>
            <div className="space-y-2 text-xs">
              {priority3.length > 0 ? (
                priority3.map((p, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-zinc-900/80 border border-zinc-800">
                    <p className="font-semibold text-white">{p.action}</p>
                    <p className="text-[11px] text-zinc-400 mt-1">{p.reason}</p>
                  </div>
                ))
              ) : (
                <p className="text-zinc-500 text-xs italic">No minor cosmetic items flagged.</p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Technician Inspection Checklist (Interactive Hoist Validation) */}
      <section id="technician-checklist-section" className="bg-zinc-950 border border-zinc-800/90 rounded-2xl p-5 sm:p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-zinc-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Suggested Technician Inspection Checklist</span>
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Suggested inspection points — technician verification required before releasing vehicle.
            </p>
          </div>
          <div className="text-xs font-mono text-zinc-400">
            {checkedListItems.size} of {diagnosis.technicianNotes.length} Verified
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {diagnosis.technicianNotes.map((note, idx) => {
            const isChecked = checkedListItems.has(note);
            return (
              <div
                key={idx}
                onClick={() => toggleChecklistItem(note)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                  isChecked
                    ? "bg-emerald-950/20 border-emerald-500/40 text-emerald-200"
                    : "bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 text-zinc-300"
                }`}
              >
                <button
                  type="button"
                  className="mt-0.5 text-emerald-400 flex-shrink-0 cursor-pointer"
                  aria-label={isChecked ? "Uncheck item" : "Check item"}
                >
                  {isChecked ? (
                    <CheckSquare className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Square className="w-4 h-4 text-zinc-500" />
                  )}
                </button>
                <div className="text-xs leading-relaxed">
                  <span className={isChecked ? "line-through text-zinc-400" : "font-medium text-zinc-200"}>
                    {note}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Safety & Mechanical Boundary Disclaimer */}
      <footer className="p-4 rounded-xl bg-zinc-900/70 border border-zinc-800 text-[11px] text-zinc-400 leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-zinc-200 block mb-0.5">Non-Negotiable Diagnostic Boundary:</strong>
          AutoSight AI provides preliminary visual analysis and repair estimates for assistance only. It does not replace a qualified automotive technician, physical inspection, OBD diagnostics, structural measurement, or manufacturer service procedures. Hidden mechanical or structural damage may not be visible in photographs.
        </div>
      </footer>
    </div>
  );
};
