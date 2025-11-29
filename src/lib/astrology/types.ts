export type CelestialBody =
  | 'Sun'
  | 'Moon'
  | 'Mercury'
  | 'Venus'
  | 'Mars'
  | 'Jupiter'
  | 'Saturn'
  | 'Uranus'
  | 'Neptune'
  | 'Pluto'
  | 'Ascendant'

export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces'

export interface BirthDetails {
  timestamp: string
  latitude: number
  longitude: number
  elevationMeters?: number
}

export interface PlanetPosition {
  body: CelestialBody
  longitude: number
  latitude: number
  sign: ZodiacSign
  house: number
  retrograde: boolean
}

export interface HousePosition {
  house: number
  cuspLongitude: number
  sign: ZodiacSign
}

export interface BirthChart {
  computedAt: string
  details: BirthDetails
  planets: PlanetPosition[]
  houses: HousePosition[]
}

