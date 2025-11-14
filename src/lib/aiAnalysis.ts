import type { Analysis, Incident } from './types'

const INCIDENT_TYPE_LABELS: Record<string, string> = {
  traffic: "trafic",
  breakdown: "panne mécanique",
  weather: "conditions météorologiques",
  behavior: "comportement du conducteur"
}

export async function analyzeIncident(incident: Incident): Promise<Analysis> {
  const incidentTypeLabel = INCIDENT_TYPE_LABELS[incident.type] || incident.type

  const promptText = `Tu es un superviseur logistique expert. Un incident de type "${incidentTypeLabel}" est rapporté: "${incident.description}".

Génère une analyse structurée avec:
- explanation: Une courte explication des causes probables (1-2 phrases, français)
- recommendation: Une recommandation claire et actionnable pour le chauffeur ou l'opérateur (1 phrase, français)
- impactCo2: Estimation de l'impact CO2 (format: "+5kg" ou "-2kg" ou "0kg")
- impactTime: Estimation de l'impact temps (format: "+20min" ou "+1h30" ou "0min")

Réponds en JSON avec exactement ces 4 propriétés. Sois concis et professionnel.`

  try {
    const response = await window.spark.llm(promptText, "gpt-4o", true)
    const parsed = JSON.parse(response)
    
    return {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      incidentId: incident.id,
      explanation: parsed.explanation || "Analyse en cours...",
      recommendation: parsed.recommendation || "Recommandation en attente...",
      impactCo2: parsed.impactCo2 || "0kg",
      impactTime: parsed.impactTime || "0min",
      createdAt: new Date().toISOString()
    }
  } catch (error) {
    console.error("AI analysis failed:", error)
    
    return {
      id: `analysis-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      incidentId: incident.id,
      explanation: "L'analyse automatique a rencontré une difficulté. Veuillez vérifier manuellement.",
      recommendation: "Contacter le chauffeur pour obtenir plus d'informations.",
      impactCo2: "0kg",
      impactTime: "+10min",
      createdAt: new Date().toISOString()
    }
  }
}
