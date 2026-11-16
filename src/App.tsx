import { Box, Spinner, VStack } from '@chakra-ui/react'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './pages/HomePage'

const FingermarkLayout = lazy(() =>
  import('./pages/fingermark/FingermarkLayout').then((m) => ({
    default: m.FingermarkLayout,
  })),
)

const BerryLayout = lazy(() =>
  import('./pages/berry/BerryLayout').then((m) => ({
    default: m.BerryLayout,
  })),
)

export function App() {
  return (
    <Suspense
      fallback={
        <Box minH="100vh" display="flex" alignItems="center" justifyContent="center">
          <VStack gap={3}>
            <Spinner size="lg" color="blue.500" />
          </VStack>
        </Box>
      }
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/fingermark/*" element={<FingermarkLayout />} />
        <Route path="/berry-ai/*" element={<BerryLayout />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
