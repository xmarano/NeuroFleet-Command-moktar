import { useEffect, useRef, useState } from "react"
import { useKV } from "@github/spark/hooks"
import type { IncidentWithAnalysis } from "@/lib/types"
import { generateMockIncident } from "@/lib/mockData"
import { analyzeIncident } from "@/lib/aiAnalysis"

const INCIDENT_INTERVAL = 10000

export function useIncidentStream(isActive: boolean) {
  const [incidents, setIncidents] = useKV<IncidentWithAnalysis[]>("incidents", [])
  const [newIncidentIds, setNewIncidentIds] = useState<Set<string>>(new Set())
  const intervalRef = useRef<number | null>(null)
  const isProcessingRef = useRef(false)

  const processNewIncident = async () => {
    if (isProcessingRef.current) return
    
    isProcessingRef.current = true
    
    try {
      const newIncident = generateMockIncident()
      
      setIncidents((current) => [newIncident, ...(current || [])])
      
      const analysis = await analyzeIncident(newIncident)
      
      setIncidents((current) =>
        (current || []).map((inc) =>
          inc.id === newIncident.id ? { ...inc, analysis } : inc
        )
      )
      
      setNewIncidentIds((prev) => new Set(prev).add(newIncident.id))
      
      setTimeout(() => {
        setNewIncidentIds((prev) => {
          const next = new Set(prev)
          next.delete(newIncident.id)
          return next
        })
      }, 3000)
    } catch (error) {
      console.error("Failed to process incident:", error)
    } finally {
      isProcessingRef.current = false
    }
  }

  useEffect(() => {
    if (isActive) {
      processNewIncident()
      
      intervalRef.current = window.setInterval(processNewIncident, INCIDENT_INTERVAL)
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isActive])

  return {
    incidents,
    newIncidentIds,
    clearIncidents: () => setIncidents([])
  }
}
