import { useCallback, useEffect, useState } from 'react'

export interface TrackedVehicle {
  id: string // e.g., "#062837"
  zone: 'queue' | 'order1' | 'order2' | 'service' | 'pullAhead' | 'curbside'
  dwellSec: number
  totalSec: number
  color: string
  bodyType: 'SUV' | 'Sedan' | 'Truck' | 'Van'
}

export interface PosMatchedRecord {
  vehicleId: string
  completedAt: string
  lane: 'Lane 1' | 'Lane 2' | 'Line-Buster'
  queueSec: number
  orderSec: number
  windowSec: number
  pullAheadSec: number
  totalSec: number
  posOrderId: string
  itemsSummary: string
  orderTotal: number
}

export interface BerrySimState {
  isRunning: boolean
  speed: 1 | 3
  surgeMode: boolean
  lineBusterActive: boolean
  showAiBoxes: boolean
  queueTimeSec: number
  carsInQueue: number
  menuBoard1Sec: number
  menuBoard2Sec: number
  carCountNow: number
  carCountTwoWkAvg: number
  driveOffsToday: number
  pullAheadAvgSec: number
  lineBustingAvgSec: number
  vehicles: readonly TrackedVehicle[]
  posTransactions: readonly PosMatchedRecord[]
}

const INITIAL_VEHICLES: readonly TrackedVehicle[] = [
  {
    id: '#062835',
    zone: 'service',
    dwellSec: 48,
    totalSec: 174,
    color: '#f8fafc',
    bodyType: 'Truck',
  },
  {
    id: '#062836',
    zone: 'service',
    dwellSec: 31,
    totalSec: 142,
    color: '#ef4444',
    bodyType: 'SUV',
  },
  {
    id: '#062837',
    zone: 'order1',
    dwellSec: 17,
    totalSec: 69,
    color: '#ffffff',
    bodyType: 'SUV',
  },
  {
    id: '#062838',
    zone: 'order2',
    dwellSec: 24,
    totalSec: 61,
    color: '#e2e8f0',
    bodyType: 'Sedan',
  },
  {
    id: '#062839',
    zone: 'queue',
    dwellSec: 17,
    totalSec: 17,
    color: '#cbd5e1',
    bodyType: 'Sedan',
  },
  {
    id: '#062840',
    zone: 'queue',
    dwellSec: 12,
    totalSec: 12,
    color: '#dc2626',
    bodyType: 'SUV',
  },
  {
    id: '#062841',
    zone: 'queue',
    dwellSec: 7,
    totalSec: 7,
    color: '#38bdf8',
    bodyType: 'Truck',
  },
  {
    id: '#062842',
    zone: 'pullAhead',
    dwellSec: 64,
    totalSec: 210,
    color: '#fb923c',
    bodyType: 'Van',
  },
  {
    id: '#062843',
    zone: 'curbside',
    dwellSec: 42,
    totalSec: 95,
    color: '#60a5fa',
    bodyType: 'Sedan',
  },
]

const INITIAL_POS: readonly PosMatchedRecord[] = [
  {
    vehicleId: '#062834',
    completedAt: '11:50:18 AM',
    lane: 'Lane 1',
    queueSec: 22,
    orderSec: 34,
    windowSec: 88,
    pullAheadSec: 0,
    totalSec: 144,
    posOrderId: 'POS-8841',
    itemsSummary: '2x Zax Fingerz Plate, Lg Tea',
    orderTotal: 24.8,
  },
  {
    vehicleId: '#062833',
    completedAt: '11:49:02 AM',
    lane: 'Line-Buster',
    queueSec: 9,
    orderSec: 19,
    windowSec: 74,
    pullAheadSec: 52,
    totalSec: 154,
    posOrderId: 'POS-8839',
    itemsSummary: 'Wings & Things + 4x Tenders',
    orderTotal: 32.5,
  },
  {
    vehicleId: '#062832',
    completedAt: '11:47:41 AM',
    lane: 'Lane 2',
    queueSec: 18,
    orderSec: 29,
    windowSec: 68,
    pullAheadSec: 0,
    totalSec: 115,
    posOrderId: 'POS-8836',
    itemsSummary: 'Signature Sandwich Meal',
    orderTotal: 13.45,
  },
  {
    vehicleId: '#062831',
    completedAt: '11:46:09 AM',
    lane: 'Lane 1',
    queueSec: 35,
    orderSec: 41,
    windowSec: 95,
    pullAheadSec: 84,
    totalSec: 255,
    posOrderId: 'POS-8833',
    itemsSummary: 'Family 20pc Tailgate Pack',
    orderTotal: 46.9,
  },
]

export function formatMmSs(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds))
  const m = Math.floor(safe / 60)
  const s = safe % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

let nextSerial = 62844

export function useBerrySim() {
  const [state, setState] = useState<BerrySimState>({
    isRunning: true,
    speed: 1,
    surgeMode: true, // Starts in rich 6+ queue state matching Berry screenshot
    lineBusterActive: true,
    showAiBoxes: true,
    queueTimeSec: 17,
    carsInQueue: 6,
    menuBoard1Sec: 17,
    menuBoard2Sec: 24,
    carCountNow: 178,
    carCountTwoWkAvg: 148,
    driveOffsToday: 2,
    pullAheadAvgSec: 58,
    lineBustingAvgSec: 21,
    vehicles: INITIAL_VEHICLES,
    posTransactions: INITIAL_POS,
  })

  useEffect(() => {
    if (!state.isRunning) return

    const intervalMs = state.speed === 3 ? 350 : 1000
    const id = window.setInterval(() => {
      setState((prev) => {
        const orderLimit = prev.lineBusterActive ? 28 : 48
        const nextVehicles = prev.vehicles.map((v) => ({
          ...v,
          dwellSec: v.dwellSec + 1,
          totalSec: v.totalSec + 1,
        }))

        let completedCount = 0
        let nextPos = prev.posTransactions

        // Rotate service cars out when dwell > 62s
        const updatedVehicles = nextVehicles.map((v) => {
          if (v.zone === 'service' && v.dwellSec > 62) {
            completedCount += 1
            const newSerial = nextSerial++
            const record: PosMatchedRecord = {
              vehicleId: v.id,
              completedAt: new Date().toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              lane: prev.lineBusterActive ? 'Line-Buster' : 'Lane 1',
              queueSec: prev.queueTimeSec,
              orderSec: prev.menuBoard1Sec,
              windowSec: v.dwellSec,
              pullAheadSec: 0,
              totalSec: v.totalSec,
              posOrderId: `POS-${8842 + (newSerial % 100)}`,
              itemsSummary:
                newSerial % 2 === 0
                  ? 'Kickin Chicken Sandwich Combo'
                  : '3x Chicken Fingerz + Fries',
              orderTotal: newSerial % 2 === 0 ? 14.95 : 19.25,
            }
            nextPos = [record, ...nextPos.slice(0, 6)]
            return {
              ...v,
              id: `#0${newSerial}`,
              dwellSec: 8,
              totalSec: 82,
            }
          }
          if (
            (v.zone === 'order1' || v.zone === 'order2') &&
            v.dwellSec > orderLimit
          ) {
            return { ...v, dwellSec: 4 }
          }
          if (v.zone === 'pullAhead' && v.dwellSec > 115) {
            return { ...v, dwellSec: 12, totalSec: 130 }
          }
          return v
        })

        const nextM1 =
          prev.menuBoard1Sec >= orderLimit ? 6 : prev.menuBoard1Sec + 1
        const nextM2 =
          prev.menuBoard2Sec >= orderLimit + 6 ? 8 : prev.menuBoard2Sec + 1

        const targetQueueCars = prev.surgeMode
          ? prev.lineBusterActive
            ? 5
            : 7
          : 3
        const nextCarsInQueue =
          prev.carsInQueue < targetQueueCars && Math.random() < 0.3
            ? prev.carsInQueue + 1
            : prev.carsInQueue > targetQueueCars && Math.random() < 0.3
              ? prev.carsInQueue - 1
              : prev.carsInQueue

        const nextQueueSec = prev.surgeMode
          ? Math.min(
              78,
              prev.queueTimeSec >= 54 ? 14 : prev.queueTimeSec + 1,
            )
          : Math.max(4, prev.queueTimeSec >= 22 ? 5 : prev.queueTimeSec + 1)

        return {
          ...prev,
          queueTimeSec: nextQueueSec,
          carsInQueue: nextCarsInQueue,
          menuBoard1Sec: nextM1,
          menuBoard2Sec: nextM2,
          carCountNow: prev.carCountNow + completedCount,
          lineBustingAvgSec: prev.lineBusterActive
            ? Math.max(16, Math.min(27, prev.lineBustingAvgSec + (Math.random() < 0.5 ? 1 : -1)))
            : prev.lineBustingAvgSec,
          vehicles: updatedVehicles,
          posTransactions: nextPos,
        }
      })
    }, intervalMs)

    return () => window.clearInterval(id)
  }, [state.isRunning, state.speed])

  const toggleRunning = useCallback(() => {
    setState((p) => ({ ...p, isRunning: !p.isRunning }))
  }, [])

  const toggleSpeed = useCallback(() => {
    setState((p) => ({ ...p, speed: p.speed === 1 ? 3 : 1 }))
  }, [])

  const toggleSurgeMode = useCallback(() => {
    setState((p) => ({
      ...p,
      surgeMode: !p.surgeMode,
      carsInQueue: !p.surgeMode ? 7 : 3,
      queueTimeSec: !p.surgeMode ? 28 : 6,
    }))
  }, [])

  const toggleLineBuster = useCallback(() => {
    setState((p) => ({
      ...p,
      lineBusterActive: !p.lineBusterActive,
    }))
  }, [])

  const toggleAiBoxes = useCallback(() => {
    setState((p) => ({
      ...p,
      showAiBoxes: !p.showAiBoxes,
    }))
  }, [])

  const simulateDriveOff = useCallback(() => {
    setState((p) => ({
      ...p,
      driveOffsToday: p.driveOffsToday + 1,
      carsInQueue: Math.max(1, p.carsInQueue - 1),
    }))
  }, [])

  return {
    state,
    toggleRunning,
    toggleSpeed,
    toggleSurgeMode,
    toggleLineBuster,
    toggleAiBoxes,
    simulateDriveOff,
  }
}

export type BerrySimController = ReturnType<typeof useBerrySim>
