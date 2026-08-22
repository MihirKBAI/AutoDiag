import React from "react";
import { Info, Sparkles, Car } from "lucide-react";

interface DemoModeBannerProps {
  vehicleName?: string;
  className?: string;
  onSwitchToReal?: () => void;
}

export const DemoModeBanner: React.FC<DemoModeBannerProps> = ({
  vehicleName = "Ford Mustang GT",
  className = "",
  onSwitchToReal,
}) => {
  return (
    <div
      id="demo-mode-persistent-banner"
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-2.5 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs shadow-md ${className}`}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex items-center justify-center p-1 rounded bg-amber-500/20 text-amber-300">
          <Info className="w-3.5 h-3.5" />
        </span>
        <div>
          <span className="font-semibold uppercase tracking-wider text-amber-300 mr-2">
            Simulated Demo Analysis
          </span>
          <span className="text-zinc-300">
            Viewing illustrative diagnostic findings & estimated costs for{" "}
            <strong className="text-white font-medium">{vehicleName}</strong>.
          </span>
        </div>
      </div>
      {onSwitchToReal && (
        <button
          id="banner-start-new-inspection-btn"
          type="button"
          onClick={onSwitchToReal}
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase rounded bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors whitespace-nowrap"
        >
          <Car className="w-3 h-3" />
          Inspect Your Vehicle
        </button>
      )}
    </div>
  );
};
