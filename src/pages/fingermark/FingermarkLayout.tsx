import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  ArrowLeft,
  BellRing,
  ExternalLink,
  FastForward,
  Flame,
  LayoutDashboard,
  Pause,
  Play,
  Smartphone,
  Trophy,
  Video,
  X,
  Zap,
} from 'lucide-react'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { FingermarkDashboardView } from './FingermarkDashboardView'
import { FingermarkLeaderboardsView } from './FingermarkLeaderboardsView'
import { FingermarkPulseView } from './FingermarkPulseView'
import { FingermarkVisionView } from './FingermarkVisionView'
import { useFingermarkSim } from './useFingermarkSim'

const NAV_ITEMS = [
  { path: '/fingermark', label: 'Live Store Board', icon: LayoutDashboard },
  { path: '/fingermark/vision', label: 'Vision AI & Context Capture', icon: Video },
  { path: '/fingermark/pulse', label: 'Daily Pulse Report', icon: Smartphone },
  { path: '/fingermark/leaderboards', label: 'Network Leaderboards', icon: Trophy },
] as const

export function FingermarkLayout() {
  const sim = useFingermarkSim()
  const location = useLocation()
  const navigate = useNavigate()
  const { state } = sim

  return (
    <Box minH="100vh" bg="#f4f6fb" color="gray.900" position="relative">
      {/* Top Competitor Header */}
      <Box
        bg="white"
        borderBottomWidth="1px"
        borderColor="gray.200"
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
              <Button asChild size="xs" variant="ghost" colorPalette="gray">
                <Link to="/">
                  <ArrowLeft size={14} />
                  POC Home
                </Link>
              </Button>
              <Box h="20px" w="1px" bg="gray.200" />
              <HStack gap={2}>
                <Flex
                  w="30px"
                  h="30px"
                  borderRadius="lg"
                  bg="#2435e8"
                  color="white"
                  align="center"
                  justify="center"
                  fontWeight="900"
                  fontSize="sm"
                >
                  FM
                </Flex>
                <Box>
                  <HStack gap={2}>
                    <Text fontWeight="900" fontSize="md" lineHeight="1.1">
                      Fingermark Eyecue™
                    </Text>
                    <Badge colorPalette="blue" variant="solid" size="sm">
                      Competitor 1 Replica
                    </Badge>
                  </HStack>
                  <Text fontSize="2xs" color="gray.500">
                    End-to-End Drive-Thru + Back-of-House Vision AI Platform
                  </Text>
                </Box>
              </HStack>
            </HStack>

            {/* Live Simulation Controls */}
            <HStack gap={2} wrap="wrap">
              <Badge
                colorPalette={state.isRunning ? 'green' : 'gray'}
                variant="subtle"
                px={2.5}
                py={1}
                borderRadius="full"
              >
                {state.isRunning
                  ? `● LIVE SIM (${state.speed}x)`
                  : '⏸ PAUSED'}
              </Badge>
              <Button
                size="xs"
                variant="outline"
                onClick={sim.toggleRunning}
              >
                {state.isRunning ? <Pause size={13} /> : <Play size={13} />}
                {state.isRunning ? 'Pause' : 'Resume'}
              </Button>
              <Button
                size="xs"
                variant="outline"
                onClick={sim.toggleSpeed}
              >
                <FastForward size={13} />
                Speed {state.speed}x
              </Button>
              <Button
                size="xs"
                colorPalette={state.rushMode ? 'orange' : 'gray'}
                variant={state.rushMode ? 'solid' : 'outline'}
                onClick={sim.toggleRushMode}
              >
                <Zap size={13} />
                {state.rushMode ? 'Rush Hour: ON' : 'Simulate Rush'}
              </Button>
              <Button
                size="xs"
                colorPalette="green"
                variant="solid"
                onClick={sim.triggerWaitBayOverlay}
              >
                <BellRing size={13} />
                Wait Bay Alert
              </Button>
              <Button
                size="xs"
                colorPalette="red"
                variant="subtle"
                onClick={sim.triggerFryActionOverlay}
              >
                <Flame size={13} />
                Fry Alert
              </Button>
              <Button asChild size="xs" variant="ghost" colorPalette="blue">
                <a
                  href="https://fingermark.ai/drive-thru-performance"
                  target="_blank"
                  rel="noreferrer"
                >
                  Source Site <ExternalLink size={12} />
                </a>
              </Button>
            </HStack>
          </Flex>

          {/* Sub-route Navigation Tabs */}
          <HStack gap={2} mt={3} pt={2.5} borderTopWidth="1px" borderColor="gray.100" wrap="wrap">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon
              const active = location.pathname === item.path
              return (
                <Button
                  key={item.path}
                  asChild
                  size="sm"
                  variant={active ? 'solid' : 'ghost'}
                  colorPalette={active ? 'blue' : 'gray'}
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

      {/* Trigger-Based Full-Screen / Floating Alert Overlay (Eyecue signature) */}
      {state.activeOverlayAlert && (
        <Box
          position="fixed"
          inset={0}
          bg="rgba(255,255,255,0.78)"
          backdropFilter="blur(3px)"
          zIndex={50}
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={4}
        >
          <Box
            maxW="680px"
            w="full"
            bg={
              state.activeOverlayAlert.type === 'wait-bay'
                ? '#22c55e'
                : '#dc2626'
            }
            color="white"
            borderRadius="2xl"
            p={{ base: 6, md: 10 }}
            shadow="2xl"
            textAlign="center"
            position="relative"
          >
            <Button
              position="absolute"
              top={3}
              right={3}
              size="xs"
              variant="ghost"
              color="white"
              onClick={sim.dismissOverlayAlert}
            >
              <X size={18} />
            </Button>
            <Badge
              bg="rgba(0,0,0,0.22)"
              color="white"
              mb={3}
              px={3}
              py={1}
              borderRadius="full"
            >
              EYECUE REAL-TIME CREW GUIDANCE • {state.activeOverlayAlert.triggeredAt}
            </Badge>
            <Text fontSize={{ base: '3xl', md: '5xl' }} fontWeight="900" lineHeight="1.1">
              {state.activeOverlayAlert.title}
            </Text>
            <Text fontSize={{ base: 'lg', md: '2xl' }} fontWeight="700" mt={3}>
              {state.activeOverlayAlert.subtitle}
            </Text>
            <VStack mt={6} gap={3}>
              <Box
                bg="rgba(255,255,255,0.18)"
                px={5}
                py={2.5}
                borderRadius="xl"
                fontWeight="800"
                fontSize="md"
              >
                Action Required: {state.activeOverlayAlert.actionPrompt}
              </Box>
              <Button
                size="md"
                bg="white"
                color="gray.900"
                fontWeight="800"
                onClick={sim.dismissOverlayAlert}
              >
                Acknowledge & Clear Alert
              </Button>
            </VStack>
          </Box>
        </Box>
      )}

      {/* Active Sub-view Content */}
      <Container maxW="7xl" py={6}>
        <Routes>
          <Route
            index
            element={
              <FingermarkDashboardView
                sim={sim}
                onNavigateVision={() => navigate('/fingermark/vision')}
              />
            }
          />
          <Route
            path="vision"
            element={<FingermarkVisionView sim={sim} />}
          />
          <Route
            path="pulse"
            element={<FingermarkPulseView sim={sim} />}
          />
          <Route
            path="leaderboards"
            element={
              <FingermarkLeaderboardsView
                sim={sim}
                onInspectVision={() => navigate('/fingermark/vision')}
              />
            }
          />
        </Routes>
      </Container>
    </Box>
  )
}
