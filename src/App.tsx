import { useState } from "react"
import { IncidentMap } from "./components/IncidentMap"
import { AnalysisCard } from "./components/AnalysisCard"
import { LiveIndicator } from "./components/LiveIndicator"
import { ScrollArea } from "./components/ui/scroll-area"
import { Button } from "./components/ui/button"
import { Separator } from "./components/ui/separator"
import { Skeleton } from "./components/ui/skeleton"
import { Lightning, Trash } from "@phosphor-icons/react"
import { useIncidentStream } from "./hooks/use-incident-stream"

function App() {
  const [isStreamActive, setIsStreamActive] = useState(true)
  const { incidents, newIncidentIds, clearIncidents } = useIncidentStream(isStreamActive)

  const incidentsList = incidents || []
  const incidentsWithAnalysis = incidentsList.filter((i) => i.analysis)
  const pendingIncidents = incidentsList.filter((i) => !i.analysis)

  return (
    <div className="h-screen w-screen bg-background text-foreground overflow-hidden">
      <div className="h-full flex flex-col">
        <header className="border-b border-border bg-card/50 backdrop-blur-sm px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <Lightning weight="fill" className="w-8 h-8 text-accent" />
                <h1 className="text-3xl font-bold tracking-tight">
                  NeuroFleet Command
                </h1>
              </div>
              <Separator orientation="vertical" className="h-8" />
              <LiveIndicator isActive={isStreamActive} />
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant={isStreamActive ? "secondary" : "default"}
                size="sm"
                onClick={() => setIsStreamActive(!isStreamActive)}
              >
                {isStreamActive ? "Pause Stream" : "Start Stream"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearIncidents}
                disabled={incidentsList.length === 0}
              >
                <Trash weight="bold" className="w-4 h-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>
        </header>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0 overflow-hidden">
          <div className="h-full border-r border-border p-6">
            <div className="h-full flex flex-col">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-1">Live Incident Map</h2>
                <p className="text-sm text-muted-foreground">
                  Real-time geographic visualization of fleet incidents
                </p>
              </div>
              <div className="flex-1 min-h-0">
                <IncidentMap incidents={incidentsList} />
              </div>
            </div>
          </div>

          <div className="h-full flex flex-col">
            <div className="border-b border-border px-6 py-4">
              <div className="flex items-center justify-between">
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
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 space-y-4">
                {pendingIncidents.length > 0 && (
                  <div className="space-y-4">
                    {pendingIncidents.map((incident) => (
                      <div key={incident.id} className="space-y-3">
                        <Skeleton className="h-32 w-full" />
                      </div>
                    ))}
                  </div>
                )}

                {incidentsWithAnalysis.length > 0 ? (
                  incidentsWithAnalysis.map((incident) => (
                    <AnalysisCard
                      key={incident.id}
                      incident={incident}
                      isNew={newIncidentIds.has(incident.id)}
                    />
                  ))
                ) : (
                  !pendingIncidents.length && (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Lightning weight="thin" className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        Waiting for incidents...
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md">
                        The system is monitoring your fleet in real-time. New incidents
                        will appear here automatically with AI-powered analysis.
                      </p>
                    </div>
                  )
                )}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App