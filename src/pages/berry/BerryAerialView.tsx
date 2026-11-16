import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { CheckCircle2, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import type { BerrySimController } from './useBerrySim'

export function BerryAerialView({ sim }: { sim: BerrySimController }) {
  const { state } = sim
  const [sensorMode, setSensorMode] = useState<'berry' | 'loops'>('berry')

  return (
    <VStack gap={6} align="stretch">
      {/* Mode Comparison Banner */}
      <Flex
        bg="white"
        p={5}
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        justify="space-between"
        align="center"
        wrap="wrap"
        gap={3}
      >
        <Box>
          <HStack gap={2}>
            <ShieldCheck size={18} color="#e11d48" />
            <Text fontWeight="800" fontSize="lg" color="gray.900">
              Total Lot Visibility: Every Car. Every Stage.
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.600">
            Toggle below to compare Berry Vision AI against legacy in-ground
            magnetic loop detectors
          </Text>
        </Box>
        <HStack gap={2}>
          <Button
            size="sm"
            variant={sensorMode === 'berry' ? 'solid' : 'outline'}
            colorPalette="red"
            onClick={() => setSensorMode('berry')}
          >
            <Eye size={15} />
            Berry Vision AI (Full Journey)
          </Button>
          <Button
            size="sm"
            variant={sensorMode === 'loops' ? 'solid' : 'outline'}
            colorPalette="gray"
            onClick={() => setSensorMode('loops')}
          >
            <EyeOff size={15} />
            Legacy Loop Timers (Blind Spots)
          </Button>
        </HStack>
      </Flex>

      {/* Aerial Property SVG Replica (Matching Berry Hero Graphic) */}
      <Box
        bg="#141a1f"
        borderRadius="2xl"
        p={5}
        borderWidth="1px"
        borderColor="gray.800"
        shadow="md"
      >
        <svg viewBox="0 0 820 420" width="100%" style={{ display: 'block' }}>
          {/* Grass & Main Street */}
          <rect width="820" height="420" rx="14" fill="#2d3b2d" />
          <rect x="735" y="0" width="85" height="420" fill="#3f4752" />
          <line
            x1="778"
            y1="15"
            x2="778"
            y2="405"
            stroke="#e2e8f0"
            strokeWidth="2"
            strokeDasharray="18 16"
          />

          {/* Parking Lot Asphalt */}
          <rect x="95" y="20" width="640" height="380" rx="22" fill="#333942" />

          {/* Top Parking Stalls + Curbside */}
          {[0, 1, 2, 3, 4, 5, 6].map((i) => (
            <line
              key={i}
              x1={165 + i * 68}
              y1="20"
              x2={190 + i * 68}
              y2="82"
              stroke="#eab308"
              strokeWidth="1.5"
              opacity="0.65"
            />
          ))}

          {/* Curbside Blue Zone */}
          <g opacity={sensorMode === 'berry' ? 1 : 0.18}>
            <polygon
              points="440,22 508,22 532,84 464,84"
              fill="rgba(59,130,246,0.32)"
              stroke="#3b82f6"
              strokeWidth="2.5"
            />
            <rect x="466" y="36" width="26" height="42" rx="6" fill="#93c5fd" />
            <rect x="444" y="92" width="112" height="28" rx="8" fill="#1d4ed8" />
            <text
              x="500"
              y="111"
              fill="#ffffff"
              fontSize="14"
              fontWeight="800"
              textAnchor="middle"
            >
              Curbside ({state.vehicles[8]?.dwellSec ?? 42}s)
            </text>
          </g>

          {/* Restaurant Building Roof */}
          <rect
            x="265"
            y="152"
            width="285"
            height="122"
            rx="6"
            fill="#cbd5e1"
            stroke="#64748b"
            strokeWidth="4"
          />
          <rect x="315" y="182" width="44" height="34" rx="4" fill="#64748b" />
          <rect x="445" y="188" width="52" height="36" rx="4" fill="#64748b" />
          <text
            x="408"
            y="252"
            fill="#1e293b"
            fontSize="13"
            fontWeight="900"
            textAnchor="middle"
          >
            QSR STORE ROOFTOP
          </text>

          {/* Pre-Menu Queue Yellow Line (Invisible to loops!) */}
          <g opacity={sensorMode === 'berry' ? 1 : 0.16}>
            <path
              d="M 718 128 L 260 128 Q 198 128 198 210"
              fill="none"
              stroke="#facc15"
              strokeWidth="5"
            />
            <circle cx="718" cy="128" r="8" fill="#facc15" />
            <rect x="476" y="88" width="0" height="0" />
            <rect x="488" y="96" width="218" height="28" rx="9" fill="#facc15" />
            <text
              x="597"
              y="115"
              fill="#111827"
              fontSize="14"
              fontWeight="800"
              textAnchor="middle"
            >
              pre-menu queue ({state.carsInQueue} cars • {state.queueTimeSec}s)
            </text>
          </g>

          {/* Order Cyan Node (Visible to both) */}
          <circle cx="198" cy="215" r="9" fill="#22d3ee" />
          <rect x="108" y="200" width="78" height="28" rx="8" fill="#22d3ee" />
          <text
            x="147"
            y="219"
            fill="#0f172a"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
          >
            order
          </text>

          {/* Production Green Path (Visible to both) */}
          <path
            d="M 198 224 Q 198 305 268 305 L 408 305"
            fill="none"
            stroke="#4ade80"
            strokeWidth="5"
          />
          <circle cx="408" cy="305" r="9" fill="#4ade80" />
          <rect x="255" y="316" width="138" height="28" rx="8" fill="#4ade80" />
          <text
            x="324"
            y="335"
            fill="#052e16"
            fontSize="14"
            fontWeight="800"
            textAnchor="middle"
          >
            production
          </text>

          {/* Pull Ahead Orange Zone (Invisible to loops — "loop cheating" zone!) */}
          <g opacity={sensorMode === 'berry' ? 1 : 0.16}>
            <path
              d="M 416 305 L 555 305 Q 618 305 618 225"
              fill="none"
              stroke="rgba(249,115,22,0.5)"
              strokeWidth="36"
              strokeLinecap="round"
            />
            <rect x="492" y="293" width="46" height="24" rx="5" fill="#fdba74" />
            <rect x="485" y="336" width="152" height="28" rx="8" fill="#f97316" />
            <text
              x="561"
              y="355"
              fill="#111827"
              fontSize="14"
              fontWeight="800"
              textAnchor="middle"
            >
              pull ahead ({state.pullAheadAvgSec}s)
            </text>
          </g>

          {/* Exit White Path */}
          <path
            d="M 416 305 L 555 305 Q 618 305 618 225 Q 618 188 665 188 L 722 188"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
          />
          <polyline
            points="708,178 725,188 708,198"
            fill="none"
            stroke="#ffffff"
            strokeWidth="3.5"
          />

          {sensorMode === 'loops' && (
            <g>
              <rect
                x="455"
                y="138"
                width="265"
                height="40"
                rx="8"
                fill="rgba(220,38,38,0.92)"
              />
              <text
                x="587"
                y="163"
                fill="#ffffff"
                fontSize="12"
                fontWeight="800"
                textAnchor="middle"
              >
                BLIND SPOT: Pre-speaker wait & bailouts missed!
              </text>
              <rect
                x="455"
                y="368"
                width="265"
                height="36"
                rx="8"
                fill="rgba(220,38,38,0.92)"
              />
              <text
                x="587"
                y="391"
                fill="#ffffff"
                fontSize="12"
                fontWeight="800"
                textAnchor="middle"
              >
                BLIND SPOT: Staff pull cars past loop!
              </text>
            </g>
          )}
        </svg>
      </Box>

      {/* 4 Core Differentiator Cards */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} gap={4}>
        {[
          {
            title: 'Richer Data Than Loops',
            desc: 'Captures pre-menu queue wait times, mid-lane drive-offs, curbside stalls, and pull-forwards.',
            stat: `${state.queueTimeSec}s Pre-Menu Live`,
          },
          {
            title: 'Hard to Cheat',
            desc: 'Pulling cars past the window sensor no longer artificially lowers Speed of Service.',
            stat: `${state.pullAheadAvgSec}s Pull-Ahead Tracked`,
          },
          {
            title: 'Line-Busting Speed',
            desc: 'Measures outdoor tablet order-taking speed across dual and multi-lane layouts.',
            stat: `${state.lineBustingAvgSec}s Avg Order`,
          },
          {
            title: 'Zero Lane Trenching',
            desc: 'Above-ground wired AI cameras + small on-site edge server install without closing lanes.',
            stat: 'ISO 27001 Certified',
          },
        ].map((card) => (
          <Box
            key={card.title}
            bg="white"
            p={4}
            borderRadius="xl"
            borderWidth="1px"
            borderColor="gray.200"
          >
            <HStack gap={1.5} mb={1}>
              <CheckCircle2 size={15} color="#16a34a" />
              <Text fontWeight="800" fontSize="sm" color="gray.900">
                {card.title}
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.600" mb={3}>
              {card.desc}
            </Text>
            <Badge colorPalette="red" variant="subtle">
              {card.stat}
            </Badge>
          </Box>
        ))}
      </SimpleGrid>
    </VStack>
  )
}
