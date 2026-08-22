import React from "react";
import {
  Printer,
  FileText,
  Car,
  CheckCircle2,
  AlertTriangle,
  ArrowLeft,
  Wrench,
  ShieldCheck,
  Calendar,
  Clock,
  Sparkles,
  Download,
} from "lucide-react";
import { GarageProfile, InspectionRecord } from "../../types";
import { SeverityBadge } from "../common/SeverityBadge";
import { ConfidenceBadge } from "../common/ConfidenceBadge";

interface ReportViewerProps {
  inspection: InspectionRecord;
  garageProfile: GarageProfile;
  onBack: () => void;
}

export const ReportViewer: React.FC<ReportViewerProps> = ({
  inspection,
  garageProfile,
  onBack,
}) => {
  const { vehicle, diagnosis, inspectionId, createdAt, primaryImageUrl } = inspection;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="report-viewer-root" className="max-w-5xl mx-auto space-y-6 pb-20">
      {/* Top Toolbar (Hidden during print) */}
      <div className="flex items-center justify-between print:hidden bg-zinc-950 border border-zinc-800 p-4 rounded-xl shadow-lg">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold border border-zinc-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Interactive Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
          >
            <Printer className="w-4 h-4 stroke-[2.5]" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Document Container */}
      <div
        id="printable-diagnostic-report"
        className="bg-white text-zinc-900 p-8 sm:p-12 rounded-2xl shadow-2xl border border-zinc-200 print:border-none print:shadow-none print:p-0 print:m-0 print:rounded-none"
      >
        {/* Document Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-zinc-900 pb-6 mb-6 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="flex items-center justify-center w-7 h-7 rounded bg-zinc-900 text-cyan-400 font-bold text-sm">
                AS
              </div>
              <span className="text-xl font-extrabold tracking-tight text-zinc-900 font-sans">
                AUTOSIGHT AI
              </span>
              <span className="text-[10px] font-mono font-bold uppercase bg-zinc-100 text-zinc-700 px-1.5 py-0.5 rounded border border-zinc-300">
                OFFICIAL WORKSHOP REPORT
              </span>
            </div>
            <p className="text-xs text-zinc-600 font-medium">{garageProfile.name}</p>
            <p className="text-[11px] text-zinc-500">{garageProfile.address}</p>
            <p className="text-[11px] text-zinc-500">
              Tel: {garageProfile.phone} • GSTIN: {garageProfile.taxRegistrationNumber}
            </p>
          </div>

          <div className="text-left sm:text-right font-mono">
            <div className="text-sm font-bold text-zinc-900">
              REPORT ID: <span className="text-cyan-700">{inspectionId}</span>
            </div>
            <div className="text-xs text-zinc-600 mt-0.5">
              DATE: {new Date(createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </div>
            <div className="text-xs text-zinc-600">
              TIME: {new Date(createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </div>
            <div className="text-xs text-zinc-500 mt-1 font-sans">
              Lead Specialist: <strong>{garageProfile.technicianName}</strong>
            </div>
          </div>
        </header>

        {/* Vehicle & Customer Identification Bar */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-200 mb-6 text-xs">
          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-mono">Vehicle</span>
            <strong className="text-zinc-900 text-sm font-bold block">
              {vehicle.make} {vehicle.model}
            </strong>
            <span className="text-zinc-600">Year: {vehicle.year || 2024}</span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-mono">Registration #</span>
            <strong className="text-zinc-900 font-mono font-bold text-sm block">
              {vehicle.registrationNumber || "DL-01-AB-9800"}
            </strong>
            <span className="text-zinc-600 font-mono text-[11px]">VIN: {vehicle.vin || "DEMO-001"}</span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-mono">Customer / Job</span>
            <strong className="text-zinc-900 block font-semibold">
              {vehicle.customerName || "Walk-in Customer"}
            </strong>
            <span className="text-zinc-600 font-mono text-[11px]">
              Odo: {vehicle.mileage?.toLocaleString() || "14,200"} km
            </span>
          </div>

          <div>
            <span className="text-zinc-500 block text-[10px] uppercase font-mono">Overall Severity</span>
            <div className="mt-1">
              <span
                className={`inline-block px-2.5 py-1 text-xs font-mono font-bold rounded ${
                  diagnosis.overallSeverity === "CRITICAL"
                    ? "bg-red-100 text-red-800 border border-red-300"
                    : diagnosis.overallSeverity === "HIGH"
                    ? "bg-orange-100 text-orange-800 border border-orange-300"
                    : diagnosis.overallSeverity === "MODERATE"
                    ? "bg-amber-100 text-amber-800 border border-amber-300"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                }`}
              >
                {diagnosis.overallSeverity} SEVERITY
              </span>
            </div>
          </div>
        </section>

        {/* Photographic Evidence + Key Findings */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-6">
          <div className="md:col-span-5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono mb-2">
              Photographic Evidence
            </h3>
            <div className="rounded-xl overflow-hidden border border-zinc-300 bg-zinc-100 aspect-video">
              <img
                src={primaryImageUrl || vehicle.thumbnailUrl}
                alt="Damage inspection record"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-2 text-[10px] font-mono text-zinc-500 flex justify-between">
              <span>AI Vision Conf: {diagnosis.confidence}%</span>
              <span>Model: Gemini 3.7 Vision</span>
            </div>
          </div>

          <div className="md:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono mb-2">
              Preliminary Damage Findings
            </h3>
            <div className="p-3.5 rounded-xl bg-zinc-50 border border-zinc-200 text-xs leading-relaxed text-zinc-800">
              <p className="font-semibold text-zinc-900 mb-1">
                {diagnosis.damageSummary || "Exterior impact deformation and component alignment disruption."}
              </p>
              <ul className="list-disc list-inside space-y-1 text-zinc-600 text-[11px] mt-2">
                {diagnosis.damageAreas.map((area, idx) => (
                  <li key={idx}>
                    <strong className="text-zinc-900">{area.area}:</strong> {area.damageType} ({area.confidence}% conf)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Affected Parts Schedule */}
        <section className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-700 font-mono mb-2">
            Affected Vehicle Parts & Actions Schedule
          </h3>
          <table className="w-full text-left text-xs border border-zinc-300">
            <thead className="bg-zinc-100 text-zinc-700 font-mono uppercase text-[10px] border-b border-zinc-300">
              <tr>
                <th className="py-2.5 px-3">Item #</th>
                <th className="py-2.5 px-3">Part Description</th>
                <th className="py-2.5 px-3">Location</th>
                <th className="py-2.5 px-3">Visual Status</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3 text-right">Est. Cost (INR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200">
              {diagnosis.affectedParts.map((part, idx) => (
                <tr key={idx} className="hover:bg-zinc-50">
                  <td className="py-2.5 px-3 font-mono text-zinc-500">{idx + 1}</td>
                  <td className="py-2.5 px-3 font-semibold text-zinc-900">{part.partName}</td>
                  <td className="py-2.5 px-3 text-zinc-600">{part.location}</td>
                  <td className="py-2.5 px-3 font-mono text-[11px]">{part.condition.replace(/_/g, " ")}</td>
                  <td className="py-2.5 px-3 font-mono font-bold text-zinc-900">{part.action}</td>
                  <td className="py-2.5 px-3 text-right font-mono font-semibold text-zinc-900">
                    {formatCurrency(part.estimatedPartCost)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Cost Summary & Priority Plan */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-200 text-xs space-y-2">
            <h4 className="font-bold text-zinc-900 uppercase font-mono text-[11px] mb-1">
              Priority Repair Recommendations
            </h4>
            <div className="space-y-1.5 text-[11px]">
              {diagnosis.recommendations.slice(0, 3).map((r, idx) => (
                <div key={idx} className="border-l-2 border-cyan-600 pl-2">
                  <span className="font-semibold text-zinc-900 block">{r.action}</span>
                  <span className="text-zinc-500">{r.reason}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-zinc-900 text-white text-xs space-y-2 font-mono">
            <h4 className="font-bold text-cyan-400 uppercase text-[11px] mb-2">
              Estimated Cost Breakdown (INR)
            </h4>
            <div className="flex justify-between text-zinc-300">
              <span>Parts Subtotal:</span>
              <span>{formatCurrency(diagnosis.estimatedCost.partsCost)}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Technician Labour:</span>
              <span>{formatCurrency(diagnosis.estimatedCost.labourCost)}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Calibration & Alignment:</span>
              <span>{formatCurrency(diagnosis.estimatedCost.calibrationCost)}</span>
            </div>
            <div className="flex justify-between text-zinc-300">
              <span>Consumables & Sundries:</span>
              <span>{formatCurrency(diagnosis.estimatedCost.miscellaneousCost)}</span>
            </div>
            <div className="border-t border-zinc-700 pt-2 flex justify-between text-sm font-bold text-white">
              <span>ESTIMATED TOTAL:</span>
              <span className="text-cyan-400">{formatCurrency(diagnosis.estimatedCost.estimatedTotal)}</span>
            </div>
          </div>
        </section>

        {/* Technician Checklist & Hoist Sign-off */}
        <section className="border-t border-zinc-300 pt-5 mb-6 text-xs">
          <h4 className="font-bold text-zinc-900 uppercase font-mono text-[11px] mb-2">
            Physical Inspection Sign-off & Verification Checklist
          </h4>
          <div className="grid grid-cols-2 gap-2 text-[11px] text-zinc-700 mb-4">
            {diagnosis.technicianNotes.slice(0, 4).map((note, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-3.5 h-3.5 border border-zinc-400 rounded-sm flex items-center justify-center font-mono text-[9px] text-zinc-800">
                  ✓
                </span>
                <span>{note}</span>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-8 pt-4 border-t border-dashed border-zinc-300">
            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-6">
                Diagnostic Technician Signature:
              </span>
              <div className="border-b border-zinc-900 w-48 mb-1" />
              <span className="text-xs font-semibold text-zinc-900">{garageProfile.technicianName}</span>
            </div>

            <div>
              <span className="text-[10px] text-zinc-500 uppercase font-mono block mb-6">
                Customer / Service Advisor Acknowledgment:
              </span>
              <div className="border-b border-zinc-900 w-48 mb-1" />
              <span className="text-xs font-semibold text-zinc-900">{vehicle.customerName || "Customer Representative"}</span>
            </div>
          </div>
        </section>

        {/* Legal Disclaimer Footer */}
        <footer className="border-t border-zinc-300 pt-4 text-[10px] text-zinc-500 leading-relaxed">
          <strong className="text-zinc-700">Notice & Disclaimer:</strong> This diagnostic estimate is generated utilizing AutoSight AI computer-vision intelligence from preliminary photographic data. It does not constitute a guaranteed mechanical repair quotation or manufacturer invoice. Dismantling and hoist evaluation may reveal additional hidden structural, electrical, or suspension damage.
        </footer>
      </div>
    </div>
  );
};
