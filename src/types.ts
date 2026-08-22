export type SeverityLevel = "LOW" | "MODERATE" | "HIGH" | "CRITICAL";

export type PartCondition = "DAMAGED" | "POSSIBLY_DAMAGED" | "INSPECTION_REQUIRED";

export type PartAction = "REPAIR" | "REPLACE" | "INSPECT";

export type RecommendationPriority = "HIGH" | "MEDIUM" | "LOW";

export interface DamageArea {
  area: string;
  damageType: string;
  severity: SeverityLevel | string;
  confidence: number;
  explanation: string;
  markerCoords?: { x: number; y: number }; // Relative percentage coordinates (e.g., x: 65, y: 40)
}

export interface AffectedPart {
  partName: string;
  location: string;
  condition: PartCondition;
  action: PartAction;
  confidence: number;
  estimatedPartCost: number;
  oemReference?: string;
}

export interface Recommendation {
  priority: RecommendationPriority;
  action: string;
  reason: string;
}

export interface CostEstimate {
  partsCost: number;
  labourCost: number;
  calibrationCost: number;
  miscellaneousCost: number;
  discount?: number;
  estimatedTotal: number;
  currency: "INR";
}

export interface VehicleDiagnosis {
  vehicleIdentification: {
    make: string;
    model: string;
    confidence: number;
  };
  overallSeverity: SeverityLevel;
  damageAreas: DamageArea[];
  affectedParts: AffectedPart[];
  recommendations: Recommendation[];
  estimatedCost: CostEstimate;
  safetyWarnings: string[];
  technicianNotes: string[];
  limitations: string[];
  confidence: number;
  isDemoData: boolean;   // true for seeded/demo/fallback results
  generatedAt: string;   // ISO timestamp
  damageSummary?: string;
  impactZone?: string;
}

export interface VehicleRecord {
  id: string;
  make: string;
  model: string;
  year?: number;
  registrationNumber?: string;
  vin?: string;
  mileage?: number;
  customerName?: string;
  fuelType?: string;
  transmission?: string;
  color?: string;
  isDemoVehicle: boolean;
  thumbnailUrl?: string;
}

export interface InspectionRecord {
  inspectionId: string; // e.g. "INS-2026-001"
  vehicle: VehicleRecord;
  createdAt: string;
  imageUrls: string[];
  primaryImageUrl: string;
  diagnosis: VehicleDiagnosis;
  status: "COMPLETED" | "PENDING" | "FAILED";
  technicianName?: string;
  garageNotes?: string;
  verifiedItems?: string[]; // IDs/names of checklist items verified by technician
}

export interface GarageProfile {
  name: string;
  address: string;
  phone: string;
  email: string;
  technicianName: string;
  taxRegistrationNumber: string;
  hourlyLaborRate: number;
}
