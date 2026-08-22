import React, { useState } from "react";
import {
  Car,
  Sparkles,
  UploadCloud,
  ArrowRight,
  ShieldAlert,
  Info,
  CheckCircle2,
  Wrench,
  ChevronDown,
} from "lucide-react";
import { DEMO_VEHICLES, DEMO_MUSTANG_IMAGE } from "../../data/demoData";
import { VehicleRecord } from "../../types";
import { ImageAngle, ImageUpload } from "./ImageUpload";

interface NewInspectionViewProps {
  onStartAnalysis: (
    imageBase64: string,
    mimeType: string,
    vehicleData: VehicleRecord,
    isForceDemo: boolean
  ) => void;
  onSelectQuickDemoMustang: () => void;
}

export const NewInspectionView: React.FC<NewInspectionViewProps> = ({
  onStartAnalysis,
  onSelectQuickDemoMustang,
}) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>("veh-mustang-001");
  const [isCustomMode, setIsCustomMode] = useState(false);

  // Form State
  const [make, setMake] = useState("Ford");
  const [model, setModel] = useState("Mustang GT");
  const [year, setYear] = useState(2024);
  const [registrationNumber, setRegistrationNumber] = useState("DL-01-AB-9800");
  const [vin, setVin] = useState("DEMO-MUSTANG-GT-001");
  const [mileage, setMileage] = useState(14200);
  const [customerName, setCustomerName] = useState("Arjun Verma");
  const [color, setColor] = useState("Dark Gray / Metallic");

  // Image State
  const [uploadedImage, setUploadedImage] = useState<string | null>(DEMO_MUSTANG_IMAGE);
  const [uploadedMimeType, setUploadedMimeType] = useState<string>("image/jpeg");

  const handleSelectPreset = (vehId: string) => {
    if (vehId === "custom") {
      setIsCustomMode(true);
      setSelectedPresetId("custom");
      setMake("");
      setModel("");
      setRegistrationNumber("");
      setVin("");
      setUploadedImage(null);
      return;
    }

    setIsCustomMode(false);
    setSelectedPresetId(vehId);
    const found = DEMO_VEHICLES.find((v) => v.id === vehId);
    if (found) {
      setMake(found.make);
      setModel(found.model);
      setYear(found.year || 2024);
      setRegistrationNumber(found.registrationNumber || "");
      setVin(found.vin || "");
      setMileage(found.mileage || 15000);
      setCustomerName(found.customerName || "");
      setColor(found.color || "");
      setUploadedImage(found.thumbnailUrl || null);
    }
  };

  const handleLaunchScan = (forceDemo: boolean = false) => {
    const finalVehicle: VehicleRecord = {
      id: isCustomMode ? `veh-custom-${Date.now()}` : selectedPresetId,
      make: make.trim() || "Unspecified Make",
      model: model.trim() || "Vehicle Model",
      year: Number(year) || 2024,
      registrationNumber: registrationNumber.trim() || "UNASSIGNED",
      vin: vin.trim() || undefined,
      mileage: Number(mileage) || undefined,
      customerName: customerName.trim() || "Walk-in Customer",
      color: color.trim() || undefined,
      isDemoVehicle: !isCustomMode,
      thumbnailUrl: uploadedImage || undefined,
    };

    onStartAnalysis(
      uploadedImage || DEMO_MUSTANG_IMAGE,
      uploadedMimeType,
      finalVehicle,
      forceDemo
    );
  };

  return (
    <div id="new-inspection-view" className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Wrench className="w-6 h-6 text-cyan-400" />
            <span>New Vehicle Damage Inspection</span>
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Configure vehicle metadata and upload exterior impact photographs for AI multimodal analysis.
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <button
          id="new-inspection-fast-track-demo-btn"
          type="button"
          onClick={onSelectQuickDemoMustang}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/30 hover:bg-amber-950/50 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all cursor-pointer shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Quick Demo (Mustang GT)</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Vehicle Selection & Data Form (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-cyan-400" />
                <span>Vehicle Identification</span>
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                STEP 1 OF 2
              </span>
            </div>

            {/* Vehicle Preset Selector */}
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Select Pre-Configured Showcase Vehicle or Custom Entry
              </label>
              <select
                id="vehicle-preset-selector"
                value={selectedPresetId}
                onChange={(e) => handleSelectPreset(e.target.value)}
                className="w-full px-3 py-2.5 bg-zinc-900 border border-zinc-700/80 focus:border-cyan-500 rounded-xl text-xs text-zinc-100 font-medium focus:outline-none transition-colors"
              >
                <option value="veh-mustang-001">Ford Mustang GT (2024) — Front-Right Collision [Primary Demo]</option>
                <option value="veh-fortuner-002">Toyota Fortuner 4x4 (2023) — Rear Tailgate Impact</option>
                <option value="veh-creta-003">Hyundai Creta SX(O) (2024) — Left Door & Mirror Scrape</option>
                <option value="veh-nexon-004">Tata Nexon Fearless (2023) — Front Bumper Scuff</option>
                <option value="veh-thar-005">Mahindra Thar LX (2024) — Front Skid Plate Damage</option>
                <option value="custom">+ Enter Custom Workshop Customer Vehicle...</option>
              </select>
            </div>

            {/* Form Fields */}
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">Make</label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    placeholder="e.g. Ford, Toyota"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    placeholder="e.g. Mustang GT"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">Model Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min="1990"
                    max="2027"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">Registration #</label>
                  <input
                    type="text"
                    value={registrationNumber}
                    onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. DL-01-AB-9800"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none font-mono uppercase"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">VIN (Optional)</label>
                  <input
                    type="text"
                    value={vin}
                    onChange={(e) => setVin(e.target.value.toUpperCase())}
                    placeholder="e.g. 1FA6P8CF4R..."
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none font-mono uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-zinc-400 mb-1">Odometer (km)</label>
                  <input
                    type="number"
                    value={mileage}
                    onChange={(e) => setMileage(Number(e.target.value))}
                    placeholder="14,200"
                    className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-zinc-400 mb-1">Customer / Advisor Name</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="e.g. Arjun Verma"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-800 focus:border-cyan-500/50 rounded-lg text-xs text-white placeholder-zinc-600 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Image Upload & Trigger (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-zinc-950 border border-zinc-800/80 rounded-2xl p-5 sm:p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <span>Damage Photographic Evidence</span>
              </h3>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                STEP 2 OF 2
              </span>
            </div>

            {/* Image Upload Component */}
            <ImageUpload
              primaryImage={uploadedImage}
              onImageSelected={(base64, mimeType) => {
                setUploadedImage(base64);
                setUploadedMimeType(mimeType);
              }}
              onRemoveImage={() => setUploadedImage(null)}
            />

            {/* Primary Analysis CTA */}
            <div className="pt-3 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center gap-3">
              <button
                id="run-ai-diagnostic-scan-btn"
                type="button"
                onClick={() => handleLaunchScan(false)}
                className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-sky-400 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-zinc-950 font-extrabold text-sm tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 fill-zinc-950" />
                <span>Run AI Diagnostic Scan</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>

              <button
                id="simulate-demo-mode-btn"
                type="button"
                onClick={() => handleLaunchScan(true)}
                className="w-full sm:w-auto py-3 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap"
                title="Run instant simulated demo analysis without making live API calls"
              >
                Demo Analysis Mode
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
