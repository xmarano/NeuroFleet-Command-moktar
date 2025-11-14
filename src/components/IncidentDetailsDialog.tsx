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
import { motion } from "framer-motion"
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
      <DialogContent className="max-w-2xl backdrop-blur-xl bg-card/95 border-border/50 shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <motion.div
              initial={{ rotate: 0, scale: 1 }}
              animate={{ rotate: [0, -10, 10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <Warning weight="fill" className="w-6 h-6 text-accent" />
            </motion.div>
            <DialogTitle className="text-xl">Détails de l'incident</DialogTitle>
          </div>
          <DialogDescription>
            Informations complètes et analyse détaillée de l'incident
          </DialogDescription>
        </DialogHeader>

        <motion.div 
          className="space-y-4 mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-center gap-2">
            <Badge className={`${config.color} border shadow-sm`}>
              {config.label}
            </Badge>
            <span className="text-xs font-mono text-muted-foreground">
              ID: {incident.id.substring(0, 8)}...
            </span>
          </div>

          <div className="space-y-3">
            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <MapPin weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Description</p>
                <p className="text-base text-foreground">{incident.description}</p>
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-3">
              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Calendar weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Date</p>
                  <p className="text-base text-foreground">
                    {createdDate.toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </motion.div>

              <motion.div 
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 }}
              >
                <Clock weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-muted-foreground mb-1">Heure</p>
                  <p className="text-base text-foreground">
                    {createdDate.toLocaleTimeString("fr-FR")}
                  </p>
                </div>
              </motion.div>
            </div>

            {incident.vehicleName && (
              <div className="grid grid-cols-2 gap-3">
                <motion.div 
                  className="flex items-start gap-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Truck weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-1">Véhicule</p>
                    <p className="text-base text-foreground">{incident.vehicleName}</p>
                  </div>
                </motion.div>

                {incident.driverName && (
                  <motion.div 
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <User weight="fill" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-muted-foreground mb-1">Chauffeur</p>
                      <p className="text-base text-foreground">{incident.driverName}</p>
                    </div>
                  </motion.div>
                )}
              </div>
            )}

            <motion.div 
              className="flex items-start gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <MapPin weight="bold" className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-muted-foreground mb-1">Coordonnées GPS</p>
                <p className="text-sm text-foreground font-mono">
                  {incident.locationLat.toFixed(4)}°N, {incident.locationLng.toFixed(4)}°E
                </p>
              </div>
            </motion.div>
          </div>

          {incident.analysis && (
            <>
              <Separator />
              
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <ArrowRight weight="bold" className="w-5 h-5 text-accent" />
                  Analyse IA
                </h3>

                <div className="bg-card/50 p-4 rounded-lg space-y-3 border border-border/50 backdrop-blur-sm">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 }}
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Explication
                    </p>
                    <p className="text-sm text-foreground leading-relaxed">
                      {incident.analysis.explanation}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                      Recommandation
                    </p>
                    <p className="text-sm text-accent-foreground bg-accent/10 px-3 py-2 rounded border border-accent/30 shadow-sm">
                      {incident.analysis.recommendation}
                    </p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-4 pt-2">
                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.45 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Clock weight="bold" className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Impact Temps</p>
                        <p className="text-base font-mono font-semibold text-amber-400">
                          {incident.analysis.impactTime}
                        </p>
                      </div>
                    </motion.div>

                    <motion.div 
                      className="flex items-center gap-2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Leaf weight="bold" className="w-5 h-5 text-green-400" />
                      <div>
                        <p className="text-xs text-muted-foreground">Impact CO₂</p>
                        <p className="text-base font-mono font-semibold text-green-400">
                          {incident.analysis.impactCo2}
                        </p>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
