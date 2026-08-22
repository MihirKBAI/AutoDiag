import React from "react";
import { Car, PlusCircle, Sparkles, ChevronRight, ShieldCheck, Wrench, Eye } from "lucide-react";
import { VehicleRecord } from "../../types";

interface VehicleRegistryViewProps {
  vehicles: VehicleRecord[];
  onSelectVehicleToInspect: (v: VehicleRecord) => void;
  onNewInspection: () => void;
}

export const VehicleRegistryView: React.FC<VehicleRegistryViewProps> = ({
  vehicles,
  onSelectVehicleToInspect,
  onNewInspection,
}) => {
  return (
    <div id="vehicle-registry-view" className="space-y-6 pb-20 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Car className="w-6 h-6 text-cyan-400" />
            <span>Vehicle Registry & Demo Showcase Fleet</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Registered vehicle models, demo benchmark profiles, and rapid inspection triggers.
          </p>
        </div>

        <button
          type="button"
          onClick={onNewInspection}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-zinc-950 font-bold text-xs tracking-wide uppercase transition-all shadow-md cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 stroke-[2.5]" />
          <span>+ Register Vehicle</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {vehicles.map((v) => (
          <div
            key={v.id}
            id={`vehicle-card-${v.id}`}
            className="group bg-zinc-950 border border-zinc-800 hover:border-cyan-500/50 rounded-2xl p-4 flex flex-col justify-between transition-all shadow-lg hover:shadow-2xl"
          >
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 bg-zinc-900 border border-zinc-800">
                <img
                  src={v.thumbnailUrl}
                  alt={`${v.make} ${v.model}`}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-zinc-950/80 text-cyan-300 border border-zinc-700 backdrop-blur-sm">
                  {v.year || 2024} MODEL
                </span>
                {v.isDemoVehicle && (
                  <span className="absolute top-2 right-2 px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-amber-500 text-zinc-950">
                    DEMO BENCHMARK
                  </span>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {v.make} {v.model}
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">{v.fuelType || "Petrol / Turbo"}</p>

              <div className="mt-3 space-y-1.5 text-xs font-mono text-zinc-400 border-t border-zinc-900 pt-3">
                <div className="flex justify-between">
                  <span className="text-zinc-500">REG:</span>
                  <span className="text-zinc-200 font-semibold">{v.registrationNumber || "N/A"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">VIN:</span>
                  <span className="text-zinc-200">{v.vin || "DEMO-001"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-500">ODOMETER:</span>
                  <span className="text-zinc-200">{v.mileage?.toLocaleString() || "14,000"} km</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between">
              <span className="text-[11px] text-zinc-500">{v.customerName || "Showcase Vehicle"}</span>
              <button
                type="button"
                onClick={() => onSelectVehicleToInspect(v)}
                className="px-3.5 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Launch Scan</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
