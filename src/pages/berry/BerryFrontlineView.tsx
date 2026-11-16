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
import { Eye, Smartphone, UserX } from 'lucide-react'
import { formatMmSs, type BerrySimController } from './useBerrySim'

function timerColor(sec: number, warnSec: number, badSec: number): string {
  if (sec >= badSec) return '#ef4444'
  if (sec >= warnSec) return '#f59e0b'
  return '#22c55e'
}

export function BerryFrontlineView({ sim }: { sim: BerrySimController }) {
  const { state, toggleAiBoxes, toggleLineBuster, simulateDriveOff } = sim
  const diffCars = state.carCountNow - state.carCountTwoWkAvg
  const diffPct = Math.round((diffCars / state.carCountTwoWkAvg) * 100)
  const queueAlert = state.carsInQueue >= 6

  return (
    <VStack gap={5} align="stretch">
      {/* Main Dark In-Store Crew Monitor Frame */}
      <Box
        bg="#11161b"
        borderRadius="2xl"
        borderWidth="2px"
        borderColor="#26313a"
        overflow="hidden"
        shadow="xl"
      >
        {/* Top Monitor Status Bar */}
        <Flex
          px={5}
          py={3}
          bg="#182026"
          borderBottomWidth="1px"
          borderColor="#2a3540"
          justify="space-between"
          align="center"
          wrap="wrap"
          gap={2}
        >
          <HStack gap={2.5}>
            <Flex
              w="24px"
              h="24px"
              borderRadius="full"
              bg="#e11d48"
              align="center"
              justify="center"
              color="white"
              fontWeight="900"
              fontSize="xs"
            >
              ✦
            </Flex>
            <Text color="white" fontWeight="800" fontSize="lg">
              Berry AI
            </Text>
            <Badge colorPalette="green" variant="solid" size="sm">
              FRONTLINE CREW MONITOR
            </Badge>
          </HStack>

          <HStack gap={2} wrap="wrap">
            <Button
              size="xs"
              variant={state.showAiBoxes ? 'solid' : 'outline'}
              colorPalette="red"
              onClick={toggleAiBoxes}
            >
              <Eye size={13} />
              AI Bounding Boxes: {state.showAiBoxes ? 'ON' : 'OFF'}
            </Button>
            <Button
              size="xs"
              variant={state.lineBusterActive ? 'solid' : 'outline'}
              colorPalette="green"
              onClick={toggleLineBuster}
            >
              <Smartphone size={13} />
              Line-Buster Crew: {state.lineBusterActive ? 'ACTIVE' : 'OFF'}
            </Button>
            <Button
              size="xs"
              variant="outline"
              colorPalette="orange"
              color="orange.300"
              borderColor="orange.600"
              onClick={simulateDriveOff}
            >
              <UserX size={13} />
              +1 Drive-Off
            </Button>
          </HStack>
        </Flex>

        {/* Split Monitor Body: Left KPI + U-Lane Board | Right Dual Camera Feeds */}
        <Grid
          templateColumns={{ base: '1fr', xl: '1.12fr 0.88fr' }}
          gap={0}
        >
          {/* Left Panel: 6 Digital KPI Tiles + U-Shaped Lane Track */}
          <GridItem p={4} borderRightWidth={{ xl: '1px' }} borderColor="#26313a">
            <Grid templateColumns={{ base: '1fr', md: '1fr 96px' }} gap={3}>
              {/* 3x2 KPI Tile Grid */}
              <VStack gap={3} align="stretch">
                <SimpleGrid columns={{ base: 1, sm: 2 }} gap={3}>
                  {/* Tile 1: Queue Time */}
                  <Box
                    bg="#182129"
                    borderWidth="1.5px"
                    borderColor="#33414d"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text color="gray.100" fontWeight="700" fontSize="md">
                      Queue Time
                    </Text>
                    <Text
                      fontSize="5xl"
                      fontWeight="900"
                      fontFamily="mono"
                      textAlign="center"
                      my={2}
                      lineHeight="1"
                      color={timerColor(state.queueTimeSec, 20, 45)}
                    >
                      {formatMmSs(state.queueTimeSec)}
                    </Text>
                    <Flex justify="space-between" fontSize="xs" fontWeight="700">
                      <Text color="gray.300">
                        AVG <Text as="span" color="#22c55e">01:17</Text>
                      </Text>
                      <Text color="gray.300">Goal 00:05</Text>
                    </Flex>
                  </Box>

                  {/* Tile 2: Cars in Queue (Solid Red Alert at 6+) */}
                  <Box
                    bg={queueAlert ? '#dc2626' : '#182129'}
                    borderWidth="1.5px"
                    borderColor={queueAlert ? '#f87171' : '#33414d'}
                    borderRadius="xl"
                    p={4}
                    transition="background 0.25s ease"
                  >
                    <Flex justify="space-between" align="center">
                      <Text color="white" fontWeight="700" fontSize="md">
                        Cars in Queue
                      </Text>
                      {queueAlert && (
                        <Badge bg="white" color="red.700" fontWeight="900">
                          QUEUE ALERT
                        </Badge>
                      )}
                    </Flex>
                    <Text
                      fontSize="5xl"
                      fontWeight="900"
                      textAlign="center"
                      my={2}
                      lineHeight="1"
                      color="white"
                    >
                      {state.carsInQueue >= 6 ? '6+' : state.carsInQueue}
                    </Text>
                    <Text fontSize="xs" color="whiteAlpha.800" textAlign="center" fontWeight="600">
                      Pre-speaker queue (invisible to loop timers)
                    </Text>
                  </Box>

                  {/* Tile 3: Menu Board 1 */}
                  <Box
                    bg="#182129"
                    borderWidth="1.5px"
                    borderColor="#33414d"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text color="gray.100" fontWeight="700" fontSize="md">
                      Menu Board1
                    </Text>
                    <Text
                      fontSize="5xl"
                      fontWeight="900"
                      fontFamily="mono"
                      textAlign="center"
                      my={2}
                      lineHeight="1"
                      color={timerColor(state.menuBoard1Sec, 16, 45)}
                    >
                      {formatMmSs(state.menuBoard1Sec)}
                    </Text>
                    <Flex justify="space-between" fontSize="xs" fontWeight="700">
                      <Text color="gray.300">
                        AVG <Text as="span" color="#22c55e">01:17</Text>
                      </Text>
                      <Text color="gray.300">Goal 01:00</Text>
                    </Flex>
                  </Box>

                  {/* Tile 4: Menu Board 2 */}
                  <Box
                    bg="#182129"
                    borderWidth="1.5px"
                    borderColor="#33414d"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text color="gray.100" fontWeight="700" fontSize="md">
                      Menu Board2
                    </Text>
                    <Text
                      fontSize="5xl"
                      fontWeight="900"
                      fontFamily="mono"
                      textAlign="center"
                      my={2}
                      lineHeight="1"
                      color={timerColor(state.menuBoard2Sec, 30, 50)}
                    >
                      {formatMmSs(state.menuBoard2Sec)}
                    </Text>
                    <Flex justify="space-between" fontSize="xs" fontWeight="700">
                      <Text color="gray.300">
                        AVG <Text as="span" color="#22c55e">00:36</Text>
                      </Text>
                      <Text color="gray.300">Goal 01:00</Text>
                    </Flex>
                  </Box>

                  {/* Tile 5: Car Count Difference */}
                  <Box
                    bg="#182129"
                    borderWidth="1.5px"
                    borderColor="#33414d"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text color="gray.100" fontWeight="700" fontSize="md">
                      Car Count Difference
                    </Text>
                    <Text
                      fontSize="5xl"
                      fontWeight="900"
                      textAlign="center"
                      my={2}
                      lineHeight="1"
                      color="#22c55e"
                    >
                      +{diffPct}%
                    </Text>
                    <SimpleGrid columns={3} textAlign="center" fontSize="xs" fontWeight="700">
                      <Box>
                        <Text color="gray.400">Now</Text>
                        <Text color="white">{state.carCountNow}</Text>
                      </Box>
                      <Box>
                        <Text color="gray.400">2 wks AVG</Text>
                        <Text color="white">{state.carCountTwoWkAvg}</Text>
                      </Box>
                      <Box>
                        <Text color="gray.400">Diff</Text>
                        <Text color="#22c55e">+{diffCars}</Text>
                      </Box>
                    </SimpleGrid>
                  </Box>

                  {/* Tile 6: Today's Drive-offs */}
                  <Box
                    bg="#182129"
                    borderWidth="1.5px"
                    borderColor="#33414d"
                    borderRadius="xl"
                    p={4}
                  >
                    <Text color="gray.100" fontWeight="700" fontSize="md">
                      Today&apos;s Drive-offs
                    </Text>
                    <Text
                      fontSize="5xl"
                      fontWeight="900"
                      textAlign="center"
                      my={2}
                      lineHeight="1"
                      color={state.driveOffsToday > 4 ? '#ef4444' : 'white'}
                    >
                      {state.driveOffsToday}
                    </Text>
                    <Text fontSize="xs" color="gray.400" textAlign="center">
                      Est. ${(state.driveOffsToday * 16.5).toFixed(0)} lost revenue
                      identified
                    </Text>
                  </Box>
                </SimpleGrid>

                {/* Bottom Horizontal Pre-Menu Queue Track */}
                <Flex
                  bg="#0b0f13"
                  borderWidth="1px"
                  borderColor="#2c3844"
                  borderRadius="xl"
                  px={3}
                  py={2}
                  align="center"
                  justify="space-between"
                  gap={2}
                  wrap="wrap"
                >
                  <Badge bg="white" color="gray.950" fontWeight="900" px={2}>
                    🚗 {state.carsInQueue >= 6 ? '6+' : state.carsInQueue} Queue
                  </Badge>
                  <HStack gap={1.5} wrap="wrap">
                    {Array.from({ length: Math.min(6, state.carsInQueue) }).map(
                      (_, idx) => (
                        <Box
                          key={idx}
                          bg="#16a34a"
                          color="gray.950"
                          px={2.5}
                          py={0.5}
                          borderRadius="full"
                          fontSize="xs"
                          fontWeight="900"
                        >
                          {Math.max(3, state.queueTimeSec - idx * 3)}s
                        </Box>
                      ),
                    )}
                  </HStack>
                  <Text fontSize="2xs" color="gray.400" fontWeight="700">
                    → Dual Order Merge →
                  </Text>
                </Flex>
              </VStack>

              {/* Vertical Lane Column: Cashier/Service Stack + Dual Order 1/2 */}
              <Flex
                bg="#0b0f13"
                borderWidth="1px"
                borderColor="#2c3844"
                borderRadius="xl"
                p={2}
                direction="column"
                justify="space-between"
                align="center"
              >
                <VStack gap={1.5} w="full">
                  <Text
                    fontSize="2xs"
                    color="gray.300"
                    fontWeight="800"
                    textAlign="center"
                  >
                    Cashier / Service
                  </Text>
                  {[94, 78, 62, 45, 31].map((sec, idx) => (
                    <Box
                      key={idx}
                      w="full"
                      py={1.5}
                      borderRadius="lg"
                      bg={idx < 3 ? '#dc2626' : '#facc15'}
                      color={idx < 3 ? 'white' : 'gray.950'}
                      textAlign="center"
                      fontSize="xs"
                      fontWeight="900"
                      fontFamily="mono"
                    >
                      {formatMmSs(sec + (state.menuBoard1Sec % 9))}
                    </Box>
                  ))}
                  <Badge bg="white" color="gray.950" fontSize="2xs" fontWeight="900">
                    🚗 5+ Stack
                  </Badge>
                </VStack>

                {/* Dual Y-Split Order 1 & Order 2 */}
                <VStack gap={1} w="full" mt={3}>
                  <Text fontSize="2xs" color="gray.400" fontWeight="700">
                    Dual Order
                  </Text>
                  <SimpleGrid columns={2} gap={1} w="full">
                    <Box
                      bg="#22c55e"
                      color="gray.950"
                      borderRadius="md"
                      py={2}
                      textAlign="center"
                      fontSize="2xs"
                      fontWeight="900"
                    >
                      O1
                      <br />
                      {state.menuBoard1Sec}s
                    </Box>
                    <Box
                      bg="#eab308"
                      color="gray.950"
                      borderRadius="md"
                      py={2}
                      textAlign="center"
                      fontSize="2xs"
                      fontWeight="900"
                    >
                      O2
                      <br />
                      {state.menuBoard2Sec}s
                    </Box>
                  </SimpleGrid>
                </VStack>
              </Flex>
            </Grid>
          </GridItem>

          {/* Right Panel: Live Split-Screen AI Camera Feeds A & B */}
          <GridItem p={4} bg="#0d1217">
            <Flex justify="space-between" align="center" mb={2.5} color="gray.200">
              <HStack gap={3} fontSize="xs" fontWeight="700">
                <HStack gap={1}>
                  <Box w="8px" h="8px" borderRadius="full" bg="red.500" className="sim-pulse" />
                  <Text>Live</Text>
                </HStack>
                <Text color="gray.400">A: Cashier / Service</Text>
                <Text color="gray.400">B: Order & Line-Busting</Text>
              </HStack>
              <Text fontSize="2xs" color="gray.500" fontFamily="mono">
                Edge Vision v2.4
              </Text>
            </Flex>

            <VStack gap={3} align="stretch">
              {/* Camera Feed A: Service Window & Pull-Ahead */}
              <Box
                borderRadius="xl"
                overflow="hidden"
                borderWidth="1px"
                borderColor="#2d3a46"
                position="relative"
              >
                <svg viewBox="0 0 500 225" width="100%" style={{ display: 'block' }}>
                  <rect width="500" height="225" fill="#1e293b" />
                  {/* Wet asphalt road & parking lines */}
                  <polygon points="0,35 205,225 500,225 500,35" fill="#334155" />
                  <line x1="250" y1="120" x2="195" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="330" y1="120" x2="285" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  <line x1="410" y1="120" x2="375" y2="220" stroke="#94a3b8" strokeWidth="2" />
                  {/* Building Curb */}
                  <polygon points="0,0 185,0 80,225 0,225" fill="#475569" />
                  <text x="16" y="210" fill="#ffffff" fontSize="18" fontWeight="900">
                    A
                  </text>

                  {/* Vehicle 1 at Cashier/Service */}
                  <g transform="translate(150, 56)">
                    <rect width="96" height="44" rx="10" fill="#f8fafc" />
                    <rect x="16" y="7" width="52" height="30" rx="5" fill="#cbd5e1" />
                    {state.showAiBoxes && (
                      <>
                        <rect
                          x="-6"
                          y="-6"
                          width="108"
                          height="56"
                          fill="rgba(239,68,68,0.12)"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="5 3"
                        />
                        <rect x="-6" y="-22" width="62" height="16" fill="#dc2626" />
                        <text x="-2" y="-10" fill="#fff" fontSize="10" fontWeight="800">
                          {state.vehicles[0]?.id ?? '#062835'}
                        </text>
                      </>
                    )}
                  </g>

                  {/* Vehicle 2 in Pull-Ahead Zone */}
                  <g transform="translate(315, 76)">
                    <rect width="92" height="42" rx="10" fill="#e2e8f0" />
                    <rect x="18" y="6" width="48" height="30" rx="5" fill="#94a3b8" />
                    {state.showAiBoxes && (
                      <>
                        <rect
                          x="-6"
                          y="-6"
                          width="104"
                          height="54"
                          fill="rgba(249,115,22,0.16)"
                          stroke="#f97316"
                          strokeWidth="2"
                          strokeDasharray="5 3"
                        />
                        <rect x="-6" y="-22" width="88" height="16" fill="#ea580c" />
                        <text x="-2" y="-10" fill="#fff" fontSize="9" fontWeight="800">
                          PULL-AHEAD {state.vehicles[7]?.dwellSec ?? 64}s
                        </text>
                      </>
                    )}
                  </g>
                </svg>
              </Box>

              {/* Camera Feed B: Order Lane + Line-Busting Crew Detection */}
              <Box
                borderRadius="xl"
                overflow="hidden"
                borderWidth="1px"
                borderColor="#2d3a46"
                position="relative"
              >
                <svg viewBox="0 0 500 225" width="100%" style={{ display: 'block' }}>
                  <rect width="500" height="225" fill="#1f2937" />
                  {/* Curved Drive-Thru Order Lane */}
                  <path
                    d="M 480 55 Q 290 65 95 165"
                    fill="none"
                    stroke="#374151"
                    strokeWidth="76"
                    strokeLinecap="round"
                  />
                  {/* Menu Speaker Sign */}
                  <rect x="40" y="72" width="54" height="32" rx="4" fill="#991b1b" stroke="#f87171" />
                  <text x="67" y="92" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">
                    MENU 1
                  </text>

                  {/* Car at Order Speaker (#062837) */}
                  <g transform="translate(92, 118)">
                    {/* Red ground detection mat */}
                    {state.showAiBoxes && (
                      <polygon
                        points="-12,48 108,48 118,62 -2,62"
                        fill="rgba(220,38,38,0.45)"
                      />
                    )}
                    <rect width="102" height="48" rx="12" fill="#ffffff" />
                    <rect x="20" y="8" width="56" height="32" rx="6" fill="#94a3b8" />

                    {state.showAiBoxes && (
                      <>
                        <rect
                          x="-5"
                          y="-6"
                          width="112"
                          height="60"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="2"
                          strokeDasharray="5 3"
                        />
                        <rect x="-5" y="-23" width="62" height="17" fill="#dc2626" />
                        <text x="-1" y="-11" fill="#fff" fontSize="10" fontWeight="800">
                          #062837
                        </text>
                      </>
                    )}

                    {/* Line-Busting Tablet Crew Member alongside driver window */}
                    {state.lineBusterActive && (
                      <g transform="translate(42, 22)">
                        <circle cx="12" cy="8" r="6" fill="#14532d" />
                        <rect x="5" y="14" width="14" height="26" rx="4" fill="#166534" />
                        {state.showAiBoxes && (
                          <>
                            <rect
                              x="-2"
                              y="-2"
                              width="28"
                              height="46"
                              fill="rgba(34,197,94,0.18)"
                              stroke="#22c55e"
                              strokeWidth="2"
                              strokeDasharray="4 2"
                            />
                            <text x="-12" y="55" fill="#4ade80" fontSize="8" fontWeight="800">
                              LINE-BUSTER ({state.lineBustingAvgSec}s)
                            </text>
                          </>
                        )}
                      </g>
                    )}
                  </g>

                  {/* Queued Car #062838 */}
                  <g transform="translate(245, 78)">
                    <rect width="88" height="42" rx="10" fill="#f1f5f9" />
                    {state.showAiBoxes && (
                      <>
                        <rect
                          x="-5"
                          y="-5"
                          width="98"
                          height="52"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="1.8"
                          strokeDasharray="5 3"
                        />
                        <rect x="-5" y="-20" width="58" height="15" fill="#dc2626" />
                        <text x="-1" y="-9" fill="#fff" fontSize="9" fontWeight="800">
                          #062838
                        </text>
                      </>
                    )}
                  </g>

                  {/* Queued Car #062839 */}
                  <g transform="translate(368, 48)">
                    <rect width="80" height="38" rx="9" fill="#e2e8f0" />
                    {state.showAiBoxes && (
                      <>
                        <rect
                          x="-4"
                          y="-4"
                          width="88"
                          height="46"
                          fill="none"
                          stroke="#ef4444"
                          strokeWidth="1.8"
                          strokeDasharray="5 3"
                        />
                        <rect x="-4" y="-19" width="56" height="15" fill="#dc2626" />
                        <text x="0" y="-8" fill="#fff" fontSize="9" fontWeight="800">
                          #062839
                        </text>
                      </>
                    )}
                  </g>

                  <text x="16" y="210" fill="#ffffff" fontSize="18" fontWeight="900">
                    B
                  </text>
                </svg>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </Box>
    </VStack>
  )
}
