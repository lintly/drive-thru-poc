import { useCallback, useEffect, useState } from 'react'

export interface ParkedBayCar {
  bayNumber: 1 | 2 | 3
  occupied: boolean
  waitSeconds: number
  recentClearSeconds: number
  vehicleColor: string
  orderLabel: string
}

export interface FingermarkAlert {
  id: string
  type: 'wait-bay' | 'fry-bay' | 'pull-out'
  severity: 'warning' | 'critical' | 'action'
  title: string
  subtitle: string
  actionPrompt: string
  triggeredAt: string
}

export interface TaggedClip {
  id: string
  timestamp: string
  store: string
  stage: string
  fohSummary: string
  bohRootCause: string
  durationSec: number
  tag: 'Training' | 'Bottleneck' | 'Pull-Forward' | 'Best Practice'
}

export interface HourlyBlock {
  hourLabel: string
  cars: number
  oepePct: number
  bars: readonly number[] // 4 x 15-min bar heights (seconds)
}

export interface FingermarkSimState {
  isRunning: boolean
  speed: 1 | 3
  rushMode: boolean
  stages: {
    preOrderSec: number
    preOrderCars: number
    cod1Sec: number
    cod2Sec: number | null
    paymentSec: number
    deliverSec: number
    waitBayAvgSec: number
  }
  presentWindowSec: number
  pullFwdActive: boolean
  pullFwdSec: number
  bays: readonly ParkedBayCar[]
  parkedCarsLastHourCount: number
  parkedCarsLastHourTotal: number
  oepeLastHourPct: number
  oepeLastHourSec: number
  oepeLastDayPct: number
  oepeLastDaySec: number
  pullOutsToday: number
  pullOutsLimit: number
  current15MinCars: number
  current15MinTarget: number
  current15MinSecondsLeft: number
  fryBayLevelPct: number
  espressoPendingDrinks: number
  trailingHours: readonly HourlyBlock[]
  activeOverlayAlert: FingermarkAlert | null
  alertHistory: readonly FingermarkAlert[]
  taggedClips: readonly TaggedClip[]
}

const INITIAL_CLIPS: readonly TaggedClip[] = [
  {
    id: 'clip-1',
    timestamp: 'Today 10:42 AM',
    store: 'Store #104 — Queen St W',
    stage: 'Pre-Order → Fry Station',
    fohSummary: 'Pre-order stack hit 6 cars; Present time spiked to 64s.',
    bohRootCause: 'Fry hopper at 15% with 0 baskets in fryer during rush onset.',
    durationSec: 45,
    tag: 'Bottleneck',
  },
  {
    id: 'clip-2',
    timestamp: 'Today 09:18 AM',
    store: 'Store #104 — Queen St W',
    stage: 'Present → Wait Bay 3',
    fohSummary: '3 consecutive cars pulled forward to Wait Bay (>300s wait).',
    bohRootCause: 'Single barista handling 4 multi-espresso drive-thru orders.',
    durationSec: 60,
    tag: 'Pull-Forward',
  },
  {
    id: 'clip-3',
    timestamp: 'Yesterday 12:35 PM',
    store: 'Store #088 — Dundas East',
    stage: 'End-to-End Flow',
    fohSummary: '214 cars/hr processed at 97% OEPE compliance (82s avg).',
    bohRootCause: 'Proactive fry batching triggered at 4-car pre-order alert.',
    durationSec: 38,
    tag: 'Best Practice',
  },
]

const INITIAL_HOURS: readonly HourlyBlock[] = [
  { hourLabel: '0700', cars: 171, oepePct: 85, bars: [98, 68, 148, 124] },
  { hourLabel: '0800', cars: 214, oepePct: 97, bars: [138, 156, 198, 142] },
  { hourLabel: '0900', cars: 173, oepePct: 77, bars: [155, 132, 136, 96] },
  { hourLabel: '1000', cars: 152, oepePct: 78, bars: [86, 98, 130, 68] },
  { hourLabel: '1100', cars: 72, oepePct: 87, bars: [82, 94, 0, 0] },
]

function nowTimeLabel(): string {
  return new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function useFingermarkSim() {
  const [state, setState] = useState<FingermarkSimState>({
    isRunning: true,
    speed: 1,
    rushMode: false,
    stages: {
      preOrderSec: 68,
      preOrderCars: 4,
      cod1Sec: 22,
      cod2Sec: null,
      paymentSec: 32,
      deliverSec: 24,
      waitBayAvgSec: 150,
    },
    presentWindowSec: 28,
    pullFwdActive: true,
    pullFwdSec: 44,
    bays: [
      {
        bayNumber: 1,
        occupied: true,
        waitSeconds: 134,
        recentClearSeconds: 21,
        vehicleColor: '#eab308',
        orderLabel: '2x Combo + Shake',
      },
      {
        bayNumber: 2,
        occupied: false,
        waitSeconds: 0,
        recentClearSeconds: 88,
        vehicleColor: '#3b82f6',
        orderLabel: 'Empty',
      },
      {
        bayNumber: 3,
        occupied: true,
        waitSeconds: 534,
        recentClearSeconds: 321,
        vehicleColor: '#dc2626',
        orderLabel: 'Family Box (Waiting Fries)',
      },
    ],
    parkedCarsLastHourCount: 12,
    parkedCarsLastHourTotal: 100,
    oepeLastHourPct: 81,
    oepeLastHourSec: 98,
    oepeLastDayPct: 68,
    oepeLastDaySec: 98,
    pullOutsToday: 4,
    pullOutsLimit: 8,
    current15MinCars: 11,
    current15MinTarget: 25,
    current15MinSecondsLeft: 360,
    fryBayLevelPct: 48,
    espressoPendingDrinks: 2,
    trailingHours: INITIAL_HOURS,
    activeOverlayAlert: null,
    alertHistory: [
      {
        id: 'init-1',
        type: 'fry-bay',
        severity: 'action',
        title: 'Pre order queue is 5+ cars',
        subtitle: 'Fry bay sensor at 22% capacity',
        actionPrompt: 'Put more fries down',
        triggeredAt: '11:12:04 AM',
      },
    ],
    taggedClips: INITIAL_CLIPS,
  })

  useEffect(() => {
    if (!state.isRunning) return

    const intervalMs = state.speed === 3 ? 350 : 1000
    const timer = window.setInterval(() => {
      setState((prev) => {
        const rush = prev.rushMode
        const nextBays = prev.bays.map((bay) => {
          if (!bay.occupied) {
            if (rush && Math.random() < 0.08) {
              return {
                ...bay,
                occupied: true,
                waitSeconds: 1,
                vehicleColor: '#f59e0b',
                orderLabel: 'Large Rush Order',
              }
            }
            return bay
          }
          const nextWait = bay.waitSeconds + 1
          // Clear bay occasionally unless it's Bay 3 demonstrating a long wait
          const clearChance = bay.bayNumber === 3 && !rush ? 0.015 : 0.025
          if (nextWait > 95 && Math.random() < clearChance) {
            return {
              ...bay,
              occupied: false,
              waitSeconds: 0,
              recentClearSeconds: nextWait,
              orderLabel: 'Cleared',
            }
          }
          return { ...bay, waitSeconds: nextWait }
        })

        const occupiedBays = nextBays.filter((b) => b.occupied)
        const computedWaitAvg =
          occupiedBays.length > 0
            ? Math.round(
                occupiedBays.reduce((sum, b) => sum + b.waitSeconds, 0) /
                  occupiedBays.length,
              )
            : prev.stages.waitBayAvgSec

        const deltaCars = rush
          ? Math.random() < 0.35
            ? 1
            : 0
          : Math.random() < 0.2
            ? -1
            : Math.random() < 0.22
              ? 1
              : 0
        const nextPreOrderCars = Math.max(
          1,
          Math.min(9, prev.stages.preOrderCars + deltaCars),
        )

        const nextPreOrderSec = Math.max(
          18,
          Math.min(
            145,
            prev.stages.preOrderSec + (rush ? 2 : nextPreOrderCars > 4 ? 1 : -1),
          ),
        )

        const nextCod1 =
          prev.stages.cod1Sec >= (rush ? 46 : 34) ? 8 : prev.stages.cod1Sec + 1
        const nextCod2 = rush
          ? prev.stages.cod2Sec === null
            ? 12
            : prev.stages.cod2Sec >= 40
              ? 9
              : prev.stages.cod2Sec + 1
          : null

        const nextPayment =
          prev.stages.paymentSec >= 42 ? 14 : prev.stages.paymentSec + 1
        const nextDeliver =
          prev.stages.deliverSec >= (rush ? 52 : 36)
            ? 12
            : prev.stages.deliverSec + 1
        const nextPresentWindow =
          prev.presentWindowSec >= (rush ? 95 : 58)
            ? 11
            : prev.presentWindowSec + 1

        // 15-min pacing countdown
        let next15Left = prev.current15MinSecondsLeft - 1
        let next15Cars = prev.current15MinCars
        if (next15Left <= 0) {
          next15Left = 900
          next15Cars = 2
        } else if (nextPresentWindow === 11) {
          next15Cars = Math.min(32, prev.current15MinCars + 1)
        }

        // Fry bay level depletes during rush unless replenished
        const nextFry = rush
          ? Math.max(12, prev.fryBayLevelPct - (Math.random() < 0.45 ? 2 : 0))
          : Math.min(88, prev.fryBayLevelPct + (Math.random() < 0.3 ? 2 : -1))

        const nextOepeHour = rush
          ? Math.max(64, prev.oepeLastHourPct - (Math.random() < 0.2 ? 1 : 0))
          : Math.min(92, prev.oepeLastHourPct + (Math.random() < 0.15 ? 1 : 0))

        const nextOepeSec = rush
          ? Math.min(138, prev.oepeLastHourSec + (Math.random() < 0.25 ? 1 : 0))
          : Math.max(82, prev.oepeLastHourSec - (Math.random() < 0.2 ? 1 : 0))

        // Auto-trigger fry alert if rush pushes queue >= 6 and fry < 25% and no active alert
        let nextAlert = prev.activeOverlayAlert
        let nextHistory = prev.alertHistory
        if (
          !nextAlert &&
          rush &&
          nextPreOrderCars >= 6 &&
          nextFry <= 24 &&
          Math.random() < 0.25
        ) {
          const created: FingermarkAlert = {
            id: `alert-${Date.now()}`,
            type: 'fry-bay',
            severity: 'action',
            title: `Pre order queue is ${nextPreOrderCars}+ cars`,
            subtitle: `Fry bay dropped to ${nextFry}% — stack backup risk`,
            actionPrompt: 'Put more fries down immediately',
            triggeredAt: nowTimeLabel(),
          }
          nextAlert = created
          nextHistory = [created, ...prev.alertHistory.slice(0, 7)]
        }

        return {
          ...prev,
          stages: {
            preOrderSec: nextPreOrderSec,
            preOrderCars: nextPreOrderCars,
            cod1Sec: nextCod1,
            cod2Sec: nextCod2,
            paymentSec: nextPayment,
            deliverSec: nextDeliver,
            waitBayAvgSec: computedWaitAvg,
          },
          presentWindowSec: nextPresentWindow,
          pullFwdSec: prev.pullFwdActive
            ? (prev.pullFwdSec % 75) + 1
            : prev.pullFwdSec,
          bays: nextBays,
          oepeLastHourPct: nextOepeHour,
          oepeLastHourSec: nextOepeSec,
          current15MinCars: next15Cars,
          current15MinSecondsLeft: next15Left,
          fryBayLevelPct: nextFry,
          espressoPendingDrinks: rush ? 5 : 2,
          activeOverlayAlert: nextAlert,
          alertHistory: nextHistory,
        }
      })
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [state.isRunning, state.speed])

  const toggleRunning = useCallback(() => {
    setState((p) => ({ ...p, isRunning: !p.isRunning }))
  }, [])

  const toggleSpeed = useCallback(() => {
    setState((p) => ({ ...p, speed: p.speed === 1 ? 3 : 1 }))
  }, [])

  const toggleRushMode = useCallback(() => {
    setState((p) => ({
      ...p,
      rushMode: !p.rushMode,
      stages: {
        ...p.stages,
        preOrderCars: !p.rushMode ? 6 : 3,
        preOrderSec: !p.rushMode ? 110 : 42,
      },
      fryBayLevelPct: !p.rushMode ? 20 : 72,
    }))
  }, [])

  const triggerWaitBayOverlay = useCallback(() => {
    const created: FingermarkAlert = {
      id: `wait-${Date.now()}`,
      type: 'wait-bay',
      severity: 'critical',
      title: 'Wait bay',
      subtitle: 'A customer has been waiting for 12 mins (Bay 3)',
      actionPrompt: 'Expedite Family Box order & run to Wait Bay 3 now',
      triggeredAt: nowTimeLabel(),
    }
    setState((p) => ({
      ...p,
      bays: p.bays.map((b) =>
        b.bayNumber === 3
          ? {
              ...b,
              occupied: true,
              waitSeconds: 720,
              vehicleColor: '#dc2626',
              orderLabel: 'Family Box (12m Wait!)',
            }
          : b,
      ),
      activeOverlayAlert: created,
      alertHistory: [created, ...p.alertHistory.slice(0, 7)],
    }))
  }, [])

  const triggerFryActionOverlay = useCallback(() => {
    const created: FingermarkAlert = {
      id: `fry-${Date.now()}`,
      type: 'fry-bay',
      severity: 'action',
      title: 'Pre order queue is 5+ cars',
      subtitle: 'BOH Vision AI detected fry hopper below 20%',
      actionPrompt: 'Put more fries down',
      triggeredAt: nowTimeLabel(),
    }
    setState((p) => ({
      ...p,
      fryBayLevelPct: 16,
      stages: { ...p.stages, preOrderCars: 6, preOrderSec: 112 },
      activeOverlayAlert: created,
      alertHistory: [created, ...p.alertHistory.slice(0, 7)],
    }))
  }, [])

  const dismissOverlayAlert = useCallback(() => {
    setState((p) => ({
      ...p,
      activeOverlayAlert: null,
      fryBayLevelPct:
        p.activeOverlayAlert?.type === 'fry-bay' ? 75 : p.fryBayLevelPct,
    }))
  }, [])

  const tagCurrentFootage = useCallback(
    (tag: TaggedClip['tag'] = 'Bottleneck') => {
      setState((p) => {
        const clip: TaggedClip = {
          id: `clip-${Date.now()}`,
          timestamp: `Today ${nowTimeLabel()}`,
          store: 'Store #104 — Queen St W',
          stage: `Pre-Order (${p.stages.preOrderCars} cars) → Kitchen`,
          fohSummary: `OEPE at ${p.oepeLastHourPct}% (${p.oepeLastHourSec}s); Wait Bay Avg ${p.stages.waitBayAvgSec}s.`,
          bohRootCause: `Fry hopper at ${p.fryBayLevelPct}%, ${p.espressoPendingDrinks} espresso drinks queued.`,
          durationSec: 45,
          tag,
        }
        return {
          ...p,
          taggedClips: [clip, ...p.taggedClips],
        }
      })
    },
    [],
  )

  return {
    state,
    toggleRunning,
    toggleSpeed,
    toggleRushMode,
    triggerWaitBayOverlay,
    triggerFryActionOverlay,
    dismissOverlayAlert,
    tagCurrentFootage,
  }
}

export type FingermarkSimController = ReturnType<typeof useFingermarkSim>
