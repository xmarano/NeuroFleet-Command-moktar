export type IncidentType = "traffic" | "breakdown" | "weather" | "behavior"

export interface Trip {
  id: string
  vehicleName: string
  driverName: string
  status: "en_route" | "delayed" | "at_risk"
}

export interface Incident {
  id: string
  createdAt: string
  tripId: string
  type: IncidentType
  description: string
  locationLat: number
  locationLng: number
  vehicleName?: string
  driverName?: string
}

export interface Analysis {
  id: string
  incidentId: string
  explanation: string
  recommendation: string
  impactCo2: string
  impactTime: string
  createdAt: string
}

export interface IncidentWithAnalysis extends Incident {
  analysis?: Analysis
}
