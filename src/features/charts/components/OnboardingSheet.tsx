import { useEffect } from 'react'
import { ChartForm, type ChartFormValues } from './ChartForm'
import { ThemeToggle } from '@/components/ThemeToggle'
import { useOnboardingStore } from '@/lib/state/onboardingStore'
import { useChartStore } from '@/lib/state/chartStore'
import { convertFormValuesToChartInput } from '../utils/convertFormValues'

export function OnboardingSheet() {
  const hydrate = useOnboardingStore((state) => state.hydrate)
  const hydrated = useOnboardingStore((state) => state.hydrated)
  const completed = useOnboardingStore((state) => state.completed)
  const complete = useOnboardingStore((state) => state.complete)
  const createChart = useChartStore((state) => state.createChart)

  useEffect(() => {
    if (!hydrated) {
      void hydrate()
    }
  }, [hydrated, hydrate])

  if (!hydrated || completed) {
    return null
  }

  const handleSubmit = async (values: ChartFormValues) => {
    const payload = convertFormValuesToChartInput(values)
    await createChart(payload)
    await complete()
  }

  return (
    <div className="onboarding-backdrop">
      <section className="glass-panel onboarding-sheet">
        <p className="eyebrow">Welcome aboard</p>
        <h2>Set your vibe & create the first chart.</h2>
        <ThemeToggle variant="inline" />
        <ChartForm onSubmit={handleSubmit} submitLabel="Create and continue" resetOnSuccess />
        <button className="btn ghost" type="button" onClick={() => complete()}>
          Skip for now
        </button>
      </section>
    </div>
  )
}

