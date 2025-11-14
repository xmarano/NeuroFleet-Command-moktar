import { Card } from "@/components/ui/card"
import { TrendUp, TrendDown, Activity, Warning } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import type { IncidentWithAnalysis } from "@/lib/types"

interface StatsOverviewProps {
  incidents: IncidentWithAnalysis[]
}

export function StatsOverview({ incidents }: StatsOverviewProps) {
  const totalIncidents = incidents.length
  const analyzedIncidents = incidents.filter(i => i.analysis).length
  const criticalIncidents = incidents.filter(i => i.type === "breakdown").length
  
  const totalCo2Impact = incidents
    .filter(i => i.analysis)
    .reduce((sum, i) => {
      const match = i.analysis?.impactCo2.match(/([+-]?\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

  const totalTimeImpact = incidents
    .filter(i => i.analysis)
    .reduce((sum, i) => {
      const match = i.analysis?.impactTime.match(/([+-]?\d+)/)
      return sum + (match ? parseInt(match[1]) : 0)
    }, 0)

  const stats = [
    {
      label: "Total Incidents",
      value: totalIncidents,
      icon: Activity,
      color: "text-accent",
      bgColor: "bg-accent/10"
    },
    {
      label: "Critiques",
      value: criticalIncidents,
      icon: Warning,
      color: "text-red-400",
      bgColor: "bg-red-500/10"
    },
    {
      label: "Impact CO₂",
      value: `${totalCo2Impact > 0 ? '+' : ''}${totalCo2Impact}kg`,
      icon: totalCo2Impact > 0 ? TrendUp : TrendDown,
      color: totalCo2Impact > 0 ? "text-amber-400" : "text-green-400",
      bgColor: totalCo2Impact > 0 ? "bg-amber-500/10" : "bg-green-500/10"
    },
    {
      label: "Impact Temps",
      value: `${totalTimeImpact > 0 ? '+' : ''}${totalTimeImpact}min`,
      icon: totalTimeImpact > 0 ? TrendUp : TrendDown,
      color: totalTimeImpact > 0 ? "text-amber-400" : "text-green-400",
      bgColor: totalTimeImpact > 0 ? "bg-amber-500/10" : "bg-green-500/10"
    }
  ]

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
          whileHover={{ y: -4, scale: 1.02 }}
        >
          <Card className="p-3 md:p-4 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-1.5 md:mb-2">
                <span className="text-[10px] md:text-xs font-semibold text-muted-foreground uppercase tracking-wide truncate pr-1">
                  {stat.label}
                </span>
                <motion.div 
                  className={`p-1.5 md:p-2 rounded-lg ${stat.bgColor} flex-shrink-0`}
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <stat.icon weight="bold" className={`w-3 h-3 md:w-4 md:h-4 ${stat.color}`} />
                </motion.div>
              </div>
              <motion.div 
                className={`text-lg md:text-2xl font-bold font-mono ${stat.color}`}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.4 }}
              >
                {stat.value}
              </motion.div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
