import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import type { Incident, IncidentWithAnalysis } from "@/lib/types"

interface IncidentMapProps {
  incidents: Incident[]
  onIncidentClick?: (incident: IncidentWithAnalysis) => void
}

const INCIDENT_COLORS = {
  traffic: "#f59e0b",
  breakdown: "#ef4444",
  weather: "#3b82f6",
  behavior: "#a855f7"
}

export function IncidentMap({ incidents, onIncidentClick }: IncidentMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return

    const map = L.map(mapRef.current, {
      center: [46.603354, 1.888334],
      zoom: 6,
      zoomControl: true,
      attributionControl: false,
      touchZoom: true,
      dragging: true,
      scrollWheelZoom: false
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
            position: relative;
            width: 24px;
            height: 24px;
          ">
            <div style="
              position: absolute;
              inset: 0;
              background: radial-gradient(circle, ${color} 0%, ${color}CC 50%, ${color}66 100%);
              width: 24px;
              height: 24px;
              border-radius: 50%;
              border: 3px solid ${color}66;
              box-shadow: 
                0 0 20px ${color}AA,
                0 0 40px ${color}66,
                0 0 60px ${color}33,
                inset 0 0 10px ${color}FF;
              animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              backdrop-filter: blur(2px);
            "></div>
            <div style="
              position: absolute;
              inset: 2px;
              background: radial-gradient(circle at 40% 40%, ${color}FF 0%, ${color}AA 100%);
              border-radius: 50%;
              animation: glow 3s ease-in-out infinite alternate;
            "></div>
          </div>
        `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })

      const marker = L.marker([incident.locationLat, incident.locationLng], {
        icon
      }).addTo(map)

      marker.on("click", () => {
        if (onIncidentClick) {
          onIncidentClick(incident as IncidentWithAnalysis)
        }
      })

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
      <div ref={mapRef} className="absolute inset-0 rounded-lg overflow-hidden shadow-2xl" />
      <style>{`
        @keyframes pulse {
          0%, 100% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.2); 
            opacity: 0.8; 
          }
        }
        @keyframes glow {
          0% {
            opacity: 0.6;
            filter: brightness(1);
          }
          100% {
            opacity: 1;
            filter: brightness(1.4);
          }
        }
        .custom-marker:hover > div > div:first-child {
          transform: scale(1.4) !important;
          filter: brightness(1.3);
          box-shadow: 
            0 0 30px currentColor,
            0 0 50px currentColor,
            0 0 70px currentColor !important;
        }
        .leaflet-popup {
          animation: popupFadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes popupFadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  )
}
