import { create } from 'zustand'
import { db } from '../storage/db'

interface OnboardingState {
  completed: boolean
  hydrated: boolean
  hydrate: () => Promise<void>
  complete: () => Promise<void>
}

const DEFAULT_STATE: Omit<OnboardingState, 'hydrate' | 'complete'> = {
  completed: false,
  hydrated: false,
}

export const useOnboardingStore = create<OnboardingState>()((set) => ({
  ...DEFAULT_STATE,
  async hydrate() {
    const record = await db.settings.get('onboarding')
    const completed = record && 'completed' in record ? record.completed : false
    set({ completed, hydrated: true })
  },
  async complete() {
    await db.settings.put({ id: 'onboarding', completed: true })
    set({ completed: true })
  },
}))

