import { useEffect, useState } from 'react'
import {
  Badge,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Input,
  SimpleGrid,
  Table,
  Text,
  VStack,
} from '@chakra-ui/react'
import {
  ArrowRight,
  Check,
  ClipboardCheck,
  Compass,
  ExternalLink,
  Layers,
  RotateCcw,
  Sparkles,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  COMPETITOR_FEATURES,
  FEATURE_CATEGORIES,
  type AdoptionDecision,
  type FeatureCategory,
} from '../data/competitorComparison'

interface SavedFeaturePrefs {
  decisions: Record<string, AdoptionDecision>
  notes: Record<string, string>
}

const STORAGE_KEY = 'drive-thru-poc-feature-decisions-v1'

function getInitialPrefs(): SavedFeaturePrefs {
  const fallbackDecisions: Record<string, AdoptionDecision> = {}
  const fallbackNotes: Record<string, string> = {}
  for (const f of COMPETITOR_FEATURES) {
    fallbackDecisions[f.id] = f.defaultDecision
    fallbackNotes[f.id] = f.defaultNote
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return { decisions: fallbackDecisions, notes: fallbackNotes }
    const parsed = JSON.parse(raw) as Partial<SavedFeaturePrefs>
    return {
      decisions: { ...fallbackDecisions, ...(parsed.decisions ?? {}) },
      notes: { ...fallbackNotes, ...(parsed.notes ?? {}) },
    }
  } catch {
    return { decisions: fallbackDecisions, notes: fallbackNotes }
  }
}

export function HomePage() {
  const [prefs, setPrefs] = useState<SavedFeaturePrefs>(getInitialPrefs)
  const [selectedCategory, setSelectedCategory] = useState<
    'All' | FeatureCategory
  >('All')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
    } catch {
      // ignore storage quota errors
    }
  }, [prefs])

  const setDecision = (id: string, decision: AdoptionDecision) => {
    setPrefs((prev) => ({
      ...prev,
      decisions: { ...prev.decisions, [id]: decision },
    }))
  }

  const setNote = (id: string, note: string) => {
    setPrefs((prev) => ({
      ...prev,
      notes: { ...prev.notes, [id]: note },
    }))
  }

  const resetDefaults = () => {
    window.localStorage.removeItem(STORAGE_KEY)
    const decisions: Record<string, AdoptionDecision> = {}
    const notes: Record<string, string> = {}
    for (const f of COMPETITOR_FEATURES) {
      decisions[f.id] = f.defaultDecision
      notes[f.id] = f.defaultNote
    }
    setPrefs({ decisions, notes })
  }

  const copySummaryMarkdown = async () => {
    const lines = [
      '# Drive-Thru Vision AI Feature Selection Summary',
      '',
      ...COMPETITOR_FEATURES.map((f) => {
        const dec = (prefs.decisions[f.id] ?? f.defaultDecision).toUpperCase()
        const note = prefs.notes[f.id] ?? f.defaultNote
        return `- **[${dec}] ${f.feature}** (${f.category}) — ${note}`
      }),
    ]
    await navigator.clipboard.writeText(lines.join('\n'))
    setCopied(true)
    window.setTimeout(() => setCopied(false), 2000)
  }

  const visibleFeatures =
    selectedCategory === 'All'
      ? COMPETITOR_FEATURES
      : COMPETITOR_FEATURES.filter((f) => f.category === selectedCategory)

  const adoptCount = COMPETITOR_FEATURES.filter(
    (f) => prefs.decisions[f.id] === 'adopt',
  ).length
  const evaluateCount = COMPETITOR_FEATURES.filter(
    (f) => prefs.decisions[f.id] === 'evaluate',
  ).length
  const skipCount = COMPETITOR_FEATURES.filter(
    (f) => prefs.decisions[f.id] === 'skip',
  ).length

  return (
    <Box minH="100vh" bg="#f8fafc" color="gray.900">
      {/* Top POC Hero & Purpose Definition */}
      <Box
        bg="gray.950"
        color="white"
        borderBottomWidth="1px"
        borderColor="gray.800"
      >
        <Container maxW="7xl" py={{ base: 10, md: 14 }}>
          <VStack align="flex-start" gap={4} maxW="4xl">
            <HStack gap={2} wrap="wrap">
              <Badge colorPalette="purple" variant="solid" px={3} py={1} borderRadius="full">
                DRIVE-THRU VISION AI • COMPETITOR RESEARCH POC
              </Badge>
              <Badge colorPalette="gray" variant="subtle" px={2.5} py={1} borderRadius="full">
                Interactive Simulations Included
              </Badge>
            </HStack>

            <Heading
              as="h1"
              fontSize={{ base: '3xl', md: '5xl' }}
              fontWeight="900"
              lineHeight="1.1"
              letterSpacing="tight"
            >
              Drive-Thru Performance Platform — Competitor Discovery Lab
            </Heading>

            <Text fontSize={{ base: 'md', md: 'lg' }} color="gray.300" lineHeight="1.65">
              This Proof of Concept replicates the core workflows, live crew
              boards, AI camera overlays, and management reporting of{' '}
              <Text as="span" color="white" fontWeight="700">
                Fingermark (Eyecue)
              </Text>{' '}
              and{' '}
              <Text as="span" color="white" fontWeight="700">
                Berry AI
              </Text>
              . Each experience is isolated on its own route with live
              interactive simulations so our team can evaluate how each
              competitor replaces legacy loop timers — and decide which
              capabilities to build into our own platform.
            </Text>

            <HStack gap={3} pt={2} wrap="wrap">
              <Button asChild size="lg" colorPalette="blue">
                <Link to="/fingermark">
                  Explore Fingermark Example
                  <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" colorPalette="red">
                <Link to="/berry-ai">
                  Explore Berry-AI Example
                  <ArrowRight size={18} />
                </Link>
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>

      <Container maxW="7xl" py={10}>
        <VStack gap={10} align="stretch">
          {/* Why Vision AI Over Legacy Loop Timers (POC Context) */}
          <SimpleGrid columns={{ base: 1, md: 3 }} gap={5}>
            <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
              <HStack gap={2} mb={2}>
                <Compass size={18} color="#2563eb" />
                <Text fontWeight="800" fontSize="sm">
                  1. Eliminate Loop Blind Spots
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.600" lineHeight="1.6">
                In-ground magnetic loops cannot see pre-speaker queues, mid-lane
                bailouts, curbside pickup, or staff pulling cars past window
                sensors (&ldquo;loop gaming&rdquo;). Both competitors solve this
                end-to-end with Vision AI.
              </Text>
            </Box>
            <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
              <HStack gap={2} mb={2}>
                <Sparkles size={18} color="#7c3aed" />
                <Text fontWeight="800" fontSize="sm">
                  2. Different Strategic Angles
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.600" lineHeight="1.6">
                <strong>Fingermark</strong> connects outside lanes with indoor
                back-of-house kitchen stations (fryer levels, prescriptive
                prompts, audio Daily Pulse). <strong>Berry AI</strong> excels at
                high-contrast crew lane TV boards, tablet line-busting, and POS
                vehicle ID matching.
              </Text>
            </Box>
            <Box bg="white" p={5} borderRadius="2xl" borderWidth="1px" borderColor="gray.200">
              <HStack gap={2} mb={2}>
                <Layers size={18} color="#16a34a" />
                <Text fontWeight="800" fontSize="sm">
                  3. Separate Routes, Shared Learnings
                </Text>
              </HStack>
              <Text fontSize="xs" color="gray.600" lineHeight="1.6">
                Launch either competitor below to test rush surges, trigger
                alerts, toggle AI bounding boxes, and explore role-based
                dashboards — then score each feature in the comparison matrix.
              </Text>
            </Box>
          </SimpleGrid>

          {/* 2 Separate Competitor App Launch Cards */}
          <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
            {/* Competitor 1: Fingermark Card */}
            <GridItem>
              <Box
                bg="white"
                borderRadius="2xl"
                borderWidth="2px"
                borderColor="blue.200"
                p={6}
                shadow="sm"
                h="full"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box>
                  <Flex justify="space-between" align="flex-start" mb={3}>
                    <HStack gap={3}>
                      <Flex
                        w="42px"
                        h="42px"
                        borderRadius="xl"
                        bg="#2435e8"
                        color="white"
                        align="center"
                        justify="center"
                        fontWeight="900"
                      >
                        FM
                      </Flex>
                      <Box>
                        <Badge colorPalette="blue" size="sm">
                          Competitor 1
                        </Badge>
                        <Heading as="h2" size="lg" fontWeight="900">
                          Fingermark — Eyecue™
                        </Heading>
                      </Box>
                    </HStack>
                    <Button asChild size="xs" variant="ghost" colorPalette="gray">
                      <a
                        href="https://fingermark.ai/drive-thru-performance"
                        target="_blank"
                        rel="noreferrer"
                      >
                        fingermark.ai <ExternalLink size={12} />
                      </a>
                    </Button>
                  </Flex>

                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Focuses on 98%-accurate end-to-end stage gauges, Wait Bay
                    accountability, joining the dots between front-of-house
                    queues and back-of-house workstations (fryer/beverage),
                    real-time prescriptive alerts, and mobile Daily Pulse
                    campaigns.
                  </Text>

                  <VStack align="stretch" gap={2} mb={5} fontSize="xs" color="gray.700">
                    <Text>
                      • <strong>Live Store Board:</strong> 5-stage rings, 3
                      Parked Car bays, OEPE% Last Hour/Day gauges, 5-hr bar
                      chart & 15-min pacing thermometer
                    </Text>
                    <Text>
                      • <strong>Trigger-Based Alerts:</strong> Full-screen crew
                      action overlays (Wait Bay 12m alert & Fry Hopper prompt)
                    </Text>
                    <Text>
                      • <strong>Vision AI & Context Capture:</strong> FOH + BOH
                      camera heatmaps & tagged coaching clips
                    </Text>
                    <Text>
                      • <strong>Daily Pulse & Leaderboards:</strong> Mobile
                      audio report + multi-store OEPE rankings
                    </Text>
                  </VStack>
                </Box>

                <VStack align="stretch" gap={2.5}>
                  <Button asChild colorPalette="blue" size="md" w="full">
                    <Link to="/fingermark">
                      Launch Fingermark App Simulation
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                  <HStack gap={2} wrap="wrap" justify="center">
                    <Button asChild size="xs" variant="subtle" colorPalette="blue">
                      <Link to="/fingermark/vision">Vision & Clips</Link>
                    </Button>
                    <Button asChild size="xs" variant="subtle" colorPalette="blue">
                      <Link to="/fingermark/pulse">Daily Pulse</Link>
                    </Button>
                    <Button asChild size="xs" variant="subtle" colorPalette="blue">
                      <Link to="/fingermark/leaderboards">Leaderboards</Link>
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </GridItem>

            {/* Competitor 2: Berry AI Card */}
            <GridItem>
              <Box
                bg="white"
                borderRadius="2xl"
                borderWidth="2px"
                borderColor="red.200"
                p={6}
                shadow="sm"
                h="full"
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
              >
                <Box>
                  <Flex justify="space-between" align="flex-start" mb={3}>
                    <HStack gap={3}>
                      <Flex
                        w="42px"
                        h="42px"
                        borderRadius="xl"
                        bg="#e11d48"
                        color="white"
                        align="center"
                        justify="center"
                        fontWeight="900"
                        fontSize="lg"
                      >
                        ✦
                      </Flex>
                      <Box>
                        <Badge colorPalette="red" size="sm">
                          Competitor 2
                        </Badge>
                        <Heading as="h2" size="lg" fontWeight="900">
                          Berry AI — Drive-Thru Timer
                        </Heading>
                      </Box>
                    </HStack>
                    <Button asChild size="xs" variant="ghost" colorPalette="gray">
                      <a
                        href="https://www.berry-ai.com/solutions/ai-drive-thru-timer/"
                        target="_blank"
                        rel="noreferrer"
                      >
                        berry-ai.com <ExternalLink size={12} />
                      </a>
                    </Button>
                  </Flex>

                  <Text fontSize="sm" color="gray.600" mb={4}>
                    Focuses on un-gameable exterior lane timing across pre-menu
                    queues, dual speakers, pull-ahead zones, curbside stalls,
                    and outdoor tablet line-busting — tailored into 3 distinct
                    role views (Frontline, Store Manager, Brand Leadership).
                  </Text>

                  <VStack align="stretch" gap={2} mb={5} fontSize="xs" color="gray.700">
                    <Text>
                      • <strong>Frontline Dark TV Monitor:</strong> 6 giant
                      color-coded KPI tiles, U-shaped dual-lane car tracker &
                      split-screen live AI camera feeds (#0628xx IDs)
                    </Text>
                    <Text>
                      • <strong>Full-Lot Aerial vs. Loops:</strong> Interactive
                      map comparing Vision AI vs. legacy loop blind spots
                    </Text>
                    <Text>
                      • <strong>Store Manager (Berry Board):</strong> Hourly SoS
                      vs. drive-off chart + live POS-matched transaction table
                    </Text>
                    <Text>
                      • <strong>Brand Leadership BI:</strong> 5-quarter rollout
                      analytics & interactive Lost Revenue Calculator
                    </Text>
                  </VStack>
                </Box>

                <VStack align="stretch" gap={2.5}>
                  <Button asChild colorPalette="red" size="md" w="full">
                    <Link to="/berry-ai">
                      Launch Berry-AI App Simulation
                      <ArrowRight size={16} />
                    </Link>
                  </Button>
                  <HStack gap={2} wrap="wrap" justify="center">
                    <Button asChild size="xs" variant="subtle" colorPalette="red">
                      <Link to="/berry-ai/aerial">Aerial vs. Loops</Link>
                    </Button>
                    <Button asChild size="xs" variant="subtle" colorPalette="red">
                      <Link to="/berry-ai/manager">Manager Board</Link>
                    </Button>
                    <Button asChild size="xs" variant="subtle" colorPalette="red">
                      <Link to="/berry-ai/leadership">Leadership & ROI</Link>
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </GridItem>
          </Grid>

          {/* Interactive Competitor Comparison & Feature Selection Matrix */}
          <Box
            bg="white"
            borderRadius="2xl"
            borderWidth="1px"
            borderColor="gray.200"
            p={{ base: 4, md: 6 }}
            shadow="sm"
          >
            <Flex
              justify="space-between"
              align={{ base: 'flex-start', lg: 'center' }}
              direction={{ base: 'column', lg: 'row' }}
              gap={4}
              mb={5}
            >
              <Box>
                <Heading as="h2" size="lg" fontWeight="900">
                  Side-by-Side Feature Comparison & Roadmap Matrix
                </Heading>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Compare Fingermark vs. Berry AI capabilities and mark what we
                  want to utilize in our own system (saved automatically in your
                  browser).
                </Text>
              </Box>

              <HStack gap={2} wrap="wrap">
                <Badge colorPalette="green" variant="solid" px={2.5} py={1}>
                  Adopt: {adoptCount}
                </Badge>
                <Badge colorPalette="yellow" variant="solid" px={2.5} py={1}>
                  Evaluate: {evaluateCount}
                </Badge>
                <Badge colorPalette="gray" variant="subtle" px={2.5} py={1}>
                  Skip: {skipCount}
                </Badge>
                <Button size="xs" variant="outline" onClick={copySummaryMarkdown}>
                  {copied ? <Check size={13} /> : <ClipboardCheck size={13} />}
                  {copied ? 'Copied Markdown!' : 'Copy Summary'}
                </Button>
                <Button size="xs" variant="ghost" onClick={resetDefaults}>
                  <RotateCcw size={13} />
                  Reset
                </Button>
              </HStack>
            </Flex>

            {/* Category Filter Pills */}
            <HStack gap={2} mb={5} wrap="wrap">
              <Button
                size="xs"
                variant={selectedCategory === 'All' ? 'solid' : 'outline'}
                colorPalette="gray"
                onClick={() => setSelectedCategory('All')}
              >
                All ({COMPETITOR_FEATURES.length})
              </Button>
              {FEATURE_CATEGORIES.map((cat) => (
                <Button
                  key={cat}
                  size="xs"
                  variant={selectedCategory === cat ? 'solid' : 'outline'}
                  colorPalette="purple"
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </Button>
              ))}
            </HStack>

            <Box overflowX="auto">
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  <Table.Row bg="gray.50">
                    <Table.ColumnHeader minW="210px">
                      Capability & Operational Value
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW="230px">
                      Fingermark (Eyecue)
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW="230px">
                      Berry AI (Timer & Board)
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW="165px">
                      Our Decision
                    </Table.ColumnHeader>
                    <Table.ColumnHeader minW="220px">
                      Implementation Notes
                    </Table.ColumnHeader>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {visibleFeatures.map((item) => {
                    const decision =
                      prefs.decisions[item.id] ?? item.defaultDecision
                    const note = prefs.notes[item.id] ?? item.defaultNote
                    return (
                      <Table.Row key={item.id} verticalAlign="top">
                        <Table.Cell py={3.5}>
                          <Badge
                            colorPalette="purple"
                            variant="subtle"
                            size="sm"
                            mb={1}
                          >
                            {item.category}
                          </Badge>
                          <Text fontWeight="800" fontSize="sm" color="gray.900">
                            {item.feature}
                          </Text>
                          <Text fontSize="xs" color="gray.500" mt={0.5}>
                            {item.whyItMatters}
                          </Text>
                        </Table.Cell>

                        <Table.Cell py={3.5}>
                          <Badge
                            colorPalette={
                              item.fingermark.supported === 'full'
                                ? 'blue'
                                : 'orange'
                            }
                            size="sm"
                            mb={1}
                          >
                            {item.fingermark.supported === 'full'
                              ? 'Core Feature'
                              : 'Partial / Secondary'}
                          </Badge>
                          <Text fontSize="xs" color="gray.700" lineHeight="1.5">
                            {item.fingermark.detail}
                          </Text>
                        </Table.Cell>

                        <Table.Cell py={3.5}>
                          <Badge
                            colorPalette={
                              item.berryAi.supported === 'full'
                                ? 'red'
                                : 'orange'
                            }
                            size="sm"
                            mb={1}
                          >
                            {item.berryAi.supported === 'full'
                              ? 'Core Feature'
                              : 'Partial / Secondary'}
                          </Badge>
                          <Text fontSize="xs" color="gray.700" lineHeight="1.5">
                            {item.berryAi.detail}
                          </Text>
                        </Table.Cell>

                        <Table.Cell py={3.5}>
                          <HStack gap={1}>
                            {(
                              [
                                ['adopt', 'Adopt', 'green'],
                                ['evaluate', 'Eval', 'yellow'],
                                ['skip', 'Skip', 'gray'],
                              ] as const
                            ).map(([val, label, palette]) => (
                              <Button
                                key={val}
                                size="2xs"
                                variant={decision === val ? 'solid' : 'outline'}
                                colorPalette={palette}
                                onClick={() => setDecision(item.id, val)}
                              >
                                {label}
                              </Button>
                            ))}
                          </HStack>
                        </Table.Cell>

                        <Table.Cell py={3.5}>
                          <Input
                            size="xs"
                            value={note}
                            onChange={(e) => setNote(item.id, e.target.value)}
                            placeholder="Add product note..."
                          />
                        </Table.Cell>
                      </Table.Row>
                    )
                  })}
                </Table.Body>
              </Table.Root>
            </Box>
          </Box>
        </VStack>
      </Container>
    </Box>
  )
}
