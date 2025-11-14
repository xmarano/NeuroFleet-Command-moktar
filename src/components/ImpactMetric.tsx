import { Clock, Leaf } from "@phosphor-icons/react"

interface ImpactMetricProps {
  type: "time" | "co2"
  value: string
}

export function ImpactMetric({ type, value }: ImpactMetricProps) {
  const isPositive = value.startsWith("+")
  const isNegative = value.startsWith("-")

  const colorClass = isPositive
    ? "text-amber-400 bg-amber-500/10 border-amber-500/20"
    : isNegative
    ? "text-green-400 bg-green-500/10 border-green-500/20"
    : "text-muted-foreground bg-muted/10 border-border"

  const Icon = type === "time" ? Clock : Leaf

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorClass}`}>
      <Icon weight="bold" className="w-4 h-4 flex-shrink-0" />
      <span className="text-sm font-mono font-semibold">
        {value}
      </span>
    </div>
  )
}
