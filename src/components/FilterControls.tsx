import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Funnel } from "@phosphor-icons/react"
import { motion } from "framer-motion"
import type { IncidentType } from "@/lib/types"

interface FilterControlsProps {
  selectedType: IncidentType | "all"
  onTypeChange: (type: IncidentType | "all") => void
  sortBy: "newest" | "oldest"
  onSortChange: (sort: "newest" | "oldest") => void
  totalCount: number
  filteredCount: number
}

const INCIDENT_TYPES = [
  { value: "all", label: "Tous les types", color: "bg-muted text-muted-foreground" },
  { value: "traffic", label: "Trafic", color: "bg-amber-500/20 text-amber-400" },
  { value: "breakdown", label: "Panne", color: "bg-red-500/20 text-red-400" },
  { value: "weather", label: "Météo", color: "bg-blue-500/20 text-blue-400" },
  { value: "behavior", label: "Comportement", color: "bg-purple-500/20 text-purple-400" },
]

export function FilterControls({
  selectedType,
  onTypeChange,
  sortBy,
  onSortChange,
  totalCount,
  filteredCount
}: FilterControlsProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Funnel weight="bold" className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-semibold text-muted-foreground">Filtres</span>
        </div>
        {selectedType !== "all" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onTypeChange("all")}
              className="h-7 text-xs hover:bg-accent/10 hover:text-accent"
            >
              Réinitialiser
            </Button>
          </motion.div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {INCIDENT_TYPES.map((type, index) => (
          <motion.div
            key={type.value}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Badge
              className={`cursor-pointer border transition-all ${
                selectedType === type.value
                  ? type.color + " border-current shadow-md shadow-current/20"
                  : "bg-muted/50 text-muted-foreground border-border hover:bg-muted"
              }`}
              onClick={() => onTypeChange(type.value as IncidentType | "all")}
            >
              {type.label}
            </Badge>
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2">
        <Select value={sortBy} onValueChange={(value) => onSortChange(value as "newest" | "oldest")}>
          <SelectTrigger className="w-[180px] h-8 hover:border-accent/50 transition-colors">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Plus récents</SelectItem>
            <SelectItem value="oldest">Plus anciens</SelectItem>
          </SelectContent>
        </Select>

        <motion.span 
          className="text-xs text-muted-foreground font-mono"
          key={`${filteredCount}-${totalCount}`}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {filteredCount} / {totalCount} incidents
        </motion.span>
      </div>
    </div>
  )
}
