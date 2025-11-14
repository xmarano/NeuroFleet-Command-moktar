import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ImpactMetric } from "./ImpactMetric"
import { ArrowRight, MapPin, Truck, Warning } from "@phosphor-icons/react"
import type { IncidentWithAnalysis } from "@/lib/types"
import { motion } from "framer-motion"

interface AnalysisCardProps {
  incident: IncidentWithAnalysis
  isNew?: boolean
}

const INCIDENT_TYPE_CONFIG = {
  traffic: { label: "Trafic", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
  breakdown: { label: "Panne", color: "bg-red-500/20 text-red-400 border-red-500/30" },
  weather: { label: "Météo", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
  behavior: { label: "Comportement", color: "bg-purple-500/20 text-purple-400 border-purple-500/30" }
}

export function AnalysisCard({ incident, isNew }: AnalysisCardProps) {
  const config = INCIDENT_TYPE_CONFIG[incident.type]
  const timestamp = new Date(incident.createdAt).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <Card
        className={`p-4 transition-all duration-150 hover:translate-y-[-2px] hover:shadow-lg ${
          isNew ? "border-accent shadow-accent/20" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Warning weight="fill" className="w-5 h-5 text-accent flex-shrink-0" />
            <Badge className={`${config.color} border flex-shrink-0`}>
              {config.label}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground flex-shrink-0">
              {timestamp}
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <MapPin weight="fill" className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm font-semibold text-foreground">
                {incident.description}
              </p>
            </div>
            {incident.vehicleName && (
              <div className="flex items-center gap-2 ml-6 text-xs text-muted-foreground">
                <Truck weight="fill" className="w-3 h-3" />
                <span>{incident.vehicleName}</span>
                {incident.driverName && <span>• {incident.driverName}</span>}
              </div>
            )}
          </div>

          {incident.analysis && (
            <>
              <Separator className="bg-border/50" />

              <div className="space-y-2">
                <div>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                    Analyse
                  </p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {incident.analysis.explanation}
                  </p>
                </div>

                <div>
                  <div className="flex items-start gap-2">
                    <ArrowRight weight="bold" className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                        Recommandation
                      </p>
                      <p className="text-sm text-accent-foreground bg-accent/10 px-3 py-2 rounded">
                        {incident.analysis.recommendation}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 pt-1">
                  <ImpactMetric type="time" value={incident.analysis.impactTime} />
                  <ImpactMetric type="co2" value={incident.analysis.impactCo2} />
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
