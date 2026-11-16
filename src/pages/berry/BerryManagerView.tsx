import {
  Badge,
  Box,
  Flex,
  HStack,
  SimpleGrid,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react'
import { BarChart3, Receipt } from 'lucide-react'
import type { BerrySimController } from './useBerrySim'

const DAYPART_TRENDS = [
  { label: '7 AM', sosSec: 162, driveOffs: 0 },
  { label: '8 AM', sosSec: 178, driveOffs: 1 },
  { label: '9 AM', sosSec: 145, driveOffs: 0 },
  { label: '10 AM', sosSec: 138, driveOffs: 0 },
  { label: '11 AM', sosSec: 194, driveOffs: 1 },
  { label: '12 PM', sosSec: 238, driveOffs: 2 },
  { label: '1 PM', sosSec: 212, driveOffs: 1 },
  { label: '2 PM', sosSec: 168, driveOffs: 0 },
] as const

export function BerryManagerView({ sim }: { sim: BerrySimController }) {
  const { state } = sim

  return (
    <VStack gap={6} align="stretch">
      {/* Manager KPI Summary Row */}
      <SimpleGrid columns={{ base: 1, sm: 2, lg: 4 }} gap={4}>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <Text fontSize="xs" fontWeight="700" color="gray.500">
            TODAY&apos;S TRUE TOTAL SOS
          </Text>
          <Text fontSize="3xl" fontWeight="900" color="gray.900" mt={1}>
            02:54
          </Text>
          <Badge colorPalette="green" mt={1}>
            -13% vs. Last Month
          </Badge>
        </Box>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <Text fontSize="xs" fontWeight="700" color="gray.500">
            VEHICLES PROCESSED TODAY
          </Text>
          <Text fontSize="3xl" fontWeight="900" color="gray.900" mt={1}>
            {state.carCountNow}
          </Text>
          <Badge colorPalette="green" mt={1}>
            +{state.carCountNow - state.carCountTwoWkAvg} vs. 2-Wk Avg
          </Badge>
        </Box>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <Text fontSize="xs" fontWeight="700" color="gray.500">
            LINE-BUSTING ORDER SPEED
          </Text>
          <Text fontSize="3xl" fontWeight="900" color="gray.900" mt={1}>
            {state.lineBustingAvgSec}s
          </Text>
          <Badge colorPalette="blue" mt={1}>
            {state.lineBusterActive ? 'Tablet Crew Active' : 'Standard Speaker'}
          </Badge>
        </Box>
        <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
          <Text fontSize="xs" fontWeight="700" color="gray.500">
            PULL-AHEAD / DRIVE-OFFS
          </Text>
          <Text fontSize="3xl" fontWeight="900" color="gray.900" mt={1}>
            {state.pullAheadAvgSec}s / {state.driveOffsToday}
          </Text>
          <Badge colorPalette="orange" mt={1}>
            Zero Loop Gaming
          </Badge>
        </Box>
      </SimpleGrid>

      {/* Hourly Trend Chart */}
      <Box bg="white" p={6} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
          <HStack gap={2}>
            <BarChart3 size={18} color="#e11d48" />
            <Text fontWeight="800" fontSize="md" color="gray.900">
              Berry Board — Hourly Speed of Service & Drive-Off Trend
            </Text>
          </HStack>
          <Text fontSize="xs" color="gray.500">
            Identifies peak staffing gaps (12 PM rush spike)
          </Text>
        </Flex>

        <SimpleGrid columns={8} gap={3} alignItems="end" h="170px" pt={4}>
          {DAYPART_TRENDS.map((d) => {
            const pct = Math.round((d.sosSec / 260) * 100)
            const barColor =
              d.sosSec > 200 ? '#ef4444' : d.sosSec > 170 ? '#f59e0b' : '#10b981'
            return (
              <VStack key={d.label} gap={1.5} h="full" justify="flex-end">
                {d.driveOffs > 0 && (
                  <Badge colorPalette="red" size="sm">
                    {d.driveOffs} bail
                  </Badge>
                )}
                <Text fontSize="2xs" fontWeight="700" color="gray.700">
                  {d.sosSec}s
                </Text>
                <Box
                  w="full"
                  maxW="42px"
                  h={`${pct}%`}
                  bg={barColor}
                  borderRadius="lg"
                />
                <Text fontSize="xs" fontWeight="700" color="gray.600">
                  {d.label}
                </Text>
              </VStack>
            )
          })}
        </SimpleGrid>
      </Box>

      {/* POS-Matched Vehicle Journey Log */}
      <Box bg="white" p={6} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
        <Flex justify="space-between" align="center" mb={4} wrap="wrap" gap={2}>
          <Box>
            <HStack gap={2}>
              <Receipt size={18} color="#2563eb" />
              <Text fontWeight="800" fontSize="md" color="gray.900">
                Live POS-Matched Vehicle Journey Log
              </Text>
            </HStack>
            <Text fontSize="xs" color="gray.500">
              Berry AI matches persistent camera Vehicle IDs (#0628xx) directly
              with POS ticket items and check size
            </Text>
          </Box>
          <Badge colorPalette="blue">Live POS Sync</Badge>
        </Flex>

        <Box overflowX="auto">
          <Table.Root size="sm" variant="line">
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Vehicle ID</Table.ColumnHeader>
                <Table.ColumnHeader>Completed</Table.ColumnHeader>
                <Table.ColumnHeader>Order Mode</Table.ColumnHeader>
                <Table.ColumnHeader>Pre-Menu Queue</Table.ColumnHeader>
                <Table.ColumnHeader>Order</Table.ColumnHeader>
                <Table.ColumnHeader>Window</Table.ColumnHeader>
                <Table.ColumnHeader>Pull-Ahead</Table.ColumnHeader>
                <Table.ColumnHeader>Total SoS</Table.ColumnHeader>
                <Table.ColumnHeader>POS Ticket & Items</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {state.posTransactions.map((tx) => (
                <Table.Row key={`${tx.vehicleId}-${tx.completedAt}`}>
                  <Table.Cell fontFamily="mono" fontWeight="800" color="red.600">
                    {tx.vehicleId}
                  </Table.Cell>
                  <Table.Cell color="gray.600">{tx.completedAt}</Table.Cell>
                  <Table.Cell>
                    <Badge
                      colorPalette={
                        tx.lane === 'Line-Buster' ? 'green' : 'gray'
                      }
                    >
                      {tx.lane}
                    </Badge>
                  </Table.Cell>
                  <Table.Cell>{tx.queueSec}s</Table.Cell>
                  <Table.Cell>{tx.orderSec}s</Table.Cell>
                  <Table.Cell>{tx.windowSec}s</Table.Cell>
                  <Table.Cell>
                    {tx.pullAheadSec > 0 ? `${tx.pullAheadSec}s` : '—'}
                  </Table.Cell>
                  <Table.Cell fontWeight="800">{tx.totalSec}s</Table.Cell>
                  <Table.Cell>
                    <Text fontSize="xs" fontWeight="700">
                      {tx.posOrderId} (${tx.orderTotal.toFixed(2)})
                    </Text>
                    <Text fontSize="2xs" color="gray.500">
                      {tx.itemsSummary}
                    </Text>
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
