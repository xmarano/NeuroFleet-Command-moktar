import { Clock, Leaf } from "@phosphor-icons/react"

interface ImpactMetricProps {
  type: "time" | "co2"
  value: string
}

export function ImpactMetric({ type, value }: ImpactMetricProps) {
  const isPositive = value.startsWith("+")
  const isNegative = value.startsWith("-")
  const isNeutral = value.startsWith("0")

  const colorClass = isPositive
    ? "text-amber-400"
    : isNegative
    ? "text-green-400"
    : "text-muted-foreground"

  const Icon = type === "time" ? Clock : Leaf

  return (
    <div className="flex items-center gap-2">
      <Icon weight="bold" className={`w-4 h-4 ${colorClass}`} />
      <span className={`text-sm font-mono font-medium ${colorClass}`}>
        {value}
      </span>
    </div>
  )
}
