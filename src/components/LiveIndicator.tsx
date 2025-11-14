import { Circle } from "@phosphor-icons/react"

interface LiveIndicatorProps {
  isActive: boolean
}

export function LiveIndicator({ isActive }: LiveIndicatorProps) {
  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <Circle
          weight="fill"
          className={`w-3 h-3 ${
            isActive ? "text-green-500 animate-pulse" : "text-red-500"
          }`}
        />
        {isActive && (
          <Circle
            weight="fill"
            className="absolute inset-0 w-3 h-3 text-green-500 animate-ping"
          />
        )}
      </div>
      <span className="text-sm font-medium font-mono">
        {isActive ? "LIVE" : "OFFLINE"}
      </span>
    </div>
  )
}
