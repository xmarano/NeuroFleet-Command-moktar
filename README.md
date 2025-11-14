# ⚡ NeuroFleet Command

> Un centre de commandement en temps réel pour la gestion des opérations logistiques de flotte avec analyse IA

![NeuroFleet Command](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript)

## 📋 Table des Matières

- [Vue d'ensemble](#vue-densemble)
- [Fonctionnalités](#fonctionnalités)
- [Technologies](#technologies)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Utilisation](#utilisation)
- [Architecture](#architecture)
- [Structure du Projet](#structure-du-projet)
- [Développement](#développement)
- [Tests](#tests)
- [Déploiement](#déploiement)
- [Contributeurs](#contributeurs)
- [Licence](#licence)

## 🎯 Vue d'ensemble

**NeuroFleet Command** est un tableau de bord sophistiqué de gestion de flotte logistique qui permet aux opérateurs de :
- 📊 Surveiller les incidents de véhicules en temps réel
- 🤖 Recevoir des analyses et recommandations alimentées par l'IA
- 🗺️ Visualiser géographiquement les incidents sur une carte interactive
- 📈 Prendre des décisions éclairées grâce aux KPI en temps réel
- 💾 Exporter les données pour analyse ultérieure

Le système simule un centre de commandement d'entreprise de type militaire ou aérospatial, avec une interface élégante et prestigieuse conçue pour les sessions de surveillance prolongées.

## ✨ Fonctionnalités

### 🎛️ Tableau de Bord Statistiques
- **KPI en temps réel** : Total incidents, incidents critiques, impact CO2, impact temps
- **Calculs dynamiques** : Mises à jour automatiques en fonction des données d'incidents
- **Codage couleur** : Visualisation rapide de la sévérité
- **Animations fluides** : Apparition progressive des cartes statistiques

### 🗺️ Carte des Incidents en Direct
- **Visualisation géographique** : Affichage de tous les incidents sur une carte interactive (Leaflet)
- **Marqueurs améliorés** : Effet de pulsation avec lueur pour les nouveaux incidents
- **Interactions riches** : Animation au survol et clic pour détails
- **Responsive** : Gestion de 20+ marqueurs simultanés

### 🔍 Filtrage et Tri Avancés
- **Filtrage par type** : Traffic, Panne, Météo, Comportement
- **Tri temporel** : Plus récents / Plus anciens
- **Compteurs en temps réel** : Affichage du nombre total vs filtré
- **Interface intuitive** : Badges cliquables et sélecteurs

### 📡 Flux d'Analyse en Temps Réel
- **Stream en direct** : Apparition des incidents analysés par IA
- **Animations sophistiquées** : Effets de scale et fade avec cubic-bezier easing
- **Mise en évidence** : Gradient sur les nouveaux incidents (disparaît après 3s)
- **Scrolling fluide** : Zone de défilement personnalisée

### 🤖 Analyse IA des Incidents
- **Analyse automatique** : Chaque incident reçoit une analyse IA sous 3 secondes
- **Explication contextuelle** : Causes probables en français
- **Recommandations actionnables** : Conseils clairs pour conducteurs/opérateurs
- **Estimation d'impact** : Impact CO2 et temps estimés
- **Gestion d'erreurs** : Fallback sur analyse basique en cas d'échec

### 🎮 Raccourcis Clavier
- `Ctrl+P` : Pause/Reprendre le stream
- `Ctrl+E` : Exporter les données en CSV
- `Ctrl+R` : Réinitialiser les filtres

### 📱 Responsive Design
- **Vue Desktop** : Split-screen avec carte et flux d'analyse
- **Vue Mobile** : Stack vertical avec carte réduite
- **Adaptation automatique** : Breakpoints à 768px et 640px
- **Touch-friendly** : Cibles tactiles minimum 44x44px

## 🛠️ Technologies

### Frontend
- **React 19.0** : Framework UI moderne avec hooks
- **TypeScript 5.7** : Typage statique pour robustesse
- **Vite 6.3** : Build tool ultra-rapide avec HMR
- **Tailwind CSS 4.1** : Framework CSS utility-first
- **Framer Motion 12.6** : Animations fluides et sophistiquées

### Composants UI
- **Radix UI** : Composants accessibles et primitives
- **Lucide React** : Icônes modernes
- **Phosphor Icons** : Icônes complémentaires
- **Sonner** : Notifications toast élégantes

### Cartographie
- **Leaflet 1.9** : Bibliothèque de cartes interactive
- **@types/leaflet** : Définitions TypeScript

### IA & Données
- **GitHub Spark LLM** : Intégration GPT-4o pour analyse
- **Mock Data Generator** : Simulation réaliste d'incidents

### Qualité Code
- **ESLint 9** : Linting JavaScript/TypeScript
- **React Hook Form** : Gestion de formulaires
- **Zod** : Validation de schémas

## 📦 Prérequis

- **Node.js** : version 18.x ou supérieure
- **npm** : version 9.x ou supérieure
- **Git** : Pour cloner le repository

## 🚀 Installation

### 1. Cloner le Repository

```bash
git clone https://github.com/xmarano/NeuroFleet-Command-moktar.git
cd NeuroFleet-Command-moktar
```

### 2. Installer les Dépendances

```bash
npm install
```

### 3. Configuration de l'Environnement

Le projet utilise GitHub Spark pour l'IA. Assurez-vous d'avoir accès à l'environnement Spark.

## ⚙️ Configuration

### Variables d'Environnement

Aucune configuration spécifique n'est requise pour l'environnement de développement local. Le projet utilise les API Spark disponibles dans le contexte d'exécution.

### Personnalisation des Couleurs

Les couleurs sont définies dans `theme.json` et utilisent le système de couleurs OKLCH :
- **Primary** : Deep Space Blue (oklch(0.25 0.08 250))
- **Accent** : Electric Amber (oklch(0.75 0.15 75))
- **Background** : Dark Charcoal (oklch(0.18 0.01 250))

## 🎮 Utilisation

### Démarrer le Serveur de Développement

```bash
npm run dev
```

L'application sera disponible sur `http://localhost:5173`

### Build pour Production

```bash
npm run build
```

Les fichiers de production seront générés dans le dossier `dist/`

### Prévisualiser le Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## 🏗️ Architecture

### Vue d'Ensemble

```
┌─────────────────────────────────────────────────────┐
│                  React Frontend                      │
│  ┌────────────────┐         ┌──────────────────┐   │
│  │  Components    │         │  Hooks           │   │
│  │  - App.tsx     │◄────────┤  - useIncident   │   │
│  │  - Map         │         │  - useKeyboard   │   │
│  │  - Analytics   │         │  - useMobile     │   │
│  └────────────────┘         └──────────────────┘   │
│         │                            │               │
│         ▼                            ▼               │
│  ┌────────────────┐         ┌──────────────────┐   │
│  │  UI Library    │         │  Data Layer      │   │
│  │  - Radix UI    │         │  - Mock Data     │   │
│  │  - Custom      │         │  - Types         │   │
│  └────────────────┘         └──────────────────┘   │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
         ┌──────────────────────────┐
         │   GitHub Spark AI (GPT)  │
         │   - Incident Analysis    │
         │   - Recommendations      │
         └──────────────────────────┘
```

### Flux de Données

1. **Génération d'Incident** : `mockData.ts` génère des incidents réalistes
2. **Stream en Temps Réel** : `useIncidentStream` hook gère le flux
3. **Analyse IA** : `aiAnalysis.ts` appelle GPT-4o pour analyser
4. **Rendu UI** : Components React affichent les données
5. **Interactions** : Utilisateur filtre, trie, exporte

### Pattern de Composants

```typescript
// Hook personnalisé pour gestion d'état
const { incidents, newIncidentIds } = useIncidentStream(isActive)

// Filtrage et tri mémorisés
const filtered = useMemo(() => {
  return incidents.filter(...).sort(...)
}, [incidents, filters])

// Rendu avec animations
<AnimatePresence>
  {filtered.map(incident => (
    <AnalysisCard key={incident.id} incident={incident} />
  ))}
</AnimatePresence>
```

## 📁 Structure du Projet

```
NeuroFleet-Command-moktar/
├── src/
│   ├── components/          # Composants React
│   │   ├── ui/             # Composants UI réutilisables
│   │   ├── AnalysisCard.tsx
│   │   ├── IncidentMap.tsx
│   │   ├── FilterControls.tsx
│   │   ├── LiveIndicator.tsx
│   │   └── StatsOverview.tsx
│   ├── hooks/              # Hooks React personnalisés
│   │   ├── use-incident-stream.ts
│   │   ├── use-keyboard-shortcuts.ts
│   │   └── use-mobile.ts
│   ├── lib/                # Bibliothèques et utilitaires
│   │   ├── types.ts        # Définitions TypeScript
│   │   ├── aiAnalysis.ts   # Intégration IA
│   │   ├── mockData.ts     # Générateur de données
│   │   └── utils.ts        # Fonctions utilitaires
│   ├── styles/             # Styles globaux
│   ├── App.tsx             # Composant principal
│   └── main.tsx            # Point d'entrée
├── public/                 # Assets statiques
├── index.html              # Template HTML
├── package.json            # Dépendances npm
├── tsconfig.json           # Configuration TypeScript
├── vite.config.ts          # Configuration Vite
├── tailwind.config.js      # Configuration Tailwind
├── theme.json              # Thème de couleurs
├── PRD.md                  # Product Requirements Document
├── README.md               # Ce fichier
├── problematique.md        # Description de la problématique
└── LICENSE                 # Licence MIT
```

## 💻 Développement

### Workflow de Développement

1. **Créer une branche** : `git checkout -b feature/ma-fonctionnalite`
2. **Développer** : Modifier le code avec hot-reload
3. **Tester** : Vérifier dans le navigateur
4. **Linter** : `npm run lint`
5. **Commit** : `git commit -m "feat: ma fonctionnalité"`
6. **Push** : `git push origin feature/ma-fonctionnalite`

### Conventions de Code

- **Composants** : PascalCase (`AnalysisCard.tsx`)
- **Hooks** : camelCase avec préfixe `use` (`useIncidentStream.ts`)
- **Types** : PascalCase (`IncidentType`)
- **Constantes** : UPPER_SNAKE_CASE (`VEHICLE_NAMES`)
- **Fonctions** : camelCase (`generateMockIncident`)

### Standards TypeScript

```typescript
// ✅ Bon : Types explicites
interface Props {
  incident: IncidentWithAnalysis
  isNew: boolean
}

// ✅ Bon : Return types explicites
function analyzeIncident(incident: Incident): Promise<Analysis>

// ❌ Éviter : Types implicites
function process(data) { ... }
```

### Performance

- **Mémoïsation** : Utiliser `useMemo` pour calculs coûteux
- **Callback optimisés** : Utiliser `useCallback` pour fonctions passées aux enfants
- **Lazy loading** : Charger composants à la demande si nécessaire
- **Animation throttling** : Limiter re-renders pendant animations

## 🧪 Tests

### Tests Manuels

1. **Test de génération** : Vérifier que les incidents apparaissent régulièrement
2. **Test d'analyse IA** : Vérifier les analyses en français
3. **Test de filtrage** : Tester tous les types d'incidents
4. **Test responsive** : Redimensionner la fenêtre
5. **Test d'export** : Exporter et vérifier le CSV

### Scénarios de Test

- ✅ Génération continue d'incidents (≈1 toutes les 10s)
- ✅ Analyse IA en < 3 secondes
- ✅ Filtrage par type fonctionne
- ✅ Tri chronologique fonctionne
- ✅ Export CSV inclut toutes les colonnes
- ✅ Carte affiche tous les marqueurs
- ✅ Animations sont fluides (60 FPS)
- ✅ Mobile layout à < 768px

## 🚀 Déploiement

### Build de Production

```bash
npm run build
```

### Optimisation

Le build Vite optimise automatiquement :
- ⚡ Tree-shaking pour réduire la taille
- 📦 Code splitting par route
- 🗜️ Minification JS/CSS
- 🖼️ Optimisation des assets
- 💾 Cache busting automatique

### Déploiement sur GitHub Pages

```bash
# Après avoir build
npm run build

# Déployer le dossier dist/
# (Utiliser GitHub Actions ou gh-pages)
```

### Variables d'Environnement Production

```bash
# .env.production
VITE_APP_VERSION=1.0.0
```

## 🎨 Personnalisation

### Modifier les Couleurs

Éditer `theme.json` :

```json
{
  "colors": {
    "accent": "oklch(0.75 0.15 75)"  // Modifier ici
  }
}
```

### Ajouter un Type d'Incident

1. Modifier `src/lib/types.ts` :
```typescript
export type IncidentType = "traffic" | "breakdown" | "weather" | "behavior" | "nouveau"
```

2. Ajouter templates dans `src/lib/mockData.ts` :
```typescript
const INCIDENT_TEMPLATES = {
  // ...
  nouveau: ["Description 1", "Description 2"]
}
```

3. Ajouter label dans `src/lib/aiAnalysis.ts` :
```typescript
const INCIDENT_TYPE_LABELS = {
  // ...
  nouveau: "nouveau type"
}
```

### Modifier la Fréquence des Incidents

Dans `src/hooks/use-incident-stream.ts`, modifier l'intervalle :

```typescript
const interval = setInterval(() => {
  // ...
}, 10000) // Changer ici (en millisecondes)
```

## 🤝 Contributeurs

- **Développeur Principal** : [xmarano](https://github.com/xmarano)
- **Équipe** : NeuroFleet Command Team

### Comment Contribuer

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changes (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

```
MIT License - Copyright (c) 2024 NeuroFleet Command

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files...
```

## 🙏 Remerciements

- **GitHub Spark** : Pour l'infrastructure et les capacités IA
- **Radix UI** : Pour les composants accessibles
- **Leaflet** : Pour la cartographie interactive
- **Tailwind CSS** : Pour le système de design utility-first
- **OpenStreetMap** : Pour les données cartographiques

## 📞 Support

- **Issues** : [GitHub Issues](https://github.com/xmarano/NeuroFleet-Command-moktar/issues)
- **Documentation** : Voir `PRD.md` pour les spécifications détaillées
- **Email** : support@neurofleet.example.com

## 🗺️ Roadmap

### Version 1.1 (À venir)
- [ ] Support multilingue (EN/FR/ES)
- [ ] Mode sombre/clair toggle
- [ ] Notifications push pour incidents critiques
- [ ] Historique des incidents avec pagination

### Version 2.0 (Futur)
- [ ] Intégration base de données réelle (Supabase)
- [ ] Authentification utilisateurs
- [ ] Dashboard multi-flotte
- [ ] API REST pour intégrations tierces
- [ ] Machine learning pour prédiction d'incidents

---

**Made with ⚡ by the NeuroFleet Team**
