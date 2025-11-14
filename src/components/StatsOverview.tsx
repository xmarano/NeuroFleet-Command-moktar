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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <Card className="p-4 hover:translate-y-[-2px] transition-transform duration-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                {stat.label}
              </span>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon weight="bold" className={`w-4 h-4 ${stat.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold font-mono ${stat.color}`}>
              {stat.value}
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
