import React, { useState } from "react";
import {
  History,
  Search,
  Filter,
  Car,
  FileText,
  Trash2,
  ChevronRight,
  Sparkles,
  Calendar,
  AlertCircle,
  PlusCircle,
  ExternalLink,
} from "lucide-react";
import { InspectionRecord, SeverityLevel } from "../../types";
import { SeverityBadge } from "../common/SeverityBadge";
import { ConfidenceBadge } from "../common/ConfidenceBadge";

interface InspectionHistoryViewProps {
  inspections: InspectionRecord[];
  onSelectInspection: (record: InspectionRecord) => void;
  onDeleteInspection: (id: string) => void;
  onNewInspection: () => void;
}

export const InspectionHistoryView: React.FC<InspectionHistoryViewProps> = ({
  inspections,
  onSelectInspection,
  onDeleteInspection,
  onNewInspection,
}) => {
  const [searchFilter, setSearchFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState<string>("ALL");

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const filteredInspections = inspections.filter((rec) => {
    const q = searchFilter.toLowerCase().trim();
    const matchesSearch =
      !q ||
      rec.inspectionId.toLowerCase().includes(q) ||
      rec.vehicle.make.toLowerCase().includes(q) ||
      rec.vehicle.model.toLowerCase().includes(q) ||
      (rec.vehicle.registrationNumber && rec.vehicle.registrationNumber.toLowerCase().includes(q)) ||
      (rec.vehicle.vin && rec.vehicle.vin.toLowerCase().includes(q));

    const matchesSeverity =
      severityFilter === "ALL" ||
      rec.diagnosis.overallSeverity === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  return (
    <div id="inspection-history-view" className="space-y-6 pb-20 max-w-6xl mx-auto">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <History className="w-6 h-6 text-cyan-400" />
            <span>Inspection Logs & History</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Comprehensive archive of all vehicle diagnostic scans, severity classifications, and estimated repair values.
          </p>
        </div>

        <button
          id="history-start-new-inspection-btn"
          type="button"
          onClick={onNewInspection}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-zinc-950 font-bold text-xs tracking-wide uppercase transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>New Inspection</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-zinc-950 border border-zinc-800/80 rounded-xl">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by ID, Make, Model, Reg, VIN..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-mono text-zinc-500 mr-1 hidden sm:inline">SEVERITY:</span>
          {["ALL", "CRITICAL", "HIGH", "MODERATE", "LOW"].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-colors cursor-pointer whitespace-nowrap ${
                severityFilter === sev
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800"
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Inspection List or Empty State */}
      {filteredInspections.length === 0 ? (
        <div className="p-12 text-center bg-zinc-950 border border-zinc-800 rounded-2xl space-y-4">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto text-zinc-500">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">No vehicle inspections found</h3>
            <p className="text-xs text-zinc-400 mt-1">
              {searchFilter || severityFilter !== "ALL"
                ? "Try adjusting your search query or severity filter."
                : "Upload your first vehicle image to generate an AI diagnostic scan."}
            </p>
          </div>
          <button
            type="button"
            onClick={onNewInspection}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 text-xs font-bold transition-colors cursor-pointer"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.5]" />
            <span>Analyze your first vehicle</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredInspections.map((record) => (
            <div
              key={record.inspectionId}
              id={`history-row-${record.inspectionId}`}
              className="group bg-zinc-950 border border-zinc-800/80 hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all shadow-md hover:shadow-xl"
            >
              {/* Thumbnail & Vehicle Details */}
              <div
                className="flex items-center gap-4 cursor-pointer flex-1"
                onClick={() => onSelectInspection(record)}
              >
                <div className="w-20 h-16 rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800 flex-shrink-0 relative">
                  <img
                    src={record.primaryImageUrl || record.vehicle.thumbnailUrl}
                    alt={record.vehicle.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  {record.diagnosis.isDemoData && (
                    <span className="absolute bottom-1 right-1 px-1 py-0.2 text-[8px] font-mono font-bold rounded bg-amber-500 text-zinc-950">
                      DEMO
                    </span>
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {record.inspectionId}
                    </span>
                    <span className="text-zinc-600">•</span>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {record.vehicle.make} {record.vehicle.model}
                    </h3>
                    {record.vehicle.year && (
                      <span className="text-xs text-zinc-500">({record.vehicle.year})</span>
                    )}
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-1">
                    {record.diagnosis?.damageSummary || "Front impact collision visual scan"}
                  </p>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-mono text-zinc-500">
                    <span>
                      REG: <strong className="text-zinc-300">{record.vehicle.registrationNumber || "N/A"}</strong>
                    </span>
                    <span>•</span>
                    <span>
                      DATE: {new Date(record.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Severity & Cost & Actions */}
              <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto border-t md:border-t-0 border-zinc-900 pt-3 md:pt-0">
                <div className="text-left md:text-right">
                  <SeverityBadge severity={record.diagnosis.overallSeverity} size="sm" />
                  <div className="text-sm font-mono font-bold text-white mt-1">
                    {formatCurrency(record.diagnosis?.estimatedCost?.estimatedTotal || 0)}
                    <span className="text-[10px] text-zinc-500 font-sans font-normal ml-1">estimated</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onSelectInspection(record)}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-cyan-300 border border-zinc-700 hover:border-cyan-500/50 text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors"
                    title="View Detailed Diagnostic Report"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">View Report</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (confirm(`Delete inspection record ${record.inspectionId}?`)) {
                        onDeleteInspection(record.inspectionId);
                      }
                    }}
                    className="p-2 rounded-lg bg-zinc-900 hover:bg-red-950/60 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/40 transition-colors cursor-pointer"
                    title="Delete Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
