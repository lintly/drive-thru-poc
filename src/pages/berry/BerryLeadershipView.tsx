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
import { Calculator, DollarSign, TrendingDown, TrendingUp } from 'lucide-react'

const FIVE_QUARTER_STUDY = [
  { quarter: 'Q1 (Baseline)', avgTime: '5:57', sec: 357, driveOffDrop: '0%', stores: 85 },
  { quarter: 'Q2', avgTime: '5:34', sec: 334, driveOffDrop: '-21%', stores: 240 },
  { quarter: 'Q3', avgTime: '5:16', sec: 316, driveOffDrop: '-38%', stores: 510 },
  { quarter: 'Q4', avgTime: '5:02', sec: 302, driveOffDrop: '-49%', stores: 760 },
  { quarter: 'Q5 (Current)', avgTime: '4:54', sec: 294, driveOffDrop: '-58%', stores: 949 },
] as const

export function BerryLeadershipView() {
  const [storeCount, setStoreCount] = useState(25)
  const [dailyCars, setDailyCars] = useState(420)
  const [avgTicket, setAvgTicket] = useState(16)
  const [driveOffRatePct, setDriveOffRatePct] = useState(3.5)

  // Berry case study benchmark: ~58% reduction in drive-offs + throughput lift
  const dailyLostCarsPerStore = (dailyCars * driveOffRatePct) / 100
  const reclaimedCarsPerStore = dailyLostCarsPerStore * 0.58
  const weeklyReclaimedPerStore = Math.round(reclaimedCarsPerStore * avgTicket * 7)
  const annualBrandImpact = Math.round(weeklyReclaimedPerStore * 52 * storeCount)

  return (
    <VStack gap={6} align="stretch">
      {/* Macro Brand KPIs */}
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <HStack justify="space-between">
            <Text fontSize="xs" fontWeight="700" color="gray.500">
              5-QUARTER SOS IMPROVEMENT
            </Text>
            <TrendingDown size={16} color="#16a34a" />
          </HStack>
          <Text fontSize="3xl" fontWeight="900" color="gray.900" mt={1}>
            -63 Seconds
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Dropped from 5:57 → 4:54 across 949 QSR locations
          </Text>
        </Box>

        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <HStack justify="space-between">
            <Text fontSize="xs" fontWeight="700" color="gray.500">
              DRIVE-OFF REDUCTION
            </Text>
            <TrendingDown size={16} color="#16a34a" />
          </HStack>
          <Text fontSize="3xl" fontWeight="900" color="green.600" mt={1}>
            -58% Bailouts
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Directly recovered from pre-speaker queue visibility
          </Text>
        </Box>

        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <HStack justify="space-between">
            <Text fontSize="xs" fontWeight="700" color="gray.500">
              ZAXBY&apos;S OPERATOR BENCHMARK
            </Text>
            <TrendingUp size={16} color="#e11d48" />
          </HStack>
          <Text fontSize="3xl" fontWeight="900" color="gray.900" mt={1}>
            +7% Comps Lift
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            $15k weekly revenue reclaimed • -13% SoS time
          </Text>
        </Box>
      </SimpleGrid>

      <Grid templateColumns={{ base: '1fr', lg: '1.05fr 0.95fr' }} gap={6}>
        {/* 5-Quarter Brand Rollout Chart */}
        <GridItem>
          <Box
            bg="white"
            p={6}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            h="full"
          >
            <Text fontWeight="800" fontSize="lg" color="gray.900" mb={1}>
              Brand-Wide Vision AI Rollout Trajectory
            </Text>
            <Text fontSize="xs" color="gray.500" mb={5}>
              Macro Business Intelligence view in Berry Board comparing Speed of
              Service against store deployment scale
            </Text>

            <VStack gap={3.5} align="stretch">
              {FIVE_QUARTER_STUDY.map((q) => {
                const widthPct = Math.round((q.sec / 370) * 100)
                return (
                  <Box key={q.quarter}>
                    <Flex justify="space-between" fontSize="xs" fontWeight="700" mb={1}>
                      <Text color="gray.800">
                        {q.quarter}{' '}
                        <Text as="span" color="gray.400">
                          ({q.stores} stores)
                        </Text>
                      </Text>
                      <HStack gap={2}>
                        <Badge colorPalette="green" size="sm">
                          Drive-offs {q.driveOffDrop}
                        </Badge>
                        <Text fontFamily="mono" fontWeight="900" color="gray.900">
                          {q.avgTime}
                        </Text>
                      </HStack>
                    </Flex>
                    <Box bg="gray.100" h="14px" borderRadius="full" overflow="hidden">
                      <Box
                        h="full"
                        w={`${widthPct}%`}
                        bg={q.sec < 305 ? 'green.500' : 'red.500'}
                        borderRadius="full"
                      />
                    </Box>
                  </Box>
                )
              })}
            </VStack>
          </Box>
        </GridItem>

        {/* Interactive Lost / Reclaimed Revenue Calculator */}
        <GridItem>
          <Box
            bg="#11161b"
            color="white"
            p={6}
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.800"
            h="full"
          >
            <HStack gap={2} mb={1}>
              <Calculator size={18} color="#f43f5e" />
              <Text fontWeight="800" fontSize="lg">
                Faster Lane Revenue Calculator
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.400" mb={5}>
              Estimate what reducing pre-speaker drive-offs is worth across your
              stores (modeled on Berry AI&apos;s Revenue Calculator)
            </Text>

            <VStack gap={4} align="stretch">
              <Box>
                <Flex justify="space-between" fontSize="xs" fontWeight="700" mb={1.5}>
                  <Text color="gray.300">Number of Drive-Thru Stores</Text>
                  <Text color="rose.400">{storeCount} locations</Text>
                </Flex>
                <HStack gap={2}>
                  {[5, 25, 100, 300].map((n) => (
                    <Button
                      key={n}
                      size="xs"
                      variant={storeCount === n ? 'solid' : 'outline'}
                      colorPalette="red"
                      color={storeCount === n ? 'white' : 'gray.300'}
                      onClick={() => setStoreCount(n)}
                    >
                      {n} Stores
                    </Button>
                  ))}
                </HStack>
              </Box>

              <Box>
                <Flex justify="space-between" fontSize="xs" fontWeight="700" mb={1.5}>
                  <Text color="gray.300">Daily Vehicles per Store</Text>
                  <Text color="rose.400">{dailyCars} cars/day</Text>
                </Flex>
                <HStack gap={2}>
                  {[300, 420, 600, 850].map((c) => (
                    <Button
                      key={c}
                      size="xs"
                      variant={dailyCars === c ? 'solid' : 'outline'}
                      colorPalette="red"
                      color={dailyCars === c ? 'white' : 'gray.300'}
                      onClick={() => setDailyCars(c)}
                    >
                      {c}
                    </Button>
                  ))}
                </HStack>
              </Box>

              <SimpleGrid columns={2} gap={3}>
                <Box>
                  <Text fontSize="xs" color="gray.300" fontWeight="700" mb={1.5}>
                    Average Check ($)
                  </Text>
                  <HStack gap={1.5}>
                    {[12, 16, 22].map((amt) => (
                      <Button
                        key={amt}
                        size="xs"
                        variant={avgTicket === amt ? 'solid' : 'outline'}
                        colorPalette="red"
                        color={avgTicket === amt ? 'white' : 'gray.300'}
                        onClick={() => setAvgTicket(amt)}
                      >
                        ${amt}
                      </Button>
                    ))}
                  </HStack>
                </Box>
                <Box>
                  <Text fontSize="xs" color="gray.300" fontWeight="700" mb={1.5}>
                    Est. Drive-Off Rate
                  </Text>
                  <HStack gap={1.5}>
                    {[2.0, 3.5, 5.0].map((r) => (
                      <Button
                        key={r}
                        size="xs"
                        variant={driveOffRatePct === r ? 'solid' : 'outline'}
                        colorPalette="red"
                        color={driveOffRatePct === r ? 'white' : 'gray.300'}
                        onClick={() => setDriveOffRatePct(r)}
                      >
                        {r}%
                      </Button>
                    ))}
                  </HStack>
                </Box>
              </SimpleGrid>

              <Box
                mt={2}
                p={4}
                borderRadius="xl"
                bg="#1b242c"
                borderWidth="1px"
                borderColor="#33414d"
              >
                <SimpleGrid columns={2} gap={3}>
                  <Box>
                    <Text fontSize="2xs" color="gray.400" fontWeight="700">
                      WEEKLY RECLAIMED / STORE
                    </Text>
                    <Text fontSize="2xl" fontWeight="900" color="green.400">
                      ${weeklyReclaimedPerStore.toLocaleString()}
                    </Text>
                  </Box>
                  <Box>
                    <HStack gap={1}>
                      <DollarSign size={14} color="#4ade80" />
                      <Text fontSize="2xs" color="gray.400" fontWeight="700">
                        ANNUAL BRAND IMPACT
                      </Text>
                    </HStack>
                    <Text fontSize="2xl" fontWeight="900" color="white">
                      ${annualBrandImpact.toLocaleString()}
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>
            </VStack>
          </Box>
        </GridItem>
      </Grid>
    </VStack>
  )
}
