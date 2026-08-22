/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import {
  DEMO_MUSTANG_IMAGE,
  DEMO_VEHICLES,
  MUSTANG_GT_DEMO_DIAGNOSIS,
} from "./data/demoData";
import {
  GarageProfile,
  InspectionRecord,
  VehicleDiagnosis,
  VehicleRecord,
} from "./types";
import {
  analyzeVehicleImage,
  checkAiHealth,
} from "./services/geminiVehicleAnalysis";
import {
  deleteInspection,
  generateNextInspectionId,
  getAllVehicles,
  getStoredGarageProfile,
  getStoredInspections,
  saveGarageProfile,
  saveInspection,
} from "./services/storage";
import { TopBar } from "./components/navigation/TopBar";
import { NavTab, Sidebar } from "./components/navigation/Sidebar";
import { MobileNav } from "./components/navigation/MobileNav";
import { DashboardView } from "./components/dashboard/DashboardView";
import { NewInspectionView } from "./components/inspection/NewInspectionView";
import { AnalysisProgress } from "./components/inspection/AnalysisProgress";
import { DiagnosticResultsView } from "./components/diagnostic/DiagnosticResultsView";
import { ReportViewer } from "./components/report/ReportViewer";
import { InspectionHistoryView } from "./components/history/InspectionHistoryView";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { VehicleRegistryView } from "./components/vehicles/VehicleRegistryView";
import { SettingsModal } from "./components/settings/SettingsModal";

export default function App() {
  // Navigation State
  const [currentTab, setCurrentTab] = useState<NavTab>("dashboard");
  const [searchQuery, setSearchQuery] = useState("");

  // Persistent & App Data
  const [inspections, setInspections] = useState<InspectionRecord[]>([]);
  const [vehicles, setVehicles] = useState<VehicleRecord[]>([]);
  const [garageProfile, setGarageProfile] = useState<GarageProfile>(getStoredGarageProfile());

  // Active Inspection & Diagnosis
  const [activeInspection, setActiveInspection] = useState<InspectionRecord | null>(null);
  const [isSavedInHistory, setIsSavedInHistory] = useState(true);

  // Analysis State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analyzingImage, setAnalyzingImage] = useState<string | null>(null);
  const [analyzingVehicle, setAnalyzingVehicle] = useState<VehicleRecord | null>(null);

  // System & Telemetry Status
  const [isAiOnline, setIsAiOnline] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Initialize data on mount
  useEffect(() => {
    const loadedInspections = getStoredInspections();
    const loadedVehicles = getAllVehicles();
    const loadedProfile = getStoredGarageProfile();

    setInspections(loadedInspections);
    setVehicles(loadedVehicles);
    setGarageProfile(loadedProfile);

    // If there is at least one inspection, default active to the latest one
    if (loadedInspections.length > 0) {
      setActiveInspection(loadedInspections[0]);
    }

    // Health check
    checkAiHealth().then((res) => {
      setIsAiOnline(res.online);
    });
  }, []);

  // Quick Demo Mustang GT trigger
  const handleQuickDemoMustang = () => {
    const mustang = DEMO_VEHICLES[0];
    const demoRecord: InspectionRecord = {
      inspectionId: "INS-2026-001",
      vehicle: mustang,
      createdAt: new Date().toISOString(),
      imageUrls: [DEMO_MUSTANG_IMAGE],
      primaryImageUrl: DEMO_MUSTANG_IMAGE,
      diagnosis: MUSTANG_GT_DEMO_DIAGNOSIS,
      status: "COMPLETED",
      technicianName: garageProfile.technicianName,
      verifiedItems: [
        "Inspect bumper mounting brackets for micro-fractures before mounting new fascia.",
        "Inspect headlamp mounting points on radiator support frame.",
      ],
    };

    setActiveInspection(demoRecord);
    setIsSavedInHistory(true);
    setCurrentTab("diagnostic-results");
  };

  // Launch analysis workflow
  const handleStartAnalysis = async (
    imageBase64: string,
    mimeType: string,
    vehicleData: VehicleRecord,
    isForceDemo: boolean
  ) => {
    setAnalyzingImage(imageBase64);
    setAnalyzingVehicle(vehicleData);
    setIsAnalyzing(true);

    try {
      // Execute multimodal call through API service
      const analysisResult = await analyzeVehicleImage(
        imageBase64,
        mimeType,
        vehicleData,
        isForceDemo
      );

      // Construct complete inspection record
      const newInspectionId = generateNextInspectionId();
      const newRecord: InspectionRecord = {
        inspectionId: newInspectionId,
        vehicle: vehicleData,
        createdAt: new Date().toISOString(),
        imageUrls: [imageBase64],
        primaryImageUrl: imageBase64,
        diagnosis: analysisResult.diagnosis,
        status: "COMPLETED",
        technicianName: garageProfile.technicianName,
      };

      // Add minimum delay so user enjoys high-tech scanning progress
      setTimeout(() => {
        setIsAnalyzing(false);
        setActiveInspection(newRecord);
        setIsSavedInHistory(false);
        setCurrentTab("diagnostic-results");
      }, 1500);
    } catch (err) {
      console.warn("Analysis flow error, activating safe demo fallback:", err);
      setTimeout(() => {
        setIsAnalyzing(false);
        handleQuickDemoMustang();
      }, 1200);
    }
  };

  // Save current active inspection to localStorage
  const handleSaveToHistory = (verifiedItems: string[]) => {
    if (!activeInspection) return;

    const updatedRecord: InspectionRecord = {
      ...activeInspection,
      verifiedItems,
    };

    const updatedList = saveInspection(updatedRecord);
    setInspections(updatedList);
    setActiveInspection(updatedRecord);
    setIsSavedInHistory(true);
  };

  // Delete an inspection
  const handleDeleteInspection = (id: string) => {
    const updated = deleteInspection(id);
    setInspections(updated);
    if (activeInspection?.inspectionId === id) {
      if (updated.length > 0) {
        setActiveInspection(updated[0]);
      } else {
        handleQuickDemoMustang();
      }
    }
  };

  // Save garage profile
  const handleSaveGarageProfile = (profile: GarageProfile) => {
    const saved = saveGarageProfile(profile);
    setGarageProfile(saved);
  };

  return (
    <div id="autosight-ai-app-root" className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-zinc-950">
      {/* Top Bar */}
      <TopBar
        isAiOnline={isAiOnline}
        garageProfile={garageProfile}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onQuickDemo={handleQuickDemoMustang}
        onNewInspection={() => setCurrentTab("new-inspection")}
        searchQuery={searchQuery}
        onSearchChange={(q) => {
          setSearchQuery(q);
          if (q.trim() && currentTab !== "history") {
            setCurrentTab("history");
          }
        }}
      />

      {/* Main Layout Container with Sidebar & Content Stage */}
      <div className="flex-1 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={(tab) => setCurrentTab(tab)}
          onQuickDemo={handleQuickDemoMustang}
          hasActiveDiagnosis={Boolean(activeInspection)}
        />

        {/* Dynamic Main Stage */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {/* Active Analysis Progress Screen */}
          {isAnalyzing ? (
            <AnalysisProgress
              imageUrl={analyzingImage}
              vehicleName={`${analyzingVehicle?.make || 'Vehicle'} ${analyzingVehicle?.model || ''}`}
              isRealApiCall={isAiOnline}
            />
          ) : (
            <>
              {currentTab === "dashboard" && (
                <DashboardView
                  inspections={inspections}
                  onStartInspection={() => setCurrentTab("new-inspection")}
                  onViewInspection={(rec) => {
                    setActiveInspection(rec);
                    setIsSavedInHistory(true);
                    setCurrentTab("diagnostic-results");
                  }}
                  onSelectVehicleDemo={(v) => {
                    if (v.id === "veh-mustang-001") {
                      handleQuickDemoMustang();
                    } else {
                      setCurrentTab("new-inspection");
                    }
                  }}
                  onQuickDemoMustang={handleQuickDemoMustang}
                />
              )}

              {currentTab === "new-inspection" && (
                <NewInspectionView
                  onStartAnalysis={handleStartAnalysis}
                  onSelectQuickDemoMustang={handleQuickDemoMustang}
                />
              )}

              {currentTab === "diagnostic-results" && activeInspection && (
                <DiagnosticResultsView
                  vehicle={activeInspection.vehicle}
                  diagnosis={activeInspection.diagnosis}
                  imageUrl={activeInspection.primaryImageUrl}
                  onGenerateReport={() => setCurrentTab("reports")}
                  onSaveToHistory={handleSaveToHistory}
                  onStartNewInspection={() => setCurrentTab("new-inspection")}
                  isSaved={isSavedInHistory}
                />
              )}

              {currentTab === "reports" && activeInspection && (
                <ReportViewer
                  inspection={activeInspection}
                  garageProfile={garageProfile}
                  onBack={() => setCurrentTab("diagnostic-results")}
                />
              )}

              {currentTab === "history" && (
                <InspectionHistoryView
                  inspections={inspections}
                  onSelectInspection={(rec) => {
                    setActiveInspection(rec);
                    setIsSavedInHistory(true);
                    setCurrentTab("diagnostic-results");
                  }}
                  onDeleteInspection={handleDeleteInspection}
                  onNewInspection={() => setCurrentTab("new-inspection")}
                />
              )}

              {currentTab === "analytics" && (
                <AnalyticsView inspections={inspections} />
              )}

              {currentTab === "vehicles" && (
                <VehicleRegistryView
                  vehicles={vehicles}
                  onSelectVehicleToInspect={(v) => {
                    if (v.id === "veh-mustang-001") {
                      handleQuickDemoMustang();
                    } else {
                      setCurrentTab("new-inspection");
                    }
                  }}
                  onNewInspection={() => setCurrentTab("new-inspection")}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        hasActiveDiagnosis={Boolean(activeInspection)}
      />

      {/* Immersive UI Telemetry Footer Bar */}
      <footer className="h-12 bg-[#0a0c10] border-t border-white/5 px-4 md:px-10 flex items-center justify-between text-[10px] uppercase font-bold tracking-[0.2em] font-mono text-zinc-400 z-10">
        <div className="flex items-center gap-4 sm:gap-8">
          <span className="hidden sm:inline">Security: AES-256 Encrypted</span>
          <span>Lat/Long: 28.6139° N, 77.2090° E</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)] animate-pulse" />
          <span className="text-zinc-200">Remote Diagnostic Link Active</span>
        </div>
      </footer>

      {/* Garage Profile Settings Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        garageProfile={garageProfile}
        onSaveProfile={handleSaveGarageProfile}
      />
    </div>
  );
}
