# NeuroFleet Command - Product Requirements Document

A real-time logistics fleet operations command center dashboard that empowers operations managers to monitor vehicle incidents, receive AI-powered analysis, make informed decisions instantly, and interact with data through an elegant, prestigious interface.

**Experience Qualities**:
1. **Authoritative** - The interface conveys control and mastery, like a high-tech command center where every piece of information is presented with precision and confidence
2. **Responsive & Interactive** - Real-time updates feel instantaneous and fluid, with sophisticated animations and micro-interactions that create a sense of living, breathing data
3. **Premium & Refined** - The design emphasizes attention to detail with polished animations, sophisticated color gradients, and thoughtful spacing that projects quality and prestige

**Complexity Level**: Complex Application (advanced functionality, real-time data streams, AI integration, database operations)
- This is a sophisticated operations dashboard requiring real-time subscriptions, AI analysis triggers, map visualization, and multiple data relationships. It simulates enterprise fleet management software.

## Essential Features

### Statistics Dashboard
- **Functionality**: Real-time KPI overview showing total incidents, critical incidents, cumulative CO2 impact, and time impact
- **Purpose**: Provides at-a-glance operational metrics for quick decision-making and trend awareness
- **Trigger**: Page load and real-time updates as incidents are analyzed
- **Progression**: Dashboard loads → Stats calculate from incident data → Cards animate in with staggered timing → Values update in real-time
- **Success Criteria**: All stats accurately reflect current data, animations are smooth, color coding matches severity levels

### Live Incident Map
- **Functionality**: Interactive map displaying all fleet incidents with enhanced, pulsing geographic markers that respond to user interaction
- **Purpose**: Provides spatial awareness of problems across the fleet territory with premium visual feedback
- **Trigger**: Page load, real-time incident insertion, and user clicks
- **Progression**: User views dashboard → Map loads incidents → Enhanced markers pulse with glow effects → User hovers over marker (scale animation) → User clicks marker → Opens detailed dialog
- **Success Criteria**: All incidents appear as enhanced markers, hover states are smooth, clicking opens incident details dialog, map is responsive with 20+ markers

### Advanced Filtering & Sorting

### Real-Time Analysis Feed
- **Functionality**: Live-updating stream of AI-analyzed incidents appearing as enhanced cards with sophisticated animations
- **Purpose**: Enables immediate awareness of new problems and AI recommendations with premium visual presentation
- **Trigger**: New incident creation and AI analysis completion
- **Progression**: Incident created → AI analyzes → Analysis card animates in with scale and fade → Card features gradient highlights if new → Hover shows scale effect → Click opens details dialog
- **Success Criteria**: New cards appear within 2 seconds, sophisticated animations are smooth (cubic-bezier easing), new incident highlighting fades after 3s, all fields display correctly

### AI-Powered Incident Analysis
- **Functionality**: Automatic AI analysis of each incident generating explanations, recommendations, and impact estimates
- **Purpose**: Augments human decision-making by providing instant expert analysis at scale
- **Trigger**: Database trigger fires after new incident insertion
- **Progression**: Incident created → Trigger detects → AI API called with incident type and description → AI generates JSON response → Analysis saved to database → Frontend displays results
- **Success Criteria**: Every incident receives analysis within 3 seconds, AI responses are contextually relevant, JSON parsing succeeds 100% of the time

### Mock Data Simulation
- **Functionality**: Background script generating realistic incident data at intervals
- **Purpose**: Demonstrates real-time capabilities and provides continuous data stream for testing
- **Trigger**: Script runs on loop (every 10 seconds)
- **Progression**: Timer expires → Script generates random incident (type, description, location) → Inserts into Supabase → Incident ID returned
- **Success Criteria**: Incidents appear regularly, data is varied and realistic, no duplicate incidents, script runs indefinitely without crashes

## Edge Case Handling
- **AI API Failures**: Display "Analysis pending..." state, retry mechanism with exponential backoff, fallback to basic rule-based analysis after 3 failures
- **Network Disconnection**: Show connection status indicator, queue updates, replay missed events when reconnected using Supabase's offline-first capabilities
- **Malformed AI Responses**: JSON validation layer, default values for missing fields, log errors for debugging
- **Empty States**: When no incidents exist, display helpful onboarding message with "Waiting for incidents..." animation
- **Map Loading Errors**: Fallback to list view of incidents if Leaflet fails to initialize, error message with refresh option
- **Concurrent Updates**: Proper React state management to handle multiple simultaneous real-time updates without race conditions

## Design Direction
The design should evoke the feeling of a high-stakes military or aerospace command center - serious, focused, and information-dense while remaining elegant. Think SpaceX mission control meets modern SaaS: dark backgrounds that reduce eye strain during long monitoring sessions, with vibrant accent colors (electric blue, warning amber, critical red) that make important data pop. The interface should feel authoritative and professional, using a minimal aesthetic where every element serves a functional purpose. Real-time updates should be noticeable but not distracting, using subtle animations that guide attention without breaking concentration.

## Color Selection
**Complementary color scheme** - Deep space blue backgrounds paired with warm amber accents create natural contrast that emphasizes critical information while maintaining professional atmosphere.

- **Primary Color**: Deep Space Blue (oklch(0.25 0.08 250)) - Communicates technology, trust, and professionalism; used for primary actions and key UI elements
- **Secondary Colors**: 
  - Slate Gray (oklch(0.35 0.02 250)) - Supporting panels and cards, provides depth without distraction
  - Dark Charcoal (oklch(0.18 0.01 250)) - Main background, reduces eye strain for long sessions
- **Accent Color**: Electric Amber (oklch(0.75 0.15 75)) - High visibility for critical alerts, CTAs, and active states; demands attention without alarm
- **Foreground/Background Pairings**:
  - Background (Dark Charcoal oklch(0.18 0.01 250)): Light Gray text (oklch(0.85 0.02 250)) - Ratio 9.2:1 ✓
  - Card (Slate Gray oklch(0.35 0.02 250)): White text (oklch(0.98 0 0)) - Ratio 8.5:1 ✓
  - Primary (Deep Space Blue oklch(0.25 0.08 250)): White text (oklch(0.98 0 0)) - Ratio 10.1:1 ✓
  - Accent (Electric Amber oklch(0.75 0.15 75)): Dark text (oklch(0.18 0.01 250)) - Ratio 8.8:1 ✓
  - Secondary (Slate Gray oklch(0.35 0.02 250)): Light Gray text (oklch(0.85 0.02 250)) - Ratio 5.2:1 ✓

## Font Selection
**Inter** (primary) and **JetBrains Mono** (monospace for data) - Inter's clean geometric forms and excellent legibility at small sizes make it ideal for dense information displays, while JetBrains Mono provides technical credibility for timestamps, IDs, and numerical data.

- **Typographic Hierarchy**:
  - H1 (Dashboard Title): Inter Bold/32px/tight (-0.02em) - Command authority
  - H2 (Section Headers): Inter SemiBold/20px/tight (-0.01em) - Clear organization
  - H3 (Card Titles): Inter Medium/16px/normal - Incident identification
  - Body (Card Content): Inter Regular/14px/relaxed (0.01em) - Maximum readability
  - Caption (Timestamps/Metadata): JetBrains Mono Regular/12px/normal - Technical precision
  - Data (Impacts/Numbers): JetBrains Mono Medium/14px/normal - Emphasis on metrics

## Animations
Animations should feel precise and purposeful, like the smooth mechanical movements of high-tech machinery. Every animation reinforces the sense of a living system responding to real-world events.

- **Purposeful Meaning**: Motion communicates urgency and data freshness - new incidents should "arrive" with weight and presence, while status updates should feel smooth and continuous
- **Hierarchy of Movement**: 
  - **Primary**: New analysis cards sliding in from top with subtle scale effect (high importance, demands attention)
  - **Secondary**: Map markers pulsing on creation (medium importance, spatial awareness)
  - **Tertiary**: Hover states on cards with gentle lift effect (low importance, affordance)
  - **Ambient**: Subtle pulse on live status indicator (continuous, reassurance of system health)

Animation specifications:
- New card entry: 400ms ease-out with slide-down + fade-in + scale (0.95→1)
- Card hover: 150ms ease-out with translate-y and shadow change
- Map marker pulse: 2s infinite ease-in-out with scale and opacity
- Status indicator pulse: 1.5s infinite ease-in-out with opacity only
- Skeleton loading: 1.2s infinite linear shimmer effect

## Component Selection

- **Components**:
  - **Card** - Primary container for analysis feed items; modified with darker background, subtle border, and hover lift effect
  - **Badge** - Incident type indicators (traffic, breakdown, weather, behavior); color-coded with custom variants
  - **Separator** - Divides sections within cards; reduced opacity for subtlety
  - **ScrollArea** - Smooth scrolling for analysis feed with custom dark scrollbar
  - **Skeleton** - Loading states for cards and map; animated shimmer effect in brand colors
  - **Alert** - Connection status and error messages; positioned as toast-style notifications

- **Customizations**:
  - **IncidentMap Component** - Custom Leaflet integration with dark tile layer, custom marker icons color-coded by incident type, popup styling matching war room theme
  - **AnalysisCard Component** - Custom card layout with icon header, expandable details, timestamp formatting, and impact metrics visualization
  - **LiveIndicator Component** - Custom animated pulse dot showing real-time connection status
  - **ImpactMetric Component** - Custom display for CO2 and time impacts with iconography and conditional color (positive/negative)

- **States**:
  - **Cards**: Default (subtle shadow), Hover (elevated shadow + slight lift), New (highlighted border that fades after 3s)
  - **Map Markers**: Default (solid), Active (pulsing), Clicked (enlarged with popup)
  - **Connection Indicator**: Connected (green pulse), Disconnected (red static), Reconnecting (amber pulse fast)
  - **Feed**: Loading (skeleton cards), Empty (centered message), Populated (scrollable list)

- **Icon Selection**:
  - Warning (triangle) - General alerts and cautions
  - Truck - Vehicle/fleet identification
  - Lightning - Real-time/live indicators
  - MapPin - Location markers and geographic data
  - Clock - Time impacts and timestamps
  - Leaf - CO2 environmental impacts
  - ArrowRight - Recommendations and actions
  - Circle (dot) - Status indicators and bullets
  - X - Close actions and dismissals

- **Spacing**:
  - Container padding: p-6 (24px) for main layout
  - Card padding: p-4 (16px) internal spacing
  - Card gaps: gap-4 (16px) between feed items
  - Section gaps: gap-6 (24px) between major sections
  - Icon spacing: gap-2 (8px) for icon-text pairs
  - Grid gutters: gap-8 (32px) for map-feed split

- **Mobile**:
  - Stack map above feed in single column at <768px
  - Map height reduces from 100vh to 50vh on mobile
  - Card text sizes reduce by 2px at <640px
  - Touch-friendly tap targets minimum 44x44px
  - Simplified card layout hiding secondary metadata on mobile
  - Collapsible sections using Accordion component for dense data
