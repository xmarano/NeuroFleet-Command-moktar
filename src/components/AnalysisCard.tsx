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
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ scale: 1.02, y: -4 }}
    >
      <Card
        className={`p-3 md:p-5 transition-all duration-300 relative overflow-hidden backdrop-blur-sm ${
          isNew 
            ? "border-accent shadow-xl shadow-accent/30 animate-glow-pulse before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent/10 before:via-accent/5 before:to-transparent" 
            : "border-border hover:border-accent/50 hover:shadow-xl hover:shadow-accent/20"
        }`}
      >
        {isNew && (
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          />
        )}
        
        <div className="flex items-start justify-between gap-2 md:gap-4 mb-3 md:mb-4 relative z-10">
          <div className="flex items-center gap-1.5 md:gap-2 flex-1 min-w-0">
            <motion.div
              animate={{ 
                rotate: isNew ? [0, 5, -5, 0] : 0,
                scale: isNew ? [1, 1.1, 1] : 1
              }}
              transition={{ 
                duration: 0.5,
                repeat: isNew ? 3 : 0
              }}
            >
              <Warning weight="fill" className="w-4 h-4 md:w-5 md:h-5 text-accent flex-shrink-0" />
            </motion.div>
            <Badge className={`${config.color} border flex-shrink-0 font-semibold shadow-sm text-[10px] md:text-xs px-1.5 md:px-2 py-0.5`}>
              {config.label}
            </Badge>
            <span className="text-[10px] md:text-xs font-mono text-muted-foreground flex-shrink-0 truncate">
              {timestamp}
            </span>
          </div>
        </div>

        <div className="space-y-3 md:space-y-4 relative z-10">
          <div>
            <div className="flex items-center gap-1.5 md:gap-2 mb-1.5 md:mb-2">
              <MapPin weight="fill" className="w-3 h-3 md:w-4 md:h-4 text-muted-foreground flex-shrink-0" />
              <p className="text-xs md:text-sm font-semibold text-foreground leading-relaxed">
                {incident.description}
              </p>
            </div>
            {incident.vehicleName && (
              <div className="flex items-center gap-1.5 md:gap-2 ml-4 md:ml-6 text-[10px] md:text-xs text-muted-foreground">
                <Truck weight="fill" className="w-2.5 h-2.5 md:w-3 md:h-3" />
                <span>{incident.vehicleName}</span>
                {incident.driverName && <span>• {incident.driverName}</span>}
              </div>
            )}
          </div>

          {incident.analysis && (
            <>
              <Separator className="bg-border/60" />

              <motion.div 
                className="space-y-2 md:space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.4 }}
              >
                <div>
                  <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 md:mb-2">
                    Analyse
                  </p>
                  <p className="text-xs md:text-sm text-foreground/90 leading-relaxed">
                    {incident.analysis.explanation}
                  </p>
                </div>

                <motion.div
                  whileHover={{ x: 4 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <div className="flex items-start gap-1.5 md:gap-2">
                    <ArrowRight weight="bold" className="w-3 h-3 md:w-4 md:h-4 text-accent mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 md:mb-2">
                        Recommandation
                      </p>
                      <p className="text-xs md:text-sm text-accent-foreground bg-accent/15 px-2 py-1.5 md:px-3 md:py-2.5 rounded-lg border border-accent/30 shadow-sm">
                        {incident.analysis.recommendation}
                      </p>
                    </div>
                  </div>
                </motion.div>

                <div className="flex items-center gap-2 md:gap-4 pt-1 md:pt-2">
                  <ImpactMetric type="time" value={incident.analysis.impactTime} />
                  <ImpactMetric type="co2" value={incident.analysis.impactCo2} />
                </div>
              </motion.div>
            </>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
