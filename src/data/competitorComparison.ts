export type AdoptionDecision = 'adopt' | 'evaluate' | 'skip'

export type FeatureCategory =
  | 'Lane & Journey Tracking'
  | 'In-Store Crew Display'
  | 'BOH Correlation & Alerts'
  | 'Vision AI & Footage'
  | 'Reporting & Executive BI'
  | 'Hardware & Integrations'

export interface ComparisonFeature {
  id: string
  category: FeatureCategory
  feature: string
  whyItMatters: string
  fingermark: {
    supported: 'full' | 'partial' | 'none'
    detail: string
  }
  berryAi: {
    supported: 'full' | 'partial' | 'none'
    detail: string
  }
  defaultDecision: AdoptionDecision
  defaultNote: string
}

export const FEATURE_CATEGORIES: readonly FeatureCategory[] = [
  'Lane & Journey Tracking',
  'In-Store Crew Display',
  'BOH Correlation & Alerts',
  'Vision AI & Footage',
  'Reporting & Executive BI',
  'Hardware & Integrations',
] as const

export const COMPETITOR_FEATURES: readonly ComparisonFeature[] = [
  {
    id: 'pre-speaker-queue',
    category: 'Lane & Journey Tracking',
    feature: 'Pre-Menu / Pre-Order Queue Wait Time',
    whyItMatters:
      'Legacy inductive loop timers start at the speaker box and completely miss long entry queues.',
    fingermark: {
      supported: 'full',
      detail:
        'Tracks Pre-Order entry queue count and wait seconds via Vision AI; triggers kitchen prep alerts when 5+ cars stack.',
    },
    berryAi: {
      supported: 'full',
      detail:
        'Dedicated "Queue Time" & "Cars in Queue" KPI tiles with live AVG vs. Goal and red alert state at 6+ cars.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Core differentiator over legacy loop timers — must include.',
  },
  {
    id: 'dual-lane-cod',
    category: 'Lane & Journey Tracking',
    feature: 'Dual-Lane / Y-Merge Order Tracking (COD 1 & 2)',
    whyItMatters:
      'Modern QSR drive-thrus split into side-by-side or tandem speaker lanes that loops often misattribute after merge.',
    fingermark: {
      supported: 'full',
      detail:
        'Displays COD 1 and COD 2 order station cards with active/idle state and per-station seconds.',
    },
    berryAi: {
      supported: 'full',
      detail:
        'Separate Menu Board 1 & Menu Board 2 tiles plus visual U-shaped dual-lane car stack showing exact merge order.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Visual U-lane merge view from Berry AI is very intuitive for crew.',
  },
  {
    id: 'drive-offs-pullouts',
    category: 'Lane & Journey Tracking',
    feature: 'Drive-Offs / Pull-Outs (Abandonment Tracking)',
    whyItMatters:
      'Quantifies direct lost revenue when cars bail from the pre-menu queue or exit mid-lane.',
    fingermark: {
      supported: 'full',
      detail:
        '"Pull Outs Today" circular ring gauge measured against a daily store limit (e.g., 4 / 8 Limit).',
    },
    berryAi: {
      supported: 'full',
      detail:
        '"Today\'s Drive-offs" live counter on crew board + lost-revenue dollar calculation in Berry Board.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Combine daily limit threshold + estimated lost $ metric.',
  },
  {
    id: 'parked-wait-bays',
    category: 'Lane & Journey Tracking',
    feature: 'Wait Bays / Pull-Ahead / Curbside Tracking',
    whyItMatters:
      'Staff often pull cars past window loops to game speed-of-service targets ("loop cheating"), hiding long waits.',
    fingermark: {
      supported: 'full',
      detail:
        'Dedicated Parked Car Bays (Bay 1/2/3 top-down car timers), Parked Car Avg (s), % of cars parked vs. <7% target, and Pull-Fwd lane.',
    },
    berryAi: {
      supported: 'full',
      detail:
        'Tracks Pull-Ahead zone wait times and Curbside/Mobile pickup stalls via exterior cameras so timers cannot be gamed.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Fingermark per-bay visual timer + % parked target prevents gaming.',
  },
  {
    id: 'line-busting',
    category: 'Lane & Journey Tracking',
    feature: 'Handheld Line-Busting Crew Detection & Speed',
    whyItMatters:
      'Measures throughput impact when tablet-equipped staff walk outside to take orders in the queue.',
    fingermark: {
      supported: 'partial',
      detail:
        'Tracks labor positioning and zone movement, though less explicitly branded around exterior tablet line-busting.',
    },
    berryAi: {
      supported: 'full',
      detail:
        'AI detects exterior staff alongside vehicles (green person bounding box) and measures dedicated line-busting speed.',
    },
    defaultDecision: 'evaluate',
    defaultNote: 'Valuable for high-volume chicken & coffee chains running handhelds.',
  },
  {
    id: 'crew-board-ui',
    category: 'In-Store Crew Display',
    feature: 'Real-Time In-Store Kitchen Monitor UX',
    whyItMatters:
      'Frontline workers glance at monitors from 10–20 ft away during rush; readability and instant color coding are critical.',
    fingermark: {
      supported: 'full',
      detail:
        'Clean light UI with drag-and-drop widgets: tri-color OEPE% rings, 5-hour 15-min bar chart, and 15-min car target thermometer.',
    },
    berryAi: {
      supported: 'full',
      detail:
        'High-contrast dark TV board: 6 giant digital KPI tiles, U-shaped live car lane map, and split-screen live camera feeds.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Support light/dark theme + configurable widget layout + lane map.',
  },
  {
    id: 'boh-correlation',
    category: 'BOH Correlation & Alerts',
    feature: 'Front-of-House ↔ Back-of-House Station Correlation',
    whyItMatters:
      'Connects drive-thru slowdowns to actual kitchen causes (e.g., empty fry hopper or espresso bottleneck).',
    fingermark: {
      supported: 'full',
      detail:
        'Signature strength: monitors indoor kitchen workstations (fry bay %, drink station) alongside outdoor lanes to pinpoint root causes.',
    },
    berryAi: {
      supported: 'partial',
      detail:
        'Offers separate AI Counter/Dining Room Timer & Loss Prevention, but drive-thru product focuses primarily on exterior lane + POS.',
    },
    defaultDecision: 'evaluate',
    defaultNote: 'Strong differentiator if indoor kitchen cameras are in scope.',
  },
  {
    id: 'trigger-action-alerts',
    category: 'BOH Correlation & Alerts',
    feature: 'Real-Time Prescriptive Action Alerts',
    whyItMatters:
      'Prompts new hires with concrete instructions in the moment rather than passive red numbers.',
    fingermark: {
      supported: 'full',
      detail:
        'Full-screen / banner prescriptive prompts (e.g., "Pre-order queue is 5+ cars -> Put more fries down", "Wait bay: waiting 12 mins") + SMS/email.',
    },
    berryAi: {
      supported: 'partial',
      detail:
        'Color-coded tile alerts on the in-store monitor when Queue Time or Cars in Queue exceed goals.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Prescriptive "action to take" prompts beat raw timer alarms.',
  },
  {
    id: 'live-ai-overlays',
    category: 'Vision AI & Footage',
    feature: 'Live Camera Bounding Boxes, Vehicle IDs & Trajectories',
    whyItMatters:
      'Builds 100% crew and operator trust by visibly proving how cars are tracked from entry to exit.',
    fingermark: {
      supported: 'full',
      detail:
        'Heatmaps & trajectory visualization plus Context Capture (tagged before/during/after video clips for staff coaching).',
    },
    berryAi: {
      supported: 'full',
      detail:
        'Live split-screen camera feed directly on the crew monitor with persistent vehicle IDs (#062837) and zone overlays.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Include persistent vehicle ID tracking + one-click clip tagging.',
  },
  {
    id: 'daily-pulse-coaching',
    category: 'Reporting & Executive BI',
    feature: 'Daily Pulse Digest & AI Coaching Recommendations',
    whyItMatters:
      'Store managers rarely have time to mine raw charts; digestible daily highlights drive shift huddles.',
    fingermark: {
      supported: 'full',
      detail:
        'Mobile "Daily Pulse" report with audio playback, focused weekly campaign (e.g., Present Times), deltas, and AI action bullets.',
    },
    berryAi: {
      supported: 'full',
      detail:
        'Automated daily emailed manager reports + Berry Board shift/daypart trend breakdowns for staffing.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Mobile-friendly daily briefing + audio summary is great UX.',
  },
  {
    id: 'multi-store-roi',
    category: 'Reporting & Executive BI',
    feature: 'Fleet Leaderboards & Revenue ROI Calculator',
    whyItMatters:
      'Drives healthy competition across franchise stores and proves financial ROI to brand leadership.',
    fingermark: {
      supported: 'full',
      detail:
        'Cross-location leaderboards ("Spot your best, support the rest") with KPI targets and direct footage drill-down.',
    },
    berryAi: {
      supported: 'full',
      detail:
        'Brand leadership BI view with multi-quarter trends, comps lift, and lost/reclaimed revenue calculator.',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Include both store ranking leaderboard and $ revenue impact model.',
  },
  {
    id: 'camera-pos-integration',
    category: 'Hardware & Integrations',
    feature: 'Camera Reuse, Edge Server & POS Matching',
    whyItMatters:
      'Determines installation cost, store downtime (zero trenching vs. loops), and order-level accuracy.',
    fingermark: {
      supported: 'full',
      detail:
        'Works with existing IP cameras or supplied kits + Eyecue Edge Server (24/7 NVR + AI) + POS/KDS/BI integrations (SOC 2 Type II).',
    },
    berryAi: {
      supported: 'full',
      detail:
        'Purpose-built exterior cameras (or qualified existing) + on-site AI edge server + in-store monitors + POS transaction matching (ISO 27001).',
    },
    defaultDecision: 'adopt',
    defaultNote: 'Matching vehicle IDs to POS ticket size/items unlocks rich analytics.',
  },
]
