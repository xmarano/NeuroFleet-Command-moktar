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
        <header className="border-b border-border bg-gradient-to-r from-card/80 via-card/60 to-card/80 backdrop-blur-md px-6 py-4 relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent/5 before:via-transparent before:to-accent/5 before:opacity-50">
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Lightning weight="fill" className="w-8 h-8 text-accent animate-pulse" />
                  <div className="absolute inset-0 blur-xl bg-accent/30 animate-pulse" />
                </div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
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
                className="hover:bg-accent/10 hover:border-accent transition-all duration-300"
              >
                <Download weight="bold" className="w-4 h-4 mr-2" />
                Exporter
              </Button>
              <Button
                variant={isStreamActive ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsStreamActive(!isStreamActive)}
                className="transition-all duration-300"
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
                className="hover:bg-destructive/10 hover:border-destructive hover:text-destructive transition-all duration-300"
              >
                <Trash weight="bold" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </header>

        <div className="px-6 py-5 border-b border-border bg-gradient-to-b from-background to-card/20">
          <StatsOverview incidents={incidentsList} />
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          <div className="h-full border-r border-border p-6 bg-gradient-to-br from-background to-card/10">
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1 flex items-center gap-2">
                  Live Incident Map
                  <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
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
          </div>

          <div className="h-full flex flex-col bg-gradient-to-br from-background to-card/5">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold mb-1">Analysis Feed</h2>
                  <p className="text-sm text-muted-foreground">
                    AI-powered incident analysis and recommendations
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold font-mono text-accent">
                    {incidentsWithAnalysis.length}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Analyzed
                  </div>
                </div>
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

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {pendingIncidents.length > 0 && (
                  <div className="space-y-4">
                    {pendingIncidents.map((incident) => (
                      <div key={incident.id} className="space-y-3">
                        <div className="p-5 border border-border rounded-lg bg-card/50 animate-shimmer">
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
                  incidentsWithAnalysis.map((incident) => (
                    <div 
                      key={incident.id}
                      onClick={() => handleIncidentClick(incident)}
                      className="cursor-pointer"
                    >
                      <AnalysisCard
                        incident={incident}
                        isNew={newIncidentIds.has(incident.id)}
                      />
                    </div>
                  ))
                ) : (
                  !pendingIncidents.length && (
                    <motion.div 
                      className="flex flex-col items-center justify-center py-12 text-center"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Lightning weight="thin" className="w-20 h-20 text-muted-foreground/50 mb-4" />
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