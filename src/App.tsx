import { useState, useMemo, useEffect } from "react"
import { IncidentMap } from "./components/IncidentMap"
import { AnalysisCard } from "./components/AnalysisCard"
import { LiveIndicator } from "./components/LiveIndicator"
import { StatsOverview } from "./components/StatsOverview"
import { FilterControls } from "./components/FilterControls"
import { IncidentDetailsDialog } from "./components/IncidentDetailsDialog"
import { KeyboardShortcutsHelp } from "./components/KeyboardShortcutsHelp"
import { ScrollArea } from "./components/ui/scroll-area"
import { Button } from "./components/ui/button"
import { Separator } from "./components/ui/separator"
import { Skeleton } from "./components/ui/skeleton"
import { Lightning, Trash, Download } from "@phosphor-icons/react"
import { useIncidentStream } from "./hooks/use-incident-stream"
import { useKeyboardShortcuts } from "./hooks/use-keyboard-shortcuts"
import { toast } from "sonner"
import { motion } from "framer-motion"
import type { IncidentType, IncidentWithAnalysis } from "./lib/types"

function App() {
  const [isStreamActive, setIsStreamActive] = useState(true)
  const { incidents, newIncidentIds, clearIncidents } = useIncidentStream(isStreamActive)
  const [selectedType, setSelectedType] = useState<IncidentType | "all">("all")
  const [sortBy, setSortBy] = useState<"newest" | "oldest">("newest")
  const [selectedIncident, setSelectedIncident] = useState<IncidentWithAnalysis | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)

  useKeyboardShortcuts([
    {
      key: "p",
      ctrl: true,
      callback: () => {
        setIsStreamActive(!isStreamActive)
        toast.info(isStreamActive ? "Stream paused" : "Stream started")
      }
    },
    {
      key: "e",
      ctrl: true,
      callback: () => {
        if (incidentsList.length > 0) {
          handleExport()
        }
      }
    },
    {
      key: "r",
      ctrl: true,
      callback: () => {
        setSelectedType("all")
        toast.info("Filters reset")
      }
    }
  ])

  const incidentsList = incidents || []
  
  const filteredAndSortedIncidents = useMemo(() => {
    let filtered = incidentsList
    
    if (selectedType !== "all") {
      filtered = filtered.filter((i) => i.type === selectedType)
    }
    
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return sortBy === "newest" ? dateB - dateA : dateA - dateB
    })
    
    return sorted
  }, [incidentsList, selectedType, sortBy])

  const incidentsWithAnalysis = filteredAndSortedIncidents.filter((i) => i.analysis)
  const pendingIncidents = filteredAndSortedIncidents.filter((i) => !i.analysis)

  const handleIncidentClick = (incident: IncidentWithAnalysis) => {
    setSelectedIncident(incident)
    setIsDetailsOpen(true)
  }

  const handleExport = () => {
    const data = incidentsList.map(i => ({
      date: new Date(i.createdAt).toLocaleString("fr-FR"),
      type: i.type,
      description: i.description,
      vehicle: i.vehicleName,
      driver: i.driverName,
      analysis: i.analysis?.explanation || "En attente",
      recommendation: i.analysis?.recommendation || "En attente",
      impactCO2: i.analysis?.impactCo2 || "N/A",
      impactTime: i.analysis?.impactTime || "N/A"
    }))
    
    const csv = [
      Object.keys(data[0] || {}).join(","),
      ...data.map(row => Object.values(row).map(v => `"${v}"`).join(","))
    ].join("\n")
    
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `incidents-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
    
    toast.success("Export réussi", {
      description: `${incidentsList.length} incidents exportés`
    })
  }

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
      <div className="h-full flex flex-col">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="border-b border-border bg-gradient-to-r from-card/90 via-card/70 to-card/90 backdrop-blur-xl px-6 py-4 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent/8 before:via-transparent before:to-accent/8 before:opacity-50"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 to-transparent opacity-40" />
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <motion.div 
                  className="relative"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Lightning weight="fill" className="w-8 h-8 text-accent relative z-10" />
                  <div className="absolute inset-0 blur-2xl bg-accent/50 animate-pulse" />
                </motion.div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-br from-foreground via-foreground/90 to-foreground/70 bg-clip-text">
                  NeuroFleet Command
                </h1>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <LiveIndicator isActive={isStreamActive} />
            </div>
            <div className="flex items-center gap-3">
              <KeyboardShortcutsHelp />
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={incidentsList.length === 0}
                className="hover:bg-accent/10 hover:border-accent hover:text-accent transition-all duration-300 hover:shadow-lg hover:shadow-accent/20"
              >
                <Download weight="bold" className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button
                variant={isStreamActive ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsStreamActive(!isStreamActive)}
                className="transition-all duration-300 hover:scale-105"
              >
                {isStreamActive ? "Pause Stream" : "Start Stream"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  clearIncidents()
                  toast.success("Incidents effacés")
                }}
                disabled={incidentsList.length === 0}
                className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all duration-300 hover:shadow-lg hover:shadow-destructive/20"
              >
                <Trash weight="bold" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </motion.header>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="px-6 py-5 border-b border-border bg-gradient-to-b from-background to-card/20 backdrop-blur-sm"
        >
          <StatsOverview incidents={incidentsList} />
        </motion.div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="h-full border-r border-border p-6 bg-gradient-to-br from-background via-background to-card/10 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
            <div className="h-full flex flex-col relative z-10">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                  Live Incident Map
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse shadow-lg shadow-accent/50" />
                </h2>
                <p className="text-sm text-muted-foreground">
                  Real-time geographic visualization of fleet incidents
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <IncidentMap 
                  incidents={filteredAndSortedIncidents} 
                  onIncidentClick={handleIncidentClick}
                />
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="h-full flex flex-col bg-gradient-to-br from-background via-background to-card/5 relative overflow-hidden"
          >
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
            <div className="border-b border-border px-6 py-4 relative z-10 backdrop-blur-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Analysis Feed</h2>
                  <p className="text-sm text-muted-foreground">
                    AI-powered incident analysis and recommendations
                  </p>
                </div>
                <motion.div 
                  className="text-right"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <div className="text-2xl font-bold font-mono text-accent">
                    {incidentsWithAnalysis.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Analyzed
                  </div>
                </motion.div>
              </div>
              
              <FilterControls
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                sortBy={sortBy}
                onSortChange={setSortBy}
                totalCount={incidentsList.length}
                filteredCount={filteredAndSortedIncidents.length}
              />
            </div>

            <div className="flex-1 overflow-hidden relative z-10">
              <ScrollArea className="h-full">
                <div className="p-6 space-y-4">
                {pendingIncidents.length > 0 && (
                  <div className="space-y-4">
                    {pendingIncidents.map((incident) => (
                      <div key={incident.id} className="space-y-3">
                        <div className="p-5 border border-border rounded-lg bg-card/50 animate-shimmer backdrop-blur-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <Skeleton className="h-5 w-5 rounded-full" />
                            <Skeleton className="h-6 w-20 rounded-md" />
                            <Skeleton className="h-4 w-16 rounded-md" />
                          </div>
                          <Skeleton className="h-4 w-full mb-2 rounded-md" />
                          <Skeleton className="h-4 w-3/4 rounded-md" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {incidentsWithAnalysis.length > 0 ? (
                  incidentsWithAnalysis.map((incident, index) => (
                    <motion.div 
                      key={incident.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.4, 
                        delay: index * 0.05,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      onClick={() => handleIncidentClick(incident)}
                      className="cursor-pointer"
                    >
                      <AnalysisCard
                        incident={incident}
                        isNew={newIncidentIds.has(incident.id)}
                      />
                    </motion.div>
                  ))
                ) : (
                  !pendingIncidents.length && (
                    <motion.div 
                      className="flex flex-col items-center justify-center py-12 text-center"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <motion.div
                        animate={{ 
                          y: [0, -10, 0],
                          opacity: [0.5, 0.8, 0.5]
                        }}
                        transition={{ 
                          duration: 3,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Lightning weight="thin" className="w-20 h-20 text-muted-foreground/50 mb-4" />
                      </motion.div>
                      <h3 className="text-lg font-semibold mb-2">
                        {selectedType !== "all" 
                          ? "Aucun incident de ce type"
                          : "Waiting for incidents..."}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                        {selectedType !== "all"
                          ? "Essayez de sélectionner un autre type d'incident dans les filtres ci-dessus."
                          : "The system is monitoring your fleet in real-time. New incidents will appear here automatically with AI-powered analysis."}
                      </p>
                    </motion.div>
                  )
                )}
              </div>
              </ScrollArea>
            </div>
          </motion.div>
        </div>
      </div>

      <IncidentDetailsDialog
        incident={selectedIncident}
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
      />
    </div>
  )
}

export default App