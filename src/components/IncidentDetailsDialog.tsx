import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { MapPin, Truck, User, Clock, Calendar, Leaf, ArrowRight, Warning } from "@phosphor-icons/react"
import type { IncidentWithAnalysis } from "@/lib/types"

interface IncidentDetailsDialogProps {
  incident: IncidentWithAnalysis | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const INCIDENT_TYPE_CONFIG = {
  traffic: { label: "Trafic", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  breakdown: { label: "Panne", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  weather: { label: "Météo", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  behavior: { label: "Comportement", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" }
}

export function IncidentDetailsDialog({ incident, open, onOpenChange }: IncidentDetailsDialogProps) {
  if (!incident) return null

  const config = INCIDENT_TYPE_CONFIG[incident.type]
  const createdDate = new Date(incident.createdAt)
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <Warning weight="fill" className="w-6 h-6 text-accent" />
            <DialogTitle className="text-xl">Détails de l'incident</DialogTitle>
          </div>
          <DialogDescription>
            Informations complètes et analyse détaillée de l'incident
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div className="flex items-center gap-2">
            <Badge className={`${config.color} border`}>
              {config.label}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              ID: {incident.id.substring(0, 8)}...
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Description</p>
                <p className="text-base text-foreground">{incident.description}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <Calendar weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Date</p>
                  <p className="text-base text-foreground">
                    {createdDate.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Heure</p>
                  <p className="text-base text-foreground">
                    {createdDate.toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </div>
            </div>

            {incident.vehicleName && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-start gap-3">
                  <Truck weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Véhicule</p>
                    <p className="text-base text-foreground">{incident.vehicleName}</p>
                  </div>
                </div>

                {incident.driverName && (
                  <div className="flex items-start gap-3">
                    <User weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Chauffeur</p>
                      <p className="text-base text-foreground">{incident.driverName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex items-start gap-3">
              <MapPin weight="bold" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Coordonnées GPS</p>
                <p className="text-sm text-foreground font-mono">
                  {incident.locationLat.toFixed(4)}°N, {incident.locationLng.toFixed(4)}°E
                </p>
              </div>
            </div>
          </div>

          {incident.analysis && (
            <>
              <Separator />
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ArrowRight weight="bold" className="w-5 h-5 text-accent" />
                  Analyse IA
                </h3>

                <div className="bg-card/50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Explication
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {incident.analysis.explanation}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Recommandation
                    </p>
                    <p className="text-sm text-accent-foreground bg-accent/10 px-3 py-2 rounded">
                      {incident.analysis.recommendation}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center gap-2">
                      <Clock weight="bold" className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Impact Temps</p>
                        <p className="text-base font-mono font-semibold text-amber-400">
                          {incident.analysis.impactTime}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Leaf weight="bold" className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Impact CO₂</p>
                        <p className="text-base font-mono font-semibold text-green-400">
                          {incident.analysis.impactCo2}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
