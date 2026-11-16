import { useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  SimpleGrid,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react'
import { ArrowUpDown, Trophy, Video } from 'lucide-react'
import type { FingermarkSimController } from './useFingermarkSim'

interface StoreRow {
  rank: number
  storeCode: string
  location: string
  region: string
  oepePct: number
  avgTotalSec: number
  parkedPct: number
  pullOuts: number
  carsToday: number
}

const STORES: readonly StoreRow[] = [
  {
    rank: 1,
    storeCode: '#088',
    location: 'Dundas St East',
    region: 'GTA East',
    oepePct: 94,
    avgTotalSec: 112,
    parkedPct: 4.1,
    pullOuts: 1,
    carsToday: 842,
  },
  {
    rank: 2,
    storeCode: '#119',
    location: 'Mississauga Erin Mills',
    region: 'GTA West',
    oepePct: 91,
    avgTotalSec: 119,
    parkedPct: 5.3,
    pullOuts: 2,
    carsToday: 790,
  },
  {
    rank: 3,
    storeCode: '#203',
    location: 'Brampton North',
    region: 'GTA West',
    oepePct: 86,
    avgTotalSec: 131,
    parkedPct: 6.6,
    pullOuts: 3,
    carsToday: 715,
  },
  {
    rank: 4,
    storeCode: '#104',
    location: 'Queen St West (Live Sim)',
    region: 'Downtown',
    oepePct: 81,
    avgTotalSec: 154,
    parkedPct: 12.0,
    pullOuts: 4,
    carsToday: 682,
  },
  {
    rank: 5,
    storeCode: '#052',
    location: 'Scarborough Kingston Rd',
    region: 'GTA East',
    oepePct: 71,
    avgTotalSec: 184,
    parkedPct: 14.8,
    pullOuts: 9,
    carsToday: 604,
  },
]

export function FingermarkLeaderboardsView({
  sim,
  onInspectVision,
}: {
  sim: FingermarkSimController
  onInspectVision: () => void
}) {
  const [sortBy, setSortBy] = useState<'oepePct' | 'avgTotalSec' | 'parkedPct'>(
    'oepePct',
  )

  const liveRows = STORES.map((row) =>
    row.storeCode === '#104'
      ? {
          ...row,
          oepePct: sim.state.oepeLastHourPct,
          pullOuts: sim.state.pullOutsToday,
        }
      : row,
  ).sort((a, b) => {
    if (sortBy === 'oepePct') return b.oepePct - a.oepePct
    if (sortBy === 'avgTotalSec') return a.avgTotalSec - b.avgTotalSec
    return a.parkedPct - b.parkedPct
  })

  return (
    <VStack gap={6} align="stretch">
      <SimpleGrid columns={{ base: 1, md: 3 }} gap={4}>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <Text fontSize="xs" fontWeight="700" color="gray.500">
            TOP PERFORMING SITE
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="green.600" mt={1}>
            #088 Dundas East (94% OEPE)
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            4.1% Parked Cars • 112s End-to-End Avg
          </Text>
        </Box>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <Text fontSize="xs" fontWeight="700" color="gray.500">
            NETWORK OEPE BENCHMARK
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="gray.900" mt={1}>
            84.6% (Target 85%)
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            Across 5 franchise locations • 3,633 cars today
          </Text>
        </Box>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="red.200">
          <Text fontSize="xs" fontWeight="700" color="red.600">
            NEEDS SUPPORT
          </Text>
          <Text fontSize="2xl" fontWeight="900" color="red.600" mt={1}>
            #052 Scarborough (71% OEPE)
          </Text>
          <Text fontSize="xs" color="gray.500" mt={1}>
            14.8% Parked Cars • 9 Pull-outs today
          </Text>
        </Box>
      </SimpleGrid>

      <Box
        bg="white"
        borderRadius="2xl"
        borderWidth="1px"
        borderColor="gray.200"
        p={5}
      >
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={3}>
          <Box>
            <HStack gap={2}>
              <Trophy size={18} color="#eab308" />
              <Text fontWeight="800" fontSize="lg" color="gray.900">
                Spot Your Best. Support the Rest.
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Drive healthy competition across sites and jump directly into
              camera footage where coaching is needed
            </Text>
          </Box>
          <HStack gap={2}>
            <Button
              size="xs"
              variant={sortBy === 'oepePct' ? 'solid' : 'outline'}
              colorPalette="blue"
              onClick={() => setSortBy('oepePct')}
            >
              <ArrowUpDown size={13} />
              Sort: OEPE %
            </Button>
            <Button
              size="xs"
              variant={sortBy === 'avgTotalSec' ? 'solid' : 'outline'}
              colorPalette="blue"
              onClick={() => setSortBy('avgTotalSec')}
            >
              <ArrowUpDown size={13} />
              Sort: Fastest Journey
            </Button>
            <Button
              size="xs"
              variant={sortBy === 'parkedPct' ? 'solid' : 'outline'}
              colorPalette="blue"
              onClick={() => setSortBy('parkedPct')}
            >
              <ArrowUpDown size={13} />
              Sort: Lowest Parked %
            </Button>
          </HStack>
        </Flex>

        <Box overflowX="auto">
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Rank</Table.ColumnHeader>
                <Table.ColumnHeader>Store</Table.ColumnHeader>
                <Table.ColumnHeader>Region</Table.ColumnHeader>
                <Table.ColumnHeader>OEPE %</Table.ColumnHeader>
                <Table.ColumnHeader>Total Journey</Table.ColumnHeader>
                <Table.ColumnHeader>Parked Cars %</Table.ColumnHeader>
                <Table.ColumnHeader>Pull-Outs</Table.ColumnHeader>
                <Table.ColumnHeader>Cars Served</Table.ColumnHeader>
                <Table.ColumnHeader>Footage</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {liveRows.map((row, idx) => (
                <Table.Row
                  key={row.storeCode}
                  bg={row.storeCode === '#104' ? 'blue.50' : undefined}
                >
                  <Table.Cell fontWeight="800">#{idx + 1}</Table.Cell>
                  <Table.Cell fontWeight="700">
                    {row.storeCode} — {row.location}
                  </Table.Cell>
                  <Table.Cell color="gray.600">{row.region}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        row.oepePct >= 85
                          ? 'green'
                          : row.oepePct >= 78
                            ? 'yellow'
                            : 'red'
                      }
                      variant="solid"
                    >
                      {row.oepePct}%
                    </Badge>
                  </Table.Cell>
                  <Table.Cell fontWeight="700">{row.avgTotalSec}s</Table.Cell>
                  <Table.Cell
                    color={row.parkedPct > 7 ? 'red.600' : 'green.700'}
                    fontWeight="700"
                  >
                    {row.parkedPct.toFixed(1)}%
                  </Table.Cell>
                  <Table.Cell>{row.pullOuts}</Table.Cell>
                  <Table.Cell>{row.carsToday}</Table.Cell>
                  <Table.Cell>
                    <Button
                      size="xs"
                      variant="ghost"
                      colorPalette="blue"
                      onClick={onInspectVision}
                    >
                      <Video size={14} />
                      Clips
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </Box>
      </Box>
    </VStack>
  )
}
