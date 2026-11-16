import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
} from '@chakra-ui/react'
import {
  ArrowLeft,
  BarChart3,
  Building2,
  ExternalLink,
  FastForward,
  Map,
  Monitor,
  Pause,
  Play,
  Smartphone,
  Zap,
} from 'lucide-react'
import { Link, Route, Routes, useLocation } from 'react-router-dom'
import { BerryAerialView } from './BerryAerialView'
import { BerryFrontlineView } from './BerryFrontlineView'
import { BerryLeadershipView } from './BerryLeadershipView'
import { BerryManagerView } from './BerryManagerView'
import { useBerrySim } from './useBerrySim'

const BERRY_ROLES = [
  {
    path: '/berry-ai',
    label: 'Role: Frontline Crew Monitor',
    icon: Monitor,
  },
  {
    path: '/berry-ai/aerial',
    label: 'Full-Lot Aerial vs. Loops',
    icon: Map,
  },
  {
    path: '/berry-ai/manager',
    label: 'Role: Store Manager (Berry Board)',
    icon: BarChart3,
  },
  {
    path: '/berry-ai/leadership',
    label: 'Role: Brand Leadership & ROI',
    icon: Building2,
  },
] as const

export function BerryLayout() {
  const sim = useBerrySim()
  const location = useLocation()
  const { state } = sim

  return (
    <Box minH="100vh" bg="#f5f6f8" color="gray.900">
      {/* Top Berry AI Competitor Header */}
      <Box
        bg="#11161b"
        color="white"
        borderBottomWidth="1px"
        borderColor="gray.800"
        position="sticky"
        top={0}
        zIndex={20}
      >
        <Container maxW="7xl" py={3}>
          <Flex
            justify="space-between"
            align={{ base: 'flex-start', lg: 'center' }}
            direction={{ base: 'column', lg: 'row' }}
            gap={3}
          >
            <HStack gap={3} wrap="wrap">
              <Button
                asChild
                size="xs"
                variant="outline"
                color="gray.200"
                borderColor="gray.700"
              >
                <Link to="/">
                  <ArrowLeft size={14} />
                  POC Home
                </Link>
              </Button>
              <HStack gap={2.5}>
                <Flex
                  w="30px"
                  h="30px"
                  borderRadius="full"
                  bg="#e11d48"
                  color="white"
                  align="center"
                  justify="center"
                  fontWeight="900"
                  fontSize="sm"
                >
                  ✦
                </Flex>
                <Box>
                  <HStack gap={2}>
                    <Text fontWeight="900" fontSize="md" lineHeight="1.1">
                      Berry AI — Drive-Thru Timer & Berry Board
                    </Text>
                    <Badge colorPalette="red" variant="solid" size="sm">
                      Competitor 2 Replica
                    </Badge>
                  </HStack>
                  <Text fontSize="2xs" color="gray.400">
                    Total Drive-Thru Visibility • Pre-Menu Queue, Line-Busting,
                    Pull-Ahead & POS Sync
                  </Text>
                </Box>
              </HStack>
            </HStack>

            {/* Simulation Controls */}
            <HStack gap={2} wrap="wrap">
              <Badge
                colorPalette={state.isRunning ? 'green' : 'gray'}
                variant="solid"
                px={2.5}
                py={1}
                borderRadius="full"
              >
                {state.isRunning ? `● LIVE (${state.speed}x)` : '⏸ PAUSED'}
              </Badge>
              <Button
                size="xs"
                variant="outline"
                color="gray.100"
                borderColor="gray.700"
                onClick={sim.toggleRunning}
              >
                {state.isRunning ? <Pause size={13} /> : <Play size={13} />}
                {state.isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button
                size="xs"
                variant="outline"
                color="gray.100"
                borderColor="gray.700"
                onClick={sim.toggleSpeed}
              >
                <FastForward size={13} />
                Speed {state.speed}x
              </Button>
              <Button
                size="xs"
                colorPalette={state.surgeMode ? 'red' : 'gray'}
                variant="solid"
                onClick={sim.toggleSurgeMode}
              >
                <Zap size={13} />
                {state.surgeMode ? '6+ Queue Surge: ON' : 'Normal Queue'}
              </Button>
              <Button
                size="xs"
                colorPalette={state.lineBusterActive ? 'green' : 'gray'}
                variant="solid"
                onClick={sim.toggleLineBuster}
              >
                <Smartphone size={13} />
                Line-Buster: {state.lineBusterActive ? 'ON' : 'OFF'}
              </Button>
              <Button
                asChild
                size="xs"
                variant="ghost"
                color="gray.300"
              >
                <a
                  href="https://www.berry-ai.com/solutions/ai-drive-thru-timer/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Site <ExternalLink size={12} />
                </a>
              </Button>
            </HStack>
          </Flex>

          {/* Role-Based Navigation Switcher */}
          <HStack gap={2} mt={3} pt={2.5} borderTopWidth="1px" borderColor="gray.800" wrap="wrap">
            {BERRY_ROLES.map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path
              return (
                <Button
                  key={item.path}
                  asChild
                  size="sm"
                  variant={active ? 'solid' : 'ghost'}
                  colorPalette={active ? 'red' : 'gray'}
                  color={active ? 'white' : 'gray.300'}
                >
                  <Link to={item.path}>
                    <Icon size={15} />
                    {item.label}
                  </Link>
                </Button>
              )
            })}
          </HStack>
        </Container>
      </Box>

      {/* Active Role / View Content */}
      <Container maxW="7xl" py={6}>
        <Routes>
          <Route index element={<BerryFrontlineView sim={sim} />} />
          <Route path="aerial" element={<BerryAerialView sim={sim} />} />
          <Route path="manager" element={<BerryManagerView sim={sim} />} />
          <Route path="leadership" element={<BerryLeadershipView />} />
        </Routes>
      </Container>
    </Box>
  )
}
