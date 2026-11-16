import { useEffect, useState } from 'react'
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
import { CheckCircle2, Sparkles, Volume2, VolumeX } from 'lucide-react'
import type { FingermarkSimController } from './useFingermarkSim'

export function FingermarkPulseView({
  sim,
}: {
  sim: FingermarkSimController
}) {
  const { state } = sim
  const [isPlayingAudio, setIsPlayingAudio] = useState(false)
  const [audioProgress, setAudioProgress] = useState(0)

  useEffect(() => {
    if (!isPlayingAudio) return
    const id = window.setInterval(() => {
      setAudioProgress((p) => {
        if (p >= 100) {
          setIsPlayingAudio(false)
          return 0
        }
        return p + 5
      })
    }, 350)
    return () => window.clearInterval(id)
  }, [isPlayingAudio])

  return (
    <Grid templateColumns={{ base: '1fr', lg: '390px 1fr' }} gap={6} alignItems="start">
      {/* Mobile Phone Frame — Exact Eyecue Daily Pulse Replica */}
      <GridItem>
        <Box
          mx="auto"
          maxW="370px"
          bg="gray.900"
          p={3}
          borderRadius="3xl"
          shadow="xl"
          borderWidth="3px"
          borderColor="gray.700"
        >
          <Box bg="white" borderRadius="2xl" p={5} overflow="hidden">
            {/* Eyecue Top Bar */}
            <Flex justify="center" pb={3} borderBottomWidth="1px" borderColor="gray.200">
              <HStack gap={1.5}>
                <Box w="18px" h="18px" borderRadius="md" bg="blue.600" />
                <Text fontWeight="900" fontSize="md" color="gray.900">
                  Eyecue
                </Text>
              </HStack>
            </Flex>

            <VStack gap={3} mt={4} align="stretch">
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="800" color="gray.900">
                  Daily Pulse
                </Text>
                <Text fontSize="xs" color="gray.500" mt={0.5}>
                  Store #104 • Yesterday&apos;s Performance Summary
                </Text>
                <Button
                  mt={2.5}
                  size="xs"
                  borderRadius="full"
                  bg="#2435e8"
                  color="white"
                  px={4}
                  onClick={() => {
                    setIsPlayingAudio((v) => !v)
                    if (!isPlayingAudio) setAudioProgress(5)
                  }}
                >
                  {isPlayingAudio ? <VolumeX size={13} /> : <Volume2 size={13} />}
                  {isPlayingAudio
                    ? `Playing Audio Briefing (${audioProgress}%)`
                    : 'Play this report'}
                </Button>
              </Box>

              {/* Weekly Campaign Pill */}
              <Box
                bg="#2435e8"
                color="white"
                borderRadius="2xl"
                py={3}
                px={4}
                textAlign="center"
              >
                <Text fontSize="2xs" opacity={0.85} fontWeight="600">
                  Weekly campaign
                </Text>
                <Text fontSize="md" fontWeight="800">
                  Improve present times
                </Text>
              </Box>

              {/* Presenter Times Card */}
              <Box
                bg="#2435e8"
                color="white"
                borderRadius="2xl"
                p={5}
                textAlign="center"
              >
                <Text fontSize="xs" opacity={0.9} fontWeight="600">
                  Presenter times
                </Text>
                <HStack justify="center" align="baseline" mt={1} gap={1}>
                  <Text fontSize="5xl" fontWeight="900" lineHeight="1">
                    {state.presentWindowSec}
                  </Text>
                  <Text fontSize="sm" fontWeight="700">
                    sec
                  </Text>
                </HStack>

                <SimpleGrid columns={3} gap={2} mt={4}>
                  <Box>
                    <HStack justify="center" gap={1}>
                      <Text fontWeight="800" fontSize="sm">
                        -9s
                      </Text>
                      <Text color="green.300" fontSize="xs">
                        ▼
                      </Text>
                    </HStack>
                    <Text fontSize="2xs" opacity={0.8}>
                      Vs. Previous day
                    </Text>
                  </Box>
                  <Box>
                    <HStack justify="center" gap={1}>
                      <Text fontWeight="800" fontSize="sm">
                        -16s
                      </Text>
                      <Text color="green.300" fontSize="xs">
                        ▼
                      </Text>
                    </HStack>
                    <Text fontSize="2xs" opacity={0.8}>
                      Vs. Last week
                    </Text>
                  </Box>
                  <Box>
                    <HStack justify="center" gap={1}>
                      <Text fontWeight="800" fontSize="sm">
                        -15s
                      </Text>
                      <Text color="green.300" fontSize="xs">
                        ▼
                      </Text>
                    </HStack>
                    <Text fontSize="2xs" opacity={0.8}>
                      Vs. 8 Week avg
                    </Text>
                  </Box>
                </SimpleGrid>
              </Box>

              {/* Campaign Action Areas */}
              <Text
                fontSize="xs"
                fontWeight="800"
                color="#2435e8"
                textAlign="center"
                mt={1}
              >
                Campaign action areas
              </Text>

              <Box bg="#2435e8" color="white" borderRadius="xl" p={3.5} fontSize="xs">
                4 times yesterday when the Drive-Thru stack was backing up there
                were no fries in the fryer and the fry bay was at 15%. This held
                up leading orders and quickly backed up the stack.
              </Box>

              <Box
                bg="blue.100"
                color="blue.950"
                borderRadius="xl"
                p={3.5}
                fontSize="xs"
                fontWeight="600"
              >
                Action: When entry zone is triggered for &ldquo;slowing&rdquo;,
                ensure fry bay is at least 60% and more fries are draining or in
                the fryer.
              </Box>

              <Box bg="#2435e8" color="white" borderRadius="xl" p={3.5} fontSize="xs">
                There were 3 times yesterday during breakfast that cars at
                present were waiting for multiple coffees.
              </Box>
            </VStack>
          </Box>
        </Box>
      </GridItem>

      {/* Right Column: Manager Highlights, Lowlights & Shift Breakdown */}
      <GridItem>
        <VStack gap={5} align="stretch">
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            p={6}
          >
            <HStack justify="space-between" mb={3} wrap="wrap">
              <HStack gap={2}>
                <Sparkles size={18} color="#2435e8" />
                <Text fontWeight="800" fontSize="lg" color="gray.900">
                  AI-Enabled Daily & Weekly Pulse Insights
                </Text>
              </HStack>
              <Badge colorPalette="blue">Delivered 6:00 AM Daily</Badge>
            </HStack>
            <Text fontSize="sm" color="gray.600" mb={5}>
              Instead of forcing store managers to dig through spreadsheets,
              Eyecue synthesizes front-of-house lane timers and back-of-house
              workstation observations into one focused weekly campaign with
              concrete pre-shift huddle talking points.
            </Text>

            <SimpleGrid columns={{ base: 1, md: 2 }} gap={4}>
              <Box
                p={4}
                borderRadius="xl"
                bg="green.50"
                borderWidth="1px"
                borderColor="green.200"
              >
                <Text fontWeight="800" fontSize="sm" color="green.800" mb={2}>
                  Performance Highlights
                </Text>
                <VStack align="stretch" gap={2} fontSize="xs" color="green.900">
                  <HStack align="flex-start" gap={2}>
                    <CheckCircle2 size={15} />
                    <Text>
                      08:00–09:00 AM breakfast peak hit 97% OEPE across 214
                      vehicles (best shift this month).
                    </Text>
                  </HStack>
                  <HStack align="flex-start" gap={2}>
                    <CheckCircle2 size={15} />
                    <Text>
                      COD 1 greeting & order completion improved by 6s after
                      headset routing adjustment.
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              <Box
                p={4}
                borderRadius="xl"
                bg="orange.50"
                borderWidth="1px"
                borderColor="orange.200"
              >
                <Text fontWeight="800" fontSize="sm" color="orange.800" mb={2}>
                  Performance Lowlights & Focus
                </Text>
                <VStack align="stretch" gap={2} fontSize="xs" color="orange.900">
                  <Text>
                    • Parked Car % reached 12% between 09:15 and 10:00 AM
                    (target &lt;7%), driven by late fry drops.
                  </Text>
                  <Text>
                    • 4 Pull-outs occurred when Pre-Order wait exceeded 105s.
                  </Text>
                </VStack>
              </Box>
            </SimpleGrid>
          </Box>

          {/* Shift-by-Shift Breakdown */}
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            p={6}
          >
            <Text fontWeight="800" fontSize="md" color="gray.900" mb={4}>
              Yesterday&apos;s Daypart Breakdown
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 4 }} gap={3}>
              {[
                { shift: 'Breakfast (6–10a)', cars: 558, oepe: '88%', parked: '5.4%' },
                { shift: 'Lunch (11a–2p)', cars: 492, oepe: '81%', parked: '9.1%' },
                { shift: 'Afternoon (2–5p)', cars: 264, oepe: '74%', parked: '12.0%' },
                { shift: 'Dinner (5–9p)', cars: 418, oepe: '84%', parked: '6.8%' },
              ].map((s) => (
                <Box
                  key={s.shift}
                  p={3.5}
                  borderRadius="xl"
                  bg="gray.50"
                  borderWidth="1px"
                  borderColor="gray.200"
                >
                  <Text fontSize="xs" fontWeight="800" color="gray.700">
                    {s.shift}
                  </Text>
                  <Text fontSize="2xl" fontWeight="900" color="gray.900" mt={1}>
                    {s.oepe}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {s.cars} cars • Parked {s.parked}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </GridItem>
    </Grid>
  )
}
