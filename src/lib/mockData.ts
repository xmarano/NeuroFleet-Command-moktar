import type { Incident, IncidentType, Trip } from './types'

const VEHICLE_NAMES = [
  "Truck Alpha-7",
  "Truck Beta-3",
  "Truck Gamma-9",
  "Van Delta-2",
  "Van Epsilon-5",
  "Truck Zeta-1",
  "Van Theta-4",
  "Truck Kappa-8"
]

const DRIVER_NAMES = [
  "Jean Dupont",
  "Marie Martin",
  "Pierre Bernard",
  "Sophie Dubois",
  "Luc Moreau",
  "Claire Laurent",
  "Michel Simon",
  "Isabelle Leroy"
]

const INCIDENT_TEMPLATES = {
  traffic: [
    "Gros bouchon A7 sortie Lyon",
    "Accident sur périphérique, ralentissement 5km",
    "Travaux autoroute A6, voie fermée",
    "Embouteillage centre-ville Marseille",
    "Route barrée pour manifestation",
    "Trafic dense sur N7, temps d'attente +30min"
  ],
  breakdown: [
    "Alerte moteur - température élevée",
    "Problème pneumatique avant gauche",
    "Niveau huile critique détecté",
    "Dysfonctionnement système de freinage",
    "Panne électrique - batterie faible",
    "Fuite liquide de refroidissement"
  ],
  weather: [
    "Brouillard épais, visibilité réduite",
    "Pluie torrentielle, route glissante",
    "Alerte neige sur col de montagne",
    "Vent violent traversier +80km/h",
    "Verglas signalé section autoroutière",
    "Orage violent, grêle possible"
  ],
  behavior: [
    "Alerte de freinage brusque répété",
    "Vitesse excessive détectée +20km/h",
    "Conduite agressive - accélérations brutales",
    "Non-respect temps de pause réglementaire",
    "Écart de trajectoire important",
    "Dépassement limite vitesse en zone urbaine"
  ]
}

const FRANCE_COORDS = {
  minLat: 42.5,
  maxLat: 50.5,
  minLng: -4.5,
  maxLng: 8.0
}

function randomElement<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)]
}

function randomCoord(): { lat: number; lng: number } {
  return {
    lat: FRANCE_COORDS.minLat + Math.random() * (FRANCE_COORDS.maxLat - FRANCE_COORDS.minLat),
    lng: FRANCE_COORDS.minLng + Math.random() * (FRANCE_COORDS.maxLng - FRANCE_COORDS.minLng)
  }
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export function generateMockTrip(): Trip {
  return {
    id: generateId(),
    vehicleName: randomElement(VEHICLE_NAMES),
    driverName: randomElement(DRIVER_NAMES),
    status: randomElement(["en_route", "delayed", "at_risk"] as const)
  }
}

export function generateMockIncident(trip?: Trip): Incident {
  const incidentType = randomElement(["traffic", "breakdown", "weather", "behavior"] as IncidentType[])
  const description = randomElement(INCIDENT_TEMPLATES[incidentType])
  const coords = randomCoord()
  const tripData = trip || generateMockTrip()

  return {
    id: generateId(),
    createdAt: new Date().toISOString(),
    tripId: tripData.id,
    type: incidentType,
    description,
    locationLat: coords.lat,
    locationLng: coords.lng,
    vehicleName: tripData.vehicleName,
    driverName: tripData.driverName
  }
}
