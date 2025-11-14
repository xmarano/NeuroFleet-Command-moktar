import { Clock, Leaf } from "@phosphor-icons/react"
import { motion } from "framer-motion"

interface ImpactMetricProps {
  type: "time" | "co2"
  value: string
}

export function ImpactMetric({ type, value }: ImpactMetricProps) {
  const isPositive = value.startsWith("+")
  const isNegative = value.startsWith("-")

  const colorClass = isPositive
    ? "text-amber-400 bg-amber-500/10 border-amber-500/30"
    : isNegative
    ? "text-green-400 bg-green-500/10 border-green-500/30"
    : "text-muted-foreground bg-muted/10 border-border"

  const Icon = type === "time" ? Clock : Leaf

  return (
    <motion.div 
      className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClass} shadow-sm`}
      whileHover={{ scale: 1.05, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      <motion.div
        animate={{ 
          rotate: [0, 10, -10, 0],
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Icon weight="bold" className="w-4 h-4 flex-shrink-0" />
      </motion.div>
      <span className="text-sm font-mono font-semibold">
        {value}
      </span>
    </motion.div>
  )
}
