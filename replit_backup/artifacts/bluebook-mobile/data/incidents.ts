export type IncidentType =
  | "sediment_breach"
  | "erosion_event"
  | "chemical_spill"
  | "dust_event"
  | "stormwater_contamination"
  | "vegetation_damage"
  | "control_failure"
  | "waste_dumping";

export type Severity = "low" | "medium" | "high" | "critical";
export type IncidentStatus = "open" | "actioned" | "closed";

export interface Incident {
  id: string;
  title: string;
  description: string;
  incidentType: IncidentType;
  severity: Severity;
  status: IncidentStatus;
  location: string;
  reportedBy: string;
  controlId?: string;
  controlName?: string;
  actionsTaken: string;
  dateOccurred: string;
  createdAt: string;
}

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  sediment_breach: "Sediment Breach",
  erosion_event: "Erosion Event",
  chemical_spill: "Chemical Spill",
  dust_event: "Dust Event",
  stormwater_contamination: "Stormwater Contamination",
  vegetation_damage: "Vegetation Damage",
  control_failure: "Control Failure",
  waste_dumping: "Waste Dumping",
};

export const SEVERITY_COLOURS: Record<Severity, { bg: string; text: string }> = {
  low: { bg: "#D8F3DC", text: "#2D6A4F" },
  medium: { bg: "#FFF3E4", text: "#B45309" },
  high: { bg: "#FDEAEA", text: "#991B1B" },
  critical: { bg: "#D62828", text: "#FFFFFF" },
};
