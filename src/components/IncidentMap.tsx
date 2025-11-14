import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Incident } from "@/lib/types"

interface IncidentMapProps {
  incidents: Incident[]
}

const INCIDENT_COLORS = {
  traffic: "#f59e0b",
  breakdown: "#ef4444",
  weather: "#3b82f6",
  behavior: "#a855f7"
}

export function IncidentMap({ incidents }: IncidentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [46.603354, 1.888334],
      zoom: 6,
      zoomControl: true,
      attributionControl: false
    })

    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 19,
      subdomains: "abcd"
    }).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapInstanceRef.current
    if (!map) return

    const currentMarkerIds = new Set(incidents.map((i) => i.id))
    const existingMarkerIds = new Set(markersRef.current.keys())

    existingMarkerIds.forEach((id) => {
      if (!currentMarkerIds.has(id)) {
        const marker = markersRef.current.get(id)
        if (marker) {
          map.removeLayer(marker)
          markersRef.current.delete(id)
        }
      }
    })

    incidents.forEach((incident) => {
      if (markersRef.current.has(incident.id)) return

      const color = INCIDENT_COLORS[incident.type]
      
      const icon = L.divIcon({
        className: "custom-marker",
        html: `
          <div style="
            background-color: ${color};
            width: 24px;
            height: 24px;
            border-radius: 50%;
            border: 2px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 0 10px ${color}80;
            animation: pulse 2s ease-in-out infinite;
          "></div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker([incident.locationLat, incident.locationLng], {
        icon
      }).addTo(map)

      const popupContent = `
        <div style="font-family: 'Inter', sans-serif; min-width: 200px;">
          <div style="font-size: 12px; font-weight: 600; margin-bottom: 8px; color: ${color};">
            ${incident.type.toUpperCase()}
          </div>
          <div style="font-size: 14px; margin-bottom: 8px;">
            ${incident.description}
          </div>
          ${
            incident.vehicleName
              ? `<div style="font-size: 12px; color: rgba(255, 255, 255, 0.6);">
                  ${incident.vehicleName}${incident.driverName ? ` • ${incident.driverName}` : ""}
                </div>`
              : ""
          }
          <div style="font-size: 11px; color: rgba(255, 255, 255, 0.4); margin-top: 6px; font-family: 'JetBrains Mono', monospace;">
            ${new Date(incident.createdAt).toLocaleTimeString("fr-FR")}
          </div>
        </div>
      `

      marker.bindPopup(popupContent)
      markersRef.current.set(incident.id, marker)
    })
  }, [incidents])

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="absolute inset-0 rounded-lg overflow-hidden" />
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  )
}
