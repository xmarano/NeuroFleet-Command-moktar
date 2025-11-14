import { Circle } from "@phosphor-icons/react"
import { motion } from "framer-motion"

interface LiveIndicatorProps {
  isActive: boolean
}

export function LiveIndicator({ isActive }: LiveIndicatorProps) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="relative flex items-center justify-center">
        <motion.div
          animate={{
            scale: isActive ? [1, 1.4, 1] : 1,
            opacity: isActive ? [0.5, 0, 0.5] : 0
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute"
        >
          <Circle
            weight="fill"
            className="w-5 h-5 text-green-400"
          />
        </motion.div>
        <Circle
          weight="fill"
          className={`w-3 h-3 relative z-10 ${
            isActive ? "text-green-400" : "text-red-400"
          }`}
        />
      </div>
      <span className={`text-sm font-bold font-mono tracking-wider ${
        isActive ? "text-green-400" : "text-red-400"
      }`}>
        {isActive ? "LIVE" : "OFFLINE"}
      </span>
    </div>
  )
}
