import type { ZodiacSign } from './types'

export const ZODIAC_SIGNS: { sign: ZodiacSign; startDegree: number }[] = [
  { sign: 'Aries', startDegree: 0 },
  { sign: 'Taurus', startDegree: 30 },
  { sign: 'Gemini', startDegree: 60 },
  { sign: 'Cancer', startDegree: 90 },
  { sign: 'Leo', startDegree: 120 },
  { sign: 'Virgo', startDegree: 150 },
  { sign: 'Libra', startDegree: 180 },
  { sign: 'Scorpio', startDegree: 210 },
  { sign: 'Sagittarius', startDegree: 240 },
  { sign: 'Capricorn', startDegree: 270 },
  { sign: 'Aquarius', startDegree: 300 },
  { sign: 'Pisces', startDegree: 330 },
]

export function zodiacForLongitude(longitude: number): ZodiacSign {
  const normalized = ((longitude % 360) + 360) % 360
  const index = Math.floor(normalized / 30)
  return ZODIAC_SIGNS[index]?.sign ?? 'Aries'
}

