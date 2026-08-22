import { DEFAULT_GARAGE_PROFILE, DEMO_VEHICLES, INITIAL_INSPECTIONS } from "../data/demoData";
import { GarageProfile, InspectionRecord, VehicleRecord } from "../types";

const STORAGE_KEYS = {
  INSPECTIONS: "autosight_inspections_v1",
  GARAGE_PROFILE: "autosight_garage_profile_v1",
  CUSTOM_VEHICLES: "autosight_custom_vehicles_v1",
};

/**
 * Initialize and load inspections from localStorage
 */
export function getStoredInspections(): InspectionRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.INSPECTIONS);
    if (!raw) {
      // Seed initial inspection records
      localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(INITIAL_INSPECTIONS));
      return INITIAL_INSPECTIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_INSPECTIONS;
  } catch (e) {
    console.warn("Error reading inspections from localStorage:", e);
    return INITIAL_INSPECTIONS;
  }
}

/**
 * Save new or updated inspection
 */
export function saveInspection(inspection: InspectionRecord): InspectionRecord[] {
  try {
    const current = getStoredInspections();
    const existingIndex = current.findIndex((i) => i.inspectionId === inspection.inspectionId);
    let updated: InspectionRecord[];

    if (existingIndex >= 0) {
      updated = [...current];
      updated[existingIndex] = inspection;
    } else {
      updated = [inspection, ...current];
    }

    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn("Error saving inspection to localStorage:", e);
    return getStoredInspections();
  }
}

/**
 * Delete an inspection record
 */
export function deleteInspection(inspectionId: string): InspectionRecord[] {
  try {
    const current = getStoredInspections();
    const updated = current.filter((i) => i.inspectionId !== inspectionId);
    localStorage.setItem(STORAGE_KEYS.INSPECTIONS, JSON.stringify(updated));
    return updated;
  } catch (e) {
    return getStoredInspections();
  }
}

/**
 * Generate sequential inspection ID
 */
export function generateNextInspectionId(): string {
  const current = getStoredInspections();
  const year = new Date().getFullYear();
  const count = current.length + 1;
  const padded = String(count).padStart(3, "0");
  return `INS-${year}-${padded}`;
}

/**
 * Garage Profile Storage
 */
export function getStoredGarageProfile(): GarageProfile {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.GARAGE_PROFILE);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.GARAGE_PROFILE, JSON.stringify(DEFAULT_GARAGE_PROFILE));
      return DEFAULT_GARAGE_PROFILE;
    }
    return { ...DEFAULT_GARAGE_PROFILE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_GARAGE_PROFILE;
  }
}

export function saveGarageProfile(profile: GarageProfile): GarageProfile {
  try {
    localStorage.setItem(STORAGE_KEYS.GARAGE_PROFILE, JSON.stringify(profile));
    return profile;
  } catch {
    return profile;
  }
}

/**
 * Vehicle Records (Demo + User created)
 */
export function getAllVehicles(): VehicleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VEHICLES);
    const custom: VehicleRecord[] = raw ? JSON.parse(raw) : [];
    return [...DEMO_VEHICLES, ...custom];
  } catch {
    return DEMO_VEHICLES;
  }
}

export function saveCustomVehicle(vehicle: VehicleRecord): VehicleRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CUSTOM_VEHICLES);
    const current: VehicleRecord[] = raw ? JSON.parse(raw) : [];
    const updated = [vehicle, ...current];
    localStorage.setItem(STORAGE_KEYS.CUSTOM_VEHICLES, JSON.stringify(updated));
    return [...DEMO_VEHICLES, ...updated];
  } catch {
    return DEMO_VEHICLES;
  }
}
