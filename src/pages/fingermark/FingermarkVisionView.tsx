import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  Grid,
  GridItem,
  HStack,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import { Camera, Eye, Flame, Layers, Plus, Video } from 'lucide-react'
import type { FingermarkSimController, TaggedClip } from './useFingermarkSim'

export function FingermarkVisionView({
  sim,
}: {
  sim: FingermarkSimController
}) {
  const { state, tagCurrentFootage } = sim
  const [showBoxes, setShowBoxes] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(true)
  const [selectedClip, setSelectedClip] = useState<TaggedClip>(
    state.taggedClips[0],
  )

  return (
    <VStack gap={6} align="stretch">
      {/* Controls Header */}
      <Flex
        bg="white"
        p={4}
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
            <Camera size={18} color="#2563eb" />
            <Text fontWeight="800" color="gray.900">
              360° FOH + BOH Vision AI & Trajectory Heatmaps
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Works with existing IP cameras on the Eyecue Edge Server — correlates
            outside vehicle flow with inside workstation activity
          </Text>
        </Box>
        <HStack gap={2} wrap="wrap">
          <Button
            size="xs"
            variant={showBoxes ? 'solid' : 'outline'}
            colorPalette="blue"
            onClick={() => setShowBoxes((v) => !v)}
          >
            <Eye size={14} />
            AI Bounding Boxes: {showBoxes ? 'ON' : 'OFF'}
          </Button>
          <Button
            size="xs"
            variant={showHeatmap ? 'solid' : 'outline'}
            colorPalette="orange"
            onClick={() => setShowHeatmap((v) => !v)}
          >
            <Layers size={14} />
            Heatmap & Trajectories: {showHeatmap ? 'ON' : 'OFF'}
          </Button>
          <Button
            size="xs"
            colorPalette="green"
            onClick={() => tagCurrentFootage('Training')}
          >
            <Plus size={14} />
            Tag Live Moment
          </Button>
        </HStack>
      </Flex>

      {/* Split Vision SVG Canvas: Exterior Drive-Thru + Interior Kitchen */}
      <SimpleGrid columns={{ base: 1, xl: 2 }} gap={5}>
        {/* Exterior Lane Vision Feed */}
        <Box
          bg="gray.950"
          borderRadius="2xl"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.800"
        >
          <Flex
            px={4}
            py={2.5}
            bg="gray.900"
            justify="space-between"
            align="center"
            color="white"
          >
            <HStack gap={2}>
              <Box w="8px" h="8px" borderRadius="full" bg="green.400" />
              <Text fontSize="xs" fontWeight="700">
                CAM-EXT-01 • Drive-Thru Lane & Wait Bays
              </Text>
            </HStack>
            <Badge colorPalette="blue" size="sm">
              {state.stages.preOrderCars + 3} Tracked Vehicles
            </Badge>
          </Flex>

          <Box p={3}>
            <svg viewBox="0 0 560 320" width="100%" style={{ display: 'block' }}>
              {/* Asphalt background */}
              <rect width="560" height="320" rx="12" fill="#18181b" />
              {/* Drive-thru curved road */}
              <path
                d="M 520 270 L 140 270 Q 65 270 65 185 L 65 110 Q 65 55 140 55 L 430 55"
                fill="none"
                stroke="#27272a"
                strokeWidth="58"
                strokeLinecap="round"
              />
              {/* Building Footprint */}
              <rect
                x="135"
                y="108"
                width="245"
                height="108"
                rx="8"
                fill="#3f3f46"
                stroke="#52525b"
                strokeWidth="2"
              />
              <text
                x="257"
                y="165"
                fill="#d4d4d8"
                fontSize="13"
                fontWeight="700"
                textAnchor="middle"
              >
                RESTAURANT BUILDING
              </text>

              {/* Wait Bays Top Right */}
              {[0, 1, 2].map((idx) => (
                <g key={idx} transform={`translate(${435 + idx * 38}, 24)`}>
                  <rect
                    width="32"
                    height="62"
                    rx="5"
                    fill="#27272a"
                    stroke="#71717a"
                    strokeDasharray="4 3"
                  />
                  <text
                    x="16"
                    y="15"
                    fill="#a1a1aa"
                    fontSize="9"
                    textAnchor="middle"
                  >
                    B{idx + 1}
                  </text>
                </g>
              ))}

              {/* Trajectory & Dwell Heatmap Overlay */}
              {showHeatmap && (
                <g opacity="0.72">
                  <path
                    d="M 515 270 L 140 270 Q 65 270 65 185 L 65 110 Q 65 55 140 55 L 420 55"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    strokeDasharray="7 5"
                  />
                  {/* Hotspot at Pre-Order Queue */}
                  <ellipse cx="370" cy="270" rx="68" ry="24" fill="rgba(239,68,68,0.42)" />
                  {/* Hotspot at Order COD */}
                  <circle cx="95" cy="245" r="26" fill="rgba(245,158,11,0.45)" />
                  {/* Hotspot at Present Window */}
                  <ellipse cx="290" cy="55" rx="42" ry="22" fill="rgba(234,179,8,0.4)" />
                  {/* Hotspot at Wait Bay 3 */}
                  <circle cx="527" cy="55" r="24" fill="rgba(239,68,68,0.5)" />
                </g>
              )}

              {/* Vehicles in Pre-Order & Order */}
              {Array.from({ length: Math.min(5, state.stages.preOrderCars) }).map(
                (_, i) => {
                  const x = 235 + i * 58
                  return (
                    <g key={i} transform={`translate(${x}, 256)`}>
                      <rect
                        width="44"
                        height="26"
                        rx="6"
                        fill={i === 0 ? '#3b82f6' : '#e4e4e7'}
                      />
                      {showBoxes && (
                        <>
                          <rect
                            x="-4"
                            y="-4"
                            width="52"
                            height="34"
                            fill="none"
                            stroke="#22c55e"
                            strokeWidth="1.8"
                            strokeDasharray="4 2"
                          />
                          <rect
                            x="-4"
                            y="-17"
                            width="46"
                            height="13"
                            rx="2"
                            fill="#16a34a"
                          />
                          <text x="2" y="-8" fill="#fff" fontSize="8" fontWeight="700">
                            Q-{i + 1} • {state.stages.preOrderSec - i * 9}s
                          </text>
                        </>
                      )}
                    </g>
                  )
                },
              )}

              {/* Present Window Vehicle */}
              <g transform="translate(272, 42)">
                <rect width="46" height="26" rx="6" fill="#facc15" />
                {showBoxes && (
                  <>
                    <rect
                      x="-4"
                      y="-4"
                      width="54"
                      height="34"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                    />
                    <text x="0" y="-8" fill="#fde047" fontSize="9" fontWeight="700">
                      PRESENT {state.presentWindowSec}s
                    </text>
                  </>
                )}
              </g>

              {/* Occupied Parked Bays */}
              {state.bays.map((b, idx) =>
                b.occupied ? (
                  <g
                    key={b.bayNumber}
                    transform={`translate(${440 + idx * 38}, 34)`}
                  >
                    <rect width="22" height="44" rx="5" fill={b.vehicleColor} />
                    {showBoxes && (
                      <rect
                        x="-3"
                        y="-3"
                        width="28"
                        height="50"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="1.8"
                      />
                    )}
                  </g>
                ) : null,
              )}

              {/* Stage Labels */}
              <text x="370" y="308" fill="#a1a1aa" fontSize="10" fontWeight="700">
                PRE-ORDER ENTRY
              </text>
              <text x="45" y="308" fill="#a1a1aa" fontSize="10" fontWeight="700">
                COD SPEAKER
              </text>
              <text x="165" y="26" fill="#a1a1aa" fontSize="10" fontWeight="700">
                PAYMENT
              </text>
              <text x="275" y="26" fill="#a1a1aa" fontSize="10" fontWeight="700">
                PRESENT
              </text>
            </svg>
          </Box>
        </Box>

        {/* Interior Kitchen BOH Vision Feed */}
        <Box
          bg="gray.950"
          borderRadius="2xl"
          overflow="hidden"
          borderWidth="1px"
          borderColor="gray.800"
        >
          <Flex
            px={4}
            py={2.5}
            bg="gray.900"
            justify="space-between"
            align="center"
            color="white"
          >
            <HStack gap={2}>
              <Box w="8px" h="8px" borderRadius="full" bg="orange.400" />
              <Text fontSize="xs" fontWeight="700">
                CAM-BOH-03 • Fry Bay, Expo Line & Beverage Station
              </Text>
            </HStack>
            <Badge
              colorPalette={state.fryBayLevelPct < 30 ? 'red' : 'green'}
              size="sm"
            >
              Fry Hopper {state.fryBayLevelPct}%
            </Badge>
          </Flex>

          <Box p={3}>
            <svg viewBox="0 0 560 320" width="100%" style={{ display: 'block' }}>
              <rect width="560" height="320" rx="12" fill="#1c1917" />

              {/* Fry Station Zone */}
              <rect
                x="30"
                y="45"
                width="155"
                height="115"
                rx="8"
                fill="#292524"
                stroke={state.fryBayLevelPct < 30 ? '#ef4444' : '#22c55e'}
                strokeWidth="2.5"
              />
              <text x="46" y="70" fill="#fafaf9" fontSize="12" fontWeight="800">
                FRY BAYCADENCE
              </text>
              <rect x="46" y="86" width="120" height="18" rx="4" fill="#44403c" />
              <rect
                x="46"
                y="86"
                width={Math.round((state.fryBayLevelPct / 100) * 120)}
                height="18"
                rx="4"
                fill={state.fryBayLevelPct < 30 ? '#ef4444' : '#eab308'}
              />
              <text x="46" y="125" fill="#d6d3d1" fontSize="11" fontWeight="700">
                Hopper Level: {state.fryBayLevelPct}%
              </text>
              <text x="46" y="143" fill="#a8a29e" fontSize="10">
                Target &ge; 60% when queue &ge; 5
              </text>

              {/* Assembly / Bagging Line */}
              <rect
                x="210"
                y="45"
                width="165"
                height="115"
                rx="8"
                fill="#292524"
                stroke="#38bdf8"
                strokeWidth="2"
              />
              <text x="226" y="70" fill="#fafaf9" fontSize="12" fontWeight="800">
                EXPO & BAGGING
              </text>
              <text x="226" y="98" fill="#7dd3fc" fontSize="11" fontWeight="700">
                Active Orders: {Math.max(2, state.stages.preOrderCars - 1)}
              </text>
              <text x="226" y="120" fill="#d6d3d1" fontSize="10">
                Present Window Sync: {state.presentWindowSec}s
              </text>

              {/* Beverage / Coffee Station */}
              <rect
                x="398"
                y="45"
                width="135"
                height="115"
                rx="8"
                fill="#292524"
                stroke="#a855f7"
                strokeWidth="2"
              />
              <text x="412" y="70" fill="#fafaf9" fontSize="12" fontWeight="800">
                CAFE / DRINKS
              </text>
              <text x="412" y="98" fill="#d8b4fe" fontSize="11" fontWeight="700">
                Queued: {state.espressoPendingDrinks} drinks
              </text>
              <text x="412" y="120" fill="#a8a29e" fontSize="10">
                Multi-coffee alert: Ready
              </text>

              {/* Crew Position Detections */}
              {showBoxes && (
                <g>
                  <rect
                    x="80"
                    y="188"
                    width="56"
                    height="78"
                    rx="6"
                    fill="rgba(34,197,94,0.16)"
                    stroke="#22c55e"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                  <text x="84" y="182" fill="#4ade80" fontSize="9" fontWeight="700">
                    CREW #1 (FRY)
                  </text>

                  <rect
                    x="260"
                    y="185"
                    width="56"
                    height="78"
                    rx="6"
                    fill="rgba(56,189,248,0.16)"
                    stroke="#38bdf8"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                  <text x="256" y="179" fill="#38bdf8" fontSize="9" fontWeight="700">
                    CREW #2 (PRESENT)
                  </text>

                  <rect
                    x="432"
                    y="188"
                    width="56"
                    height="78"
                    rx="6"
                    fill="rgba(168,85,247,0.16)"
                    stroke="#a855f7"
                    strokeWidth="2"
                    strokeDasharray="5 3"
                  />
                  <text x="430" y="182" fill="#c084fc" fontSize="9" fontWeight="700">
                    CREW #3 (CAFE)
                  </text>
                </g>
              )}

              {showHeatmap && (
                <g opacity="0.55">
                  <ellipse
                    cx="288"
                    cy="225"
                    rx="90"
                    ry="32"
                    fill="rgba(56,189,248,0.35)"
                  />
                  <ellipse
                    cx="108"
                    cy="225"
                    rx="52"
                    ry="28"
                    fill="rgba(239,68,68,0.38)"
                  />
                </g>
              )}

              <text x="30" y="298" fill="#a8a29e" fontSize="10" fontWeight="700">
                ROOT-CAUSE CORRELATION: Outdoor Queue ({state.stages.preOrderCars}{' '}
                cars) ↔ Fry Hopper ({state.fryBayLevelPct}%)
              </text>
            </svg>
          </Box>
        </Box>
      </SimpleGrid>

      {/* Context Capture — Tagged Footage Review */}
      <Grid templateColumns={{ base: '1fr', lg: '1.15fr 0.85fr' }} gap={5}>
        <GridItem>
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            p={5}
          >
            <HStack justify="space-between" mb={4}>
              <HStack gap={2}>
                <Video size={18} color="#16a34a" />
                <Text fontWeight="800" color="gray.900">
                  Context Capture — Tagged Footage for Coaching
                </Text>
              </HStack>
              <Badge colorPalette="green">Before • During • After</Badge>
            </HStack>

            <VStack gap={3} align="stretch">
              {state.taggedClips.map((clip) => {
                const active = selectedClip.id === clip.id
                return (
                  <Box
                    key={clip.id}
                    p={3.5}
                    borderRadius="xl"
                    borderWidth="1.5px"
                    borderColor={active ? 'blue.500' : 'gray.200'}
                    bg={active ? 'blue.50' : 'white'}
                    cursor="pointer"
                    onClick={() => setSelectedClip(clip)}
                  >
                    <Flex justify="space-between" align="center" mb={1}>
                      <HStack gap={2}>
                        <Badge
                          colorPalette={
                            clip.tag === 'Best Practice'
                              ? 'green'
                              : clip.tag === 'Bottleneck'
                                ? 'red'
                                : 'orange'
                          }
                        >
                          {clip.tag}
                        </Badge>
                        <Text fontSize="xs" fontWeight="700" color="gray.700">
                          {clip.store}
                        </Text>
                      </HStack>
                      <Text fontSize="xs" color="gray.500">
                        {clip.timestamp} • {clip.durationSec}s
                      </Text>
                    </Flex>
                    <Text fontSize="sm" fontWeight="700" color="gray.900">
                      {clip.fohSummary}
                    </Text>
                    <Text fontSize="xs" color="gray.600" mt={0.5}>
                      BOH Root Cause: {clip.bohRootCause}
                    </Text>
                  </Box>
                )
              })}
            </VStack>
          </Box>
        </GridItem>

        <GridItem>
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            p={5}
            h="full"
          >
            <Text fontWeight="800" color="gray.900" mb={1}>
              Clip Breakdown: {selectedClip.stage}
            </Text>
            <Text fontSize="xs" color="gray.500" mb={4}>
              {selectedClip.timestamp} • Synchronized Dual-Camera Evidence
            </Text>

            <VStack gap={3} align="stretch">
              <Box bg="gray.50" p={3} borderRadius="xl" borderLeftWidth="4px" borderColor="blue.400">
                <Text fontSize="xs" fontWeight="800" color="blue.700">
                  1. BEFORE (-60s)
                </Text>
                <Text fontSize="sm" color="gray.700">
                  Entry lane flow normal; BOH workstation cadence drifted below
                  rush threshold without manual manager notice.
                </Text>
              </Box>
              <Box bg="red.50" p={3} borderRadius="xl" borderLeftWidth="4px" borderColor="red.400">
                <Text fontSize="xs" fontWeight="800" color="red.700">
                  2. DURING BOTTLENECK
                </Text>
                <Text fontSize="sm" color="gray.800" fontWeight="600">
                  {selectedClip.fohSummary}
                </Text>
                <HStack mt={1} gap={1.5}>
                  <Flame size={14} color="#dc2626" />
                  <Text fontSize="xs" color="red.700">
                    {selectedClip.bohRootCause}
                  </Text>
                </HStack>
              </Box>
              <Box bg="green.50" p={3} borderRadius="xl" borderLeftWidth="4px" borderColor="green.500">
                <Text fontSize="xs" fontWeight="800" color="green.700">
                  3. COACHING RECOMMENDATION
                </Text>
                <Text fontSize="sm" color="gray.700">
                  Configure Eyecue trigger alert when Pre-Order &ge; 4 cars AND
                  Fry Bay &lt; 50% to prompt immediate basket drop.
                </Text>
              </Box>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </VStack>
  )
}
