import { describe, expect, it } from 'vitest'
import { zodiacForLongitude } from './zodiac'

describe('zodiacForLongitude', () => {
  it('wraps degrees greater than 360', () => {
    expect(zodiacForLongitude(390)).toBe('Taurus')
  })

  it('wraps negative degrees', () => {
    expect(zodiacForLongitude(-15)).toBe('Pisces')
  })

  it('maps boundaries correctly', () => {
    expect(zodiacForLongitude(0)).toBe('Aries')
    expect(zodiacForLongitude(180)).toBe('Libra')
  })
})

