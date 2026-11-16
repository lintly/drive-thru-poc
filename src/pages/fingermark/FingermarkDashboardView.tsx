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
import { AlertTriangle, Flame, ShoppingBag, Tag, Video } from 'lucide-react'
import type { FingermarkSimController } from './useFingermarkSim'

interface RingGaugeProps {
  valueText: string
  subText?: string
  footerLabel: string
  progressPct: number
  color: string
  size?: number
  strokeWidth?: number
  triColor?: boolean
}

function RingGauge({
  valueText,
  subText,
  footerLabel,
  progressPct,
  color,
  size = 132,
  strokeWidth = 10,
  triColor = false,
}: RingGaugeProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.max(4, Math.min(100, progressPct))
  const dashOffset = circumference - (clamped / 100) * circumference

  return (
    <VStack gap={2} align="center">
      <Box position="relative" w={`${size}px`} h={`${size}px`}>
        <svg width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={strokeWidth}
          />
          {triColor ? (
            <>
              {/* Red upper-right segment */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#ef4444"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference * 0.18} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(-85 ${size / 2} ${size / 2})`}
              />
              {/* Yellow right segment */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#eab308"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference * 0.14} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(-16 ${size / 2} ${size / 2})`}
              />
              {/* Green main arc */}
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#65a30d"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference * Math.min(0.62, clamped / 135)} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(38 ${size / 2} ${size / 2})`}
              />
            </>
          ) : (
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              style={{ transition: 'stroke-dashoffset 0.35s ease' }}
            />
          )}
        </svg>
        <Flex
          position="absolute"
          inset={0}
          direction="column"
          align="center"
          justify="center"
          textAlign="center"
          px={2}
        >
          <Text
            fontSize={size > 145 ? '3xl' : '2xl'}
            fontWeight="800"
            color="gray.900"
            lineHeight="1.05"
          >
            {valueText}
          </Text>
          {subText && (
            <Text fontSize="xs" fontWeight="700" color="gray.600" mt={0.5}>
              {subText}
            </Text>
          )}
        </Flex>
      </Box>
      <Text
        fontSize="xs"
        fontWeight="700"
        color="gray.700"
        textTransform="uppercase"
        letterSpacing="wider"
        textAlign="center"
      >
        {footerLabel}
      </Text>
    </VStack>
  )
}

function TopDownCarSvg({ color }: { color: string }) {
  return (
    <svg width="46" height="84" viewBox="0 0 46 84" fill="none">
      <rect
        x="4"
        y="4"
        width="38"
        height="76"
        rx="12"
        fill={color}
        stroke="rgba(0,0,0,0.3)"
        strokeWidth="2"
      />
      <rect x="9" y="16" width="28" height="15" rx="4" fill="rgba(255,255,255,0.82)" />
      <rect x="10" y="53" width="26" height="13" rx="4" fill="rgba(255,255,255,0.75)" />
      <rect x="10" y="33" width="26" height="18" rx="3" fill="rgba(0,0,0,0.18)" />
    </svg>
  )
}

function stageColor(sec: number, warn: number, bad: number): string {
  if (sec >= bad) return '#ef4444'
  if (sec >= warn) return '#f59e0b'
  return '#22c55e'
}

export function FingermarkDashboardView({
  sim,
  onNavigateVision,
}: {
  sim: FingermarkSimController
  onNavigateVision: () => void
}) {
  const { state, tagCurrentFootage, triggerFryActionOverlay } = sim
  const parkedPct = Math.round(
    (state.parkedCarsLastHourCount / state.parkedCarsLastHourTotal) * 100,
  )
  const minsRemaining = Math.ceil(state.current15MinSecondsLeft / 60)
  const thermometerPct = Math.min(
    100,
    Math.round((state.current15MinCars / state.current15MinTarget) * 100),
  )

  return (
    <VStack gap={6} align="stretch">
      {/* Top 5-Stage End-to-End Journey Strip */}
      <Box
        bg="white"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        p={5}
        shadow="xs"
      >
        <Flex
          justify="space-between"
          align={{ base: 'flex-start', md: 'center' }}
          direction={{ base: 'column', md: 'row' }}
          mb={4}
          gap={2}
        >
          <Box>
            <HStack gap={2}>
              <Text fontWeight="800" fontSize="md" color="gray.900">
                End-to-End Drive-Thru Journey
              </Text>
              <Badge colorPalette="blue" variant="subtle">
                98% Vision AI Accuracy
              </Badge>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Continuous camera tracking from lane entry through park bays — zero
              in-ground loop blind spots
            </Text>
          </Box>
          <HStack gap={2}>
            <Button
              size="xs"
              variant="outline"
              colorPalette="green"
              onClick={() => tagCurrentFootage('Bottleneck')}
            >
              <Tag size={14} />
              Tag footage for review
            </Button>
            <Button
              size="xs"
              variant="subtle"
              colorPalette="blue"
              onClick={onNavigateVision}
            >
              <Video size={14} />
              Context Capture ({state.taggedClips.length})
            </Button>
          </HStack>
        </Flex>

        <SimpleGrid columns={{ base: 2, sm: 3, lg: 5 }} gap={4}>
          <RingGauge
            valueText={`${state.stages.preOrderSec}s`}
            subText={`${state.stages.preOrderCars} cars`}
            footerLabel="Pre-Order"
            progressPct={(state.stages.preOrderSec / 130) * 100}
            color={stageColor(state.stages.preOrderSec, 45, 85)}
            size={112}
          />
          <RingGauge
            valueText={`${state.stages.cod1Sec}s`}
            subText={
              state.stages.cod2Sec !== null
                ? `COD2: ${state.stages.cod2Sec}s`
                : 'Single COD'
            }
            footerLabel="Order"
            progressPct={(state.stages.cod1Sec / 60) * 100}
            color={stageColor(state.stages.cod1Sec, 35, 50)}
            size={112}
          />
          <RingGauge
            valueText={`${state.stages.paymentSec}s`}
            subText="Window 1"
            footerLabel="Payment"
            progressPct={(state.stages.paymentSec / 60) * 100}
            color={stageColor(state.stages.paymentSec, 30, 45)}
            size={112}
          />
          <RingGauge
            valueText={`${state.stages.deliverSec}s`}
            subText="Present"
            footerLabel="Deliver"
            progressPct={(state.stages.deliverSec / 60) * 100}
            color={stageColor(state.stages.deliverSec, 30, 45)}
            size={112}
          />
          <RingGauge
            valueText={`${state.stages.waitBayAvgSec}s`}
            subText={`${state.bays.filter((b) => b.occupied).length}/3 bays`}
            footerLabel="Wait Bay"
            progressPct={(state.stages.waitBayAvgSec / 220) * 100}
            color={stageColor(state.stages.waitBayAvgSec, 90, 130)}
            size={112}
          />
        </SimpleGrid>
      </Box>

      {/* Main Eyecue Configurable Store Board */}
      <Box
        bg="white"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        p={6}
        shadow="sm"
      >
        <Flex justify="space-between" align="center" mb={5} wrap="wrap" gap={2}>
          <HStack gap={2}>
            <Text fontWeight="800" fontSize="lg" color="gray.900">
              Store #104 Live Operations Board
            </Text>
            <Badge colorPalette="purple" variant="subtle">
              Configurable Eyecue Layout
            </Badge>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            OEPE = Order-End to Present-End • Target &lt; 120s (85%+)
          </Text>
        </Flex>

        <Grid
          templateColumns={{ base: '1fr', xl: '260px 1fr 120px' }}
          gap={6}
          alignItems="stretch"
        >
          {/* Left Column: Parked Car Avg + 3 Bays + Pull-Fwd/Present Strip */}
          <GridItem>
            <VStack gap={4} align="stretch">
              <Box
                bg={state.stages.waitBayAvgSec > 120 ? 'red.500' : 'orange.400'}
                color="white"
                borderRadius="xl"
                py={3}
                px={4}
                textAlign="center"
              >
                <Text fontSize="3xl" fontWeight="900" lineHeight="1">
                  {state.stages.waitBayAvgSec}s
                </Text>
                <Text fontSize="xs" fontWeight="700" mt={1}>
                  Parked Car Average
                </Text>
                <Text fontSize="2xs" opacity={0.9}>
                  Last Hour
                </Text>
              </Box>

              {/* 3 Parked Car Bays */}
              <SimpleGrid columns={3} gap={2}>
                {state.bays.map((bay) => {
                  const isLong = bay.waitSeconds >= 180
                  return (
                    <VStack key={bay.bayNumber} gap={1.5} align="stretch">
                      <Flex
                        bg="gray.800"
                        borderRadius="lg"
                        h="116px"
                        direction="column"
                        align="center"
                        justify="center"
                        position="relative"
                        borderWidth="2px"
                        borderColor={
                          bay.occupied
                            ? isLong
                              ? 'red.500'
                              : 'yellow.400'
                            : 'gray.700'
                        }
                      >
                        {bay.occupied ? (
                          <>
                            <TopDownCarSvg color={bay.vehicleColor} />
                            <Badge
                              position="absolute"
                              top="50%"
                              transform="translateY(-50%)"
                              bg={isLong ? 'red.600' : 'yellow.400'}
                              color={isLong ? 'white' : 'gray.900'}
                              fontWeight="800"
                              fontSize="xs"
                              px={1.5}
                            >
                              {bay.waitSeconds}s
                            </Badge>
                          </>
                        ) : (
                          <Text
                            fontSize="3xl"
                            fontWeight="800"
                            color="gray.500"
                          >
                            {bay.bayNumber}
                          </Text>
                        )}
                      </Flex>
                      <Box
                        bg={
                          bay.occupied
                            ? isLong
                              ? 'red.500'
                              : 'orange.400'
                            : 'gray.200'
                        }
                        color={bay.occupied ? 'white' : 'gray.600'}
                        borderRadius="md"
                        py={0.5}
                        textAlign="center"
                        fontSize="xs"
                        fontWeight="800"
                      >
                        {bay.occupied
                          ? `Bay ${bay.bayNumber}`
                          : `${bay.recentClearSeconds}s`}
                      </Box>
                    </VStack>
                  )
                })}
              </SimpleGrid>

              {/* Pull-fwd & Present Window Lane Strip */}
              <Box
                bg="gray.800"
                borderRadius="xl"
                p={3}
                color="white"
              >
                <Text
                  fontSize="2xs"
                  textTransform="uppercase"
                  color="gray.400"
                  fontWeight="700"
                  mb={2}
                >
                  Active Window Lane
                </Text>
                <HStack justify="space-around" gap={3}>
                  <VStack gap={1}>
                    <Flex
                      w="64px"
                      h="74px"
                      bg="gray.900"
                      borderRadius="lg"
                      align="center"
                      justify="center"
                      position="relative"
                      borderWidth="1px"
                      borderColor="gray.600"
                    >
                      <Flex
                        bg="white"
                        color="green.600"
                        borderRadius="lg"
                        p={2}
                        direction="column"
                        align="center"
                      >
                        <ShoppingBag size={20} />
                        <Text fontSize="2xs" fontWeight="800" color="gray.800">
                          {state.pullFwdSec}s
                        </Text>
                      </Flex>
                    </Flex>
                    <Text fontSize="2xs" fontWeight="700" color="gray.300">
                      Pull-fwd
                    </Text>
                  </VStack>

                  <VStack gap={1}>
                    <Flex
                      w="64px"
                      h="74px"
                      bg="gray.900"
                      borderRadius="lg"
                      align="center"
                      justify="center"
                      position="relative"
                      borderWidth="1px"
                      borderColor="yellow.500"
                    >
                      <Badge
                        bg="yellow.400"
                        color="gray.900"
                        fontWeight="800"
                        fontSize="xs"
                      >
                        {state.presentWindowSec}s
                      </Badge>
                    </Flex>
                    <Text fontSize="2xs" fontWeight="700" color="gray.300">
                      Present
                    </Text>
                  </VStack>
                </HStack>
              </Box>
            </VStack>
          </GridItem>

          {/* Center Column: Top Gauges + Bottom Trailing 5h Chart & COD/Pull-outs */}
          <GridItem>
            <VStack gap={6} align="stretch">
              <SimpleGrid columns={{ base: 1, sm: 3 }} gap={4} alignItems="center">
                <RingGauge
                  valueText={`${parkedPct}%`}
                  subText={`${state.parkedCarsLastHourCount}/${state.parkedCarsLastHourTotal} • Target <7%`}
                  footerLabel="Parked Cars Last Hour"
                  progressPct={Math.min(100, parkedPct * 5)}
                  color={parkedPct > 7 ? '#ef4444' : '#22c55e'}
                  size={142}
                />
                <RingGauge
                  valueText={`${state.oepeLastHourPct}%`}
                  subText={`${state.oepeLastHourSec}s avg`}
                  footerLabel="OEPE Last Hour %"
                  progressPct={state.oepeLastHourPct}
                  color="#65a30d"
                  size={162}
                  strokeWidth={12}
                  triColor
                />
                <RingGauge
                  valueText={`${state.oepeLastDayPct}%`}
                  subText={`${state.oepeLastDaySec}s avg`}
                  footerLabel="OEPE Last Day %"
                  progressPct={state.oepeLastDayPct}
                  color="#65a30d"
                  size={142}
                  triColor
                />
              </SimpleGrid>

              <Grid
                templateColumns={{ base: '1fr', lg: '1.35fr 0.65fr 0.65fr' }}
                gap={5}
                alignItems="center"
              >
                {/* Trailing OEPE% Last 5 Hours Bar Chart */}
                <Box
                  borderWidth="1px"
                  borderColor="gray.100"
                  borderRadius="xl"
                  p={4}
                  bg="gray.50"
                >
                  <SimpleGrid columns={5} gap={2}>
                    {state.trailingHours.map((hr) => (
                      <VStack key={hr.hourLabel} gap={1.5} align="stretch">
                        <Text
                          fontSize="2xs"
                          fontWeight="700"
                          color="gray.600"
                          textAlign="center"
                        >
                          {hr.hourLabel}
                        </Text>
                        <HStack
                          h="105px"
                          align="flex-end"
                          justify="center"
                          gap={1}
                          px={1}
                          borderBottomWidth="1px"
                          borderColor="gray.200"
                        >
                          {hr.bars.map((val, idx) => {
                            if (val === 0) {
                              return (
                                <Box
                                  key={idx}
                                  w="7px"
                                  h="28px"
                                  bg="gray.300"
                                  borderRadius="full"
                                />
                              )
                            }
                            const barColor =
                              hr.oepePct >= 85
                                ? '#84cc16'
                                : hr.oepePct >= 78
                                  ? '#eab308'
                                  : '#ef4444'
                            return (
                              <Box
                                key={idx}
                                w="7px"
                                h={`${Math.min(100, Math.max(18, Math.round(val / 2)))}px`}
                                bg={barColor}
                                borderRadius="full"
                              />
                            )
                          })}
                        </HStack>
                        <Text
                          fontSize="2xs"
                          color="gray.600"
                          textAlign="center"
                          fontWeight="600"
                        >
                          {hr.cars} cars
                        </Text>
                        <Box
                          bg={
                            hr.oepePct >= 85
                              ? 'lime.500'
                              : hr.oepePct >= 78
                                ? 'lime.600'
                                : 'red.500'
                          }
                          color="white"
                          borderRadius="md"
                          py={0.5}
                          textAlign="center"
                          fontSize="xs"
                          fontWeight="800"
                        >
                          {hr.oepePct}%
                        </Box>
                      </VStack>
                    ))}
                  </SimpleGrid>
                  <Text
                    fontSize="xs"
                    fontWeight="700"
                    color="gray.700"
                    textAlign="center"
                    mt={3}
                  >
                    Trailing OEPE% Last 5 Hours
                  </Text>
                </Box>

                {/* COD 1 / COD 2 Tiles */}
                <VStack gap={3} align="stretch">
                  <Box
                    bg={state.stages.cod1Sec > 38 ? 'orange.400' : 'lime.500'}
                    color="gray.950"
                    borderRadius="xl"
                    py={4}
                    px={3}
                    textAlign="center"
                  >
                    <Text fontSize="2xl" fontWeight="900" lineHeight="1">
                      {state.stages.cod1Sec}s
                    </Text>
                    <Text fontSize="xs" fontWeight="800" mt={1}>
                      COD 1
                    </Text>
                  </Box>
                  <Box
                    bg={state.stages.cod2Sec !== null ? 'lime.500' : 'gray.200'}
                    color="gray.900"
                    borderRadius="xl"
                    py={4}
                    px={3}
                    textAlign="center"
                  >
                    <Text fontSize="2xl" fontWeight="900" lineHeight="1">
                      {state.stages.cod2Sec !== null
                        ? `${state.stages.cod2Sec}s`
                        : '—'}
                    </Text>
                    <Text fontSize="xs" fontWeight="800" mt={1}>
                      COD 2
                    </Text>
                  </Box>
                </VStack>

                {/* Pull Outs Today Ring */}
                <Flex justify="center">
                  <RingGauge
                    valueText={`${state.pullOutsToday}`}
                    subText={`${state.pullOutsLimit} Limit`}
                    footerLabel="Pull Outs Today"
                    progressPct={
                      (state.pullOutsToday / state.pullOutsLimit) * 100
                    }
                    color={
                      state.pullOutsToday >= state.pullOutsLimit
                        ? '#ef4444'
                        : '#facc15'
                    }
                    size={134}
                  />
                </Flex>
              </Grid>
            </VStack>
          </GridItem>

          {/* Right Column: Current 15 Mins Vertical Pacing Thermometer */}
          <GridItem>
            <Flex
              direction="column"
              h="full"
              minH="340px"
              bg="gray.200"
              borderRadius="2xl"
              p={2}
              justify="space-between"
              align="stretch"
            >
              <Box
                bg="yellow.400"
                borderRadius="xl"
                py={2}
                textAlign="center"
                color="gray.900"
              >
                <Text fontSize="2xs" fontWeight="800" textTransform="uppercase">
                  Target
                </Text>
                <Text fontSize="xl" fontWeight="900" lineHeight="1.1">
                  {state.current15MinTarget}
                </Text>
              </Box>

              <Flex
                flex="1"
                my={2}
                bg="gray.700"
                borderRadius="xl"
                direction="column"
                justify="flex-end"
                overflow="hidden"
                position="relative"
              >
                <Flex
                  h={`${thermometerPct}%`}
                  bg="lime.500"
                  direction="column"
                  align="center"
                  justify="center"
                  color="gray.950"
                  transition="height 0.4s ease"
                  minH="58px"
                >
                  <Text fontSize="2xl" fontWeight="900" lineHeight="1">
                    {state.current15MinCars}
                  </Text>
                  <Text fontSize="xs" fontWeight="800">
                    Cars
                  </Text>
                </Flex>
              </Flex>

              <VStack gap={0.5} pb={1}>
                <Text fontSize="xs" fontWeight="800" color="gray.800">
                  {minsRemaining} min left
                </Text>
                <Text fontSize="2xs" fontWeight="700" color="gray.600">
                  Current 15 Mins
                </Text>
              </VStack>
            </Flex>
          </GridItem>
        </Grid>
      </Box>

      {/* FOH <-> BOH Join-the-Dots Strip + Trigger-Based Alert Card */}
      <SimpleGrid columns={{ base: 1, lg: 2 }} gap={5}>
        <Box
          bg="white"
          borderRadius="2xl"
          borderWidth="1px"
          borderColor={state.fryBayLevelPct < 30 ? 'red.300' : 'gray.200'}
          p={5}
          shadow="xs"
        >
          <Flex justify="space-between" align="center" mb={3}>
            <HStack gap={2}>
              <Flame size={18} color="#ea580c" />
              <Text fontWeight="800" color="gray.900">
                Join the Dots: Inside Kitchen ↔ Outside Lane
              </Text>
            </HStack>
            <Badge
              colorPalette={state.fryBayLevelPct < 30 ? 'red' : 'green'}
              variant="solid"
            >
              Fry Hopper: {state.fryBayLevelPct}%
            </Badge>
          </Flex>
          <Text fontSize="sm" color="gray.600" mb={4}>
            Eyecue correlates back-of-house workstation readiness (fry bay
            levels, beverage bar cadence) directly against pre-order queue depth
            so crews fix root causes before Present times spike.
          </Text>
          <HStack justify="space-between" wrap="wrap" gap={3}>
            <HStack gap={4}>
              <Box>
                <Text fontSize="2xs" color="gray.500" fontWeight="700">
                  PRE-ORDER STACK
                </Text>
                <Text fontSize="lg" fontWeight="800" color="gray.900">
                  {state.stages.preOrderCars} vehicles
                </Text>
              </Box>
              <Box>
                <Text fontSize="2xs" color="gray.500" fontWeight="700">
                  ESPRESSO QUEUE
                </Text>
                <Text fontSize="lg" fontWeight="800" color="gray.900">
                  {state.espressoPendingDrinks} drinks
                </Text>
              </Box>
            </HStack>
            <Button
              size="sm"
              colorPalette="red"
              variant="subtle"
              onClick={triggerFryActionOverlay}
            >
              <AlertTriangle size={15} />
              Test Fry Bay Trigger Alert
            </Button>
          </HStack>
        </Box>

        {/* Live Trigger-Based Action Card Replica */}
        <Box
          bg="white"
          borderRadius="2xl"
          borderWidth="2px"
          borderColor="red.200"
          p={5}
          shadow="xs"
          position="relative"
        >
          <Flex justify="space-between" align="flex-start" gap={4}>
            <HStack gap={4}>
              <Flex
                w="58px"
                h="58px"
                borderRadius="full"
                borderWidth="5px"
                borderColor="red.400"
                align="center"
                justify="center"
                fontWeight="900"
                fontSize="xl"
                color="gray.900"
                flexShrink={0}
              >
                {Math.max(5, state.stages.preOrderCars)}
              </Flex>
              <Box>
                <Text fontWeight="800" fontSize="md" color="red.500">
                  {state.alertHistory[0]?.title ?? 'Pre order queue is 5+ cars'}
                </Text>
                <Text fontWeight="900" fontSize="xl" color="gray.900" mt={0.5}>
                  {state.alertHistory[0]?.actionPrompt ?? 'Put more fries down'}
                </Text>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Last triggered {state.alertHistory[0]?.triggeredAt} • Routed
                  to Kitchen KDS & Shift Lead SMS
                </Text>
              </Box>
            </HStack>
            <Badge colorPalette="red" variant="solid" borderRadius="full" px={2.5}>
              LIVE TRIGGER
            </Badge>
          </Flex>
        </Box>
      </SimpleGrid>
    </VStack>
  )
}
